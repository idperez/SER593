const AWS = require( 'aws-sdk' );
AWS.config.update( { region:'us-west-2' } );
const ddb = new AWS.DynamoDB( { apiVersion: '2012-08-10' } );
const ddbGeo = require('dynamodb-geo');
const config = new ddbGeo.GeoDataManagerConfiguration(ddb, 'GeoHousing');
const geoTableManager = new ddbGeo.GeoDataManager(config);
const utils = require('../util');
const consts = require( "../constants" );

exports.getHousingByCoordinates = ( userObj, lat, long, radius ) => {
    return new Promise( ( resolve, reject ) => {
        geoTableManager.queryRadius({
            RadiusInMeter: utils.milesToKm( parseInt( radius ) ) * 1000,
            CenterPoint:{
                latitude: parseFloat( lat ),
                longitude: parseFloat( long )
            }
        }).then( housingResults => {
            let cleanHousingResults = [];
            let keys = consts.HOUSING.DB_KEYS;
            housingResults.forEach( result => {

                // Types are allowed to be null
                let type = result[keys.TYPE].S ? result[keys.TYPE].S : null;

                cleanHousingResults.push({
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
                    [keys.LONG]:parseFloat( result[keys.LONG].N )
                })
            });

            resolve( cleanHousingResults );
        }).catch( err => {
            reject( err );
        });
    });
};