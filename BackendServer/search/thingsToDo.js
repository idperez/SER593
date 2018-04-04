const consts = require( "../constants" );
const utils = require('../util');
const request = require( 'request' );
const qs = require( 'querystring' );
const YELP_ENDPOINT = "https://api.yelp.com/v3/businesses/search";
const DEFAULT_RADIUS = 25; // In miles
const SEARCH_BY_COORD = "coordinates";
const SEARCH_BY_LOC = "location";

exports.getThingsToDoByCoordinates = ( userObj, lat, long, radius ) => {
    return getThingsToDo( userObj, SEARCH_BY_COORD, { lat: lat, long: long }, radius );
};

exports.getThingsToDoByLocation = ( userObj, city, state, radius ) => {
    return getThingsToDo( userObj, SEARCH_BY_LOC, { city: city, state: state }, radius );
};

// searchType is either coordinates or location
// searchItem {lat, long} for coordinates and {city, state} for location
let getThingsToDo = ( userObj, searchType, searchItems, radiusMiles ) => {
    return new Promise( ( resolve, reject ) => {

        let promises = [];
        let terms = userObj[consts.PROF_KEYS.PREFS_LIFE_TITLES];
        let radius = utils.milesToKm( radiusMiles ? radiusMiles : DEFAULT_RADIUS ) * 1000;

        terms.forEach( term => {
            promises.push( new Promise( ( qResolve, qReject ) => {
                let query = {
                    term: term,
                    radius: radius

                };

                switch( searchType ){
                    case SEARCH_BY_COORD:
                        query.latitude = searchItems.lat ? searchItems.lat : null;
                        query.longitude = searchItems.long ? searchItems.long : null;
                        break;
                    case SEARCH_BY_LOC:
                        searchItems.city = searchItems.city ? searchItems.city : null;
                        searchItems.state = searchItems.state ? searchItems.state : null;
                        query.location = searchItems.city + ", " + searchItems.state;
                        break;
                    default:
                        qReject( "InvalidSearchType" );
                }

                query = qs.stringify( query );
                request({
                    uri: YELP_ENDPOINT + '?' + query,
                    headers:{
                        Authorization: "Bearer " + process.env.KEY_YELP
                    }
                }, function( err, response, body ) {
                    if( err ){
                        qReject( err );
                    } else {
                        body = JSON.parse( body );
                        body["terms"] = userObj[consts.PROF_KEYS.PREFS_LIFE_TITLES];
                        qResolve( body );
                    }
                });
            }));
        });

        Promise.all( promises ).then( queryResults => {
            let resultObj = {
                businesses: [],
                total: 0,
                terms: terms
            };
            queryResults.forEach( qRes => {
                resultObj["businesses"] = resultObj["businesses"].concat( qRes["businesses"]);
                resultObj["total"] += qRes["total"];
            });
            resolve( resultObj );
        }).catch( err => reject(err) );
    });
};