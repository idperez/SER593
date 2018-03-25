const consts = require( "../constants" );
const utils = require('../util');
const request = require( 'request' );
const qs = require( 'querystring' );
const YELP_ENDPOINT = "https://api.yelp.com/v3/businesses/search";
const DEFAULT_RADIUS = 25; // In miles
const SEARCH_BY_COORD = "coordinates";
const SEARCH_BY_LOC = "location";

exports.getThingsToDoByCoordinates = ( userObj, term, lat, long, radius ) => {
    return getThingsToDo( userObj, term, SEARCH_BY_COORD, { lat: lat, long: long }, radius );
};

exports.getThingsToDoByLocation = ( userObj, term, city, state, radius ) => {
    return getThingsToDo( userObj, term, SEARCH_BY_LOC, { city: city, state: state }, radius );
};

// searchType is either coordinates or location
// searchItem {lat, long} for coordinates and {city, state} for location
let getThingsToDo = ( userObj, term, searchType, searchItems, radius ) => {
    return new Promise( ( resolve, reject ) => {

        let query = {
            term: term,
            radius: utils.milesToKm( radius ? radius : DEFAULT_RADIUS ) * 1000

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
                reject( "InvalidSearchType" );
        }

        query = qs.stringify( query );
        request({
            uri: YELP_ENDPOINT + '?' + query,
            headers:{
                Authorization: "Bearer " + process.env.KEY_YELP
            }
        }, function( err, response, body ) {
            if( err ){
                reject( err );
            } else {
                resolve(body);
            }
        });
    });
};