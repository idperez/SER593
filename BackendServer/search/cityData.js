let jobSearch = require( './jobs.js' );
const keys = require( '../keys/apiKeys' );
const POPULATION_ENDPOINT = "https://api.census.gov/data/2016/pep/population";
const request = require( 'request' );
const util = require( '../util' );
const qs = require( 'querystring' );
const CITY_NAME_POS = 1;     // Position of city name string in the population array
const CITY_POP_POS = 0;      // Position of the city population in the population array
const MAX_POP = "999999999"; // Maximum population city to get city percentage match for.
const MIN_POP = "500000";    // Minimum population city to get city percentage match for.
let LOCATION_NAME_DELIMITERS = [
    " city, ", // An extra "city" word is added to all the city names.
    " (balance), " // Some locations have a balance here instead of city
] ;
const RADIUS = 20;  // Radius for the city job search in miles.


exports.grabJobCountForCities = ( username ) => {
    return new Promise( ( resolve, reject ) => {

        exports.grabCityPopulations().then( cities => {

            let promises = [];

            for( let key in cities ){
                if( cities.hasOwnProperty( key ) ){
                    promises.push(
                        jobSearch.getJobsByCityState(
                            username,
                            cities[key]["city"],
                            cities[key]["state"],
                            1,  // Just 1 job is needed since we only need job count
                            RADIUS,  // radius
                            true
                        )

                    );
                }
            }

            Promise.all( promises ).then( jobs => {
                resolve( jobs );
            }).catch(err => {
                reject( err );
            });
        });
    });
};

// Get populations for all major cities in the USA
exports.grabCityPopulations = () => {
    return new Promise(( resolve, reject ) => {
        let params = {
            get: "POP,GEONAME",
            for: "place:*",
            in: "state:*",
            POP: MIN_POP + ":" + MAX_POP,
            key: keys.CENSUS_KEY
        };

        request( POPULATION_ENDPOINT + '?' + qs.stringify( params ), function( err, response, body ) {
            if( err ){
                reject( err );
            } else {
                // Parse to get population
                // The array from the API is a double array. The first element
                // contains titles to values and should be discarded.
                let cityMatchJSON = {};

                body = JSON.parse( body );
                for( let i = 1; i < body.length; i++ ){
                    let location = body[i][CITY_NAME_POS];
                    let splitLoc = [];
                    let pop = parseInt( body[i][CITY_POP_POS] );

                    // Parse the city/state location string
                    for( let j = 0; j < LOCATION_NAME_DELIMITERS.length && splitLoc.length < 2; j++ ){
                        splitLoc = location.split( LOCATION_NAME_DELIMITERS[j] );
                    }

                    if( splitLoc[0] && splitLoc[1] ) {
                        cityMatchJSON[ splitLoc[0] ] = { // Use city name as the key
                            city: splitLoc[0],
                            state: splitLoc[1],
                            population: pop
                        };
                    }

                }

                resolve(cityMatchJSON);
            }
        });
    });
};