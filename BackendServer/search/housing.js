const consts = require( "../constants" );
const AWS = require( 'aws-sdk' );
AWS.config.update( { region:'us-west-2' } );
const ddb = new AWS.DynamoDB( { apiVersion: '2012-08-10' } );
const ddbGeo = require('dynamodb-geo');
const config = new ddbGeo.GeoDataManagerConfiguration( ddb, consts.HOUSING.TABLE );
const geoTableManager = new ddbGeo.GeoDataManager( config );
const utils = require('../util');
const DB = require( "../db/databaseAccess" );
const zillow = require('node-zillow');
const DEFAULT_RADIUS = 25; // miles


exports.getHousingByCoordinates = ( userObj, lat, long, radius ) => {
    return new Promise( ( resolve, reject ) => {
        geoTableManager.queryRadius({
            RadiusInMeter: utils.milesToKm( radius ? parseInt( radius ) : DEFAULT_RADIUS ) * 1000,
            CenterPoint:{
                latitude: parseFloat( lat ),
                longitude: parseFloat( long )
            }
        }).then( housingResults => {
            let cleanHousingResults = [];
            let keys = consts.HOUSING.DB_KEYS;
            let prefBeds = userObj[consts.PROF_KEYS.PREFS_HOUSE_BEDS];
            let prefBaths = userObj[consts.PROF_KEYS.PREFS_HOUSE_BATHS];
            let purchaseTypes = userObj[consts.PROF_KEYS.PREFS_HOUSE_PURCHASE_TYPE];

            housingResults.forEach( result => {
                // Types are allowed to be null
                let type = result[keys.TYPE].S ? result[keys.TYPE].S : null;

                let house = {
                    [keys.STREET]:result[keys.STREET].S,
                    [keys.CITY]:result[keys.CITY].S,
                    [keys.STATE]:result[keys.STATE].S,
                    [keys.ZIP]:result[keys.ZIP].S,
                    [keys.PHOTO_LINK]:result[keys.PHOTO_LINK].S,
                    [keys.DETAILS_LINK]:result[keys.DETAILS_LINK].S,
                    [keys.PRICE]:result[keys.PRICE].S,
                    [keys.TYPE]:type,
                    [keys.FULL_BATHS]:parseInt( result[keys.FULL_BATHS].N ),
                    [keys.HALF_BATHS]:parseInt(result[keys.HALF_BATHS].N ),
                    [keys.BEDS]:parseInt( result[keys.BEDS].N ),
                    [keys.LAT]:parseFloat( result[keys.LAT].N ),
                    [keys.LONG]:parseFloat( result[keys.LONG].N ),
                    [keys.RANGE_KEY]: result[keys.RANGE_KEY].S,
                    [keys.PURCHASE_TYPE]: result[keys.PURCHASE_TYPE].S
                };

                // Filter by preference
                if( house[keys.BEDS] >= prefBeds &&
                    house[keys.FULL_BATHS] + house[keys.HALF_BATHS] >= prefBaths &&
                    purchaseTypes.includes( house[keys.PURCHASE_TYPE] )
                ){
                    cleanHousingResults.push( house );
                }
            });
            resolve( cleanHousingResults );
        }).catch( err => {
            reject( err );
        });
    });
};

