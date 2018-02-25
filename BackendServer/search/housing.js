const AWS = require( 'aws-sdk' );
AWS.config.update( { region:'us-west-2' } );
const ddb = new AWS.DynamoDB( { apiVersion: '2012-08-10' } );
const ddbGeo = require('dynamodb-geo');
const config = new ddbGeo.GeoDataManagerConfiguration(ddb, 'GeoHousing');
const geoTableManager = new ddbGeo.GeoDataManager(config);
const utils = require('../util');
const consts = require( "../constants" );
let sleep = require('sleep');

exports.getHousingByCoordinates = ( userObj, lat, long ) => {
    return new Promise( ( resolve, reject ) => {
        moveTable();
        resolve("check console");
    });
};

let moveTable = () => {
    let params = {
        TableName: "HousingTestData"
    };

    let timeout = 0;
    ddb.scan( params, ( err, data ) => {
        let allHousing = data.Items;
        for( let i = 0; i < allHousing.length; i++ ){

            let lat = allHousing[i].lat.N;
            let long = allHousing[i].long.N;

            let address = { "S" : allHousing[i].Address.S };
            let street = { "S" : allHousing[i].street.S };
            let city = { "S" : allHousing[i].city.S };
            let state = { "S" : allHousing[i].state.S };
            let zip = { "S" : allHousing[i].zip.S };
            let beds = { "N" : allHousing[i].beds.N };
            let details = { "S" : allHousing[i].details.S };
            let fullBaths = { "N" : allHousing[i].fullBaths.N };
            let halfBaths = { "N" : allHousing[i].halfBaths.N };
            let photoLink = { "S" : allHousing[i].photoLink.S };
            let price = { "S" : allHousing[i].price.S };
            let purchaseType = { "S" : allHousing[i].purchaseType.S };
            let type = { "S" : allHousing[i].type.S };

            setTimeout(function() {
            addGeoData({
                    RangeKeyValue: { S: address.S },
                    GeoPoint: {
                        latitude: lat,
                        longitude: long
                    },
                    PutItemInput: {
                        Item: {
                                [consts.HOUSING.DB_KEYS.ADDRESS]: typeof address.S === "string" ? address : {"NULL":true},
                                [consts.HOUSING.DB_KEYS.STREET]: typeof street.S  === "string" ? street : {"NULL":true},
                                [consts.HOUSING.DB_KEYS.CITY]: typeof city.S  === "string"  ? city : {"NULL":true},
                                [consts.HOUSING.DB_KEYS.STATE]: typeof state.S  === "string"  ? state : {"NULL":true},
                                [consts.HOUSING.DB_KEYS.ZIP]: typeof zip.S  === "string"  ? zip : {"NULL":true},
                                [consts.HOUSING.DB_KEYS.TYPE]: typeof type.S  === "string" ? type : {"NULL":true},
                                [consts.HOUSING.DB_KEYS.PRICE]: typeof price.S  === "string"  ? price : {"NULL":true},
                                [consts.HOUSING.DB_KEYS.PHOTO_LINK]: typeof photoLink.S  === "string"  ? photoLink : {"NULL":true},
                                [consts.HOUSING.DB_KEYS.DETAILS_LINK]: typeof details.S  === "string" ? details : {"NULL":true},
                                [consts.HOUSING.DB_KEYS.BEDS]: typeof beds.N   === "string"  ? beds : {"NULL":true},
                                [consts.HOUSING.DB_KEYS.HALF_BATHS]: typeof halfBaths.N  === "string"  ? halfBaths : {"NULL":true},
                                [consts.HOUSING.DB_KEYS.FULL_BATHS]: typeof fullBaths.N   === "string"  ? fullBaths : {"NULL":true},
                                [consts.HOUSING.DB_KEYS.LAT]:{
                                    "N": lat
                                },
                                [consts.HOUSING.DB_KEYS.LONG]:{
                                    "N": long
                                },
                                [consts.HOUSING.DB_KEYS.PURCHASE_TYPE]: typeof purchaseType.S  === "string"  ? purchaseType : {"NULL":true}
                        }
                    }
                }
            );
            }, timeout );
            timeout += 100;
        }
    });
};

let addGeoData = ( geoData ) => {
    geoTableManager.putPoint( geoData ).promise()
        .then(function() {
            console.log("Added house: " + geoData.PutItemInput.Item[consts.HOUSING.DB_KEYS.ADDRESS].S)
        }).catch( err => {
            console.log(err);
    } );
};