// Get house details by address
exports.getHouseDetails = ( rangeKey ) => {
    return new Promise( ( resolve, reject ) => {
        let house = {};
        DB.getHouse( rangeKey ).then( houseResult => {

            // Filter out anything not in the DB_KEYS list
            for( let dbKey in consts.HOUSING.DB_KEYS ){
                if( consts.HOUSING.DB_KEYS.hasOwnProperty( dbKey ) ){
                    let key = consts.HOUSING.DB_KEYS[dbKey];
                    if( houseResult.hasOwnProperty( key ) ){
                        house[key] = houseResult[key];
                    }
                }
            }

            let street = house[consts.HOUSING.DB_KEYS.STREET];
            let city = house[consts.HOUSING.DB_KEYS.CITY];
            let state = house[consts.HOUSING.DB_KEYS.STATE];

            if( street && city && state ) {
                // Combine zillow details with the original house details from DB
                getZillowDetails(
                    house[ consts.HOUSING.DB_KEYS.STREET ],
                    house[ consts.HOUSING.DB_KEYS.CITY ],
                    house[ consts.HOUSING.DB_KEYS.STATE ]
                ).then( zillowDetails => {
                    house = Object.assign( {}, house, zillowDetails );

                    house[consts.HOUSING.DB_KEYS.ZILLOW_LOT_SIZE] = house[consts.HOUSING.DB_KEYS.ZILLOW_LOT_SIZE] ?
                        parseInt( house[consts.HOUSING.DB_KEYS.ZILLOW_LOT_SIZE] ) :
                        house[consts.HOUSING.DB_KEYS.ZILLOW_LOT_SIZE];

                    house[consts.HOUSING.DB_KEYS.ZILLOW_HOUSE_SIZE] = house[consts.HOUSING.DB_KEYS.ZILLOW_HOUSE_SIZE] ?
                        parseInt( house[consts.HOUSING.DB_KEYS.ZILLOW_HOUSE_SIZE] ) :
                        house[consts.HOUSING.DB_KEYS.ZILLOW_HOUSE_SIZE];

                    house[consts.HOUSING.DB_KEYS.ZILLOW_VAL_LOW] = house[consts.HOUSING.DB_KEYS.ZILLOW_VAL_LOW] ?
                        parseInt( house[consts.HOUSING.DB_KEYS.ZILLOW_VAL_LOW] ) :
                        house[consts.HOUSING.DB_KEYS.ZILLOW_VAL_LOW];

                    house[consts.HOUSING.DB_KEYS.ZILLOW_VAL_HIGH] = house[consts.HOUSING.DB_KEYS.ZILLOW_VAL_HIGH] ?
                        parseInt( house[consts.HOUSING.DB_KEYS.ZILLOW_VAL_HIGH] ) :
                        house[consts.HOUSING.DB_KEYS.ZILLOW_VAL_HIGH];

                    resolve( house );
                } ).catch( err => {
                    // Intentional resolve
                    // We want data even if zillow craps out
                    console.log( "Zillow API Error: " + err );
                    resolve( house );
                });
            } else {
                reject( "InvalidHouse" );
            }
        }).catch( err => reject( err ) );
    });
};


let getZillowDetails = ( address, city, state ) => {
    return new Promise( ( resolve, reject ) => {

        let zillowApi = new zillow( process.env.KEY_ZILLOW, {} );

        let params = {
            address: address.split( " " ).join( "+" ),
            citystatezip: city + "+" + state
        };

        zillowApi.get( "GetDeepSearchResults", params ).then( searchResults => {

            if( !searchResults ){
                reject( "NoHouseFound" );
            } else {
                let finalObj = {};
                let zillowConsts = consts.HOUSING.ZILLOW_OBJ;
                // Go down to the house data
                let houseResult = searchResults
                    [ zillowConsts.RESPONSE ]
                    [ zillowConsts.RESULTS ]
                    [ zillowConsts.RESULT_ARRAY ]
                    [ zillowConsts.BEST_RESULT_INDEX ];

                finalObj.zillowID = houseResult[zillowConsts.PROPERTY_ID][zillowConsts.BEST_RESULT_INDEX];

                // Valuation
                let valuationObj = houseResult[ zillowConsts.ZEST ];
                valuationObj = valuationObj[zillowConsts.BEST_RESULT_INDEX];
                valuationObj = valuationObj ? valuationObj[zillowConsts.VALUATION_RANGE] : false;
                if( valuationObj ){
                    valuationObj = valuationObj[zillowConsts.BEST_RESULT_INDEX];
                    finalObj.valLow = valuationObj
                        [zillowConsts.VAL_LOW]
                        [zillowConsts.BEST_RESULT_INDEX]
                        [zillowConsts.VALUATION_AMT];
                    finalObj.valHigh = valuationObj
                        [zillowConsts.VAL_HIGH]
                        [zillowConsts.BEST_RESULT_INDEX]
                        [zillowConsts.VALUATION_AMT];
                }

                finalObj.yearBuilt = houseResult[zillowConsts.YEAR_BUILT] ?
                    houseResult[zillowConsts.YEAR_BUILT][zillowConsts.BEST_RESULT_INDEX] :
                    null;
                finalObj.houseSize = houseResult[zillowConsts.HOUSE_SIZE] ?
                    houseResult[zillowConsts.HOUSE_SIZE][zillowConsts.BEST_RESULT_INDEX] :
                    null;
                finalObj.lotSize = houseResult[zillowConsts.LOT_SIZE] ?
                    houseResult[zillowConsts.LOT_SIZE][zillowConsts.BEST_RESULT_INDEX] :
                    null;

                resolve( finalObj );

            }
        }).catch( err => {
            reject( err );
        })
    });
};