let jobSearch = require( './jobs.js' );
const keys = require( '../keys/apiKeys' );
const POPULATION_ENDPOINT = "https://api.census.gov/data/2016/pep/population";
const request = require( 'request' );
const DB_USERS = require( '../db/users' );
const consts = require( "../constants" );
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

exports.updateCityRatings = ( username ) => {
    return new Promise( ( resolve, reject ) => {
        exports.getCityStats( username ).then( ( cityRatiosObj ) => {

            let ratings = {};

            // Parse out param
            let cities = cityRatiosObj.cities;
            let minRatio = cityRatiosObj.min;
            let maxRatio = cityRatiosObj.max;

            if( !cities ){
                reject( "NoCitiesInObject" );
            }

            let gapSize = maxRatio - minRatio;

            // Algorithm step #2: Since all the ratios have been applied
            // Lets go through and compare against the min and the max
            for( let key in cities ){
                if( cities.hasOwnProperty( key ) ) {
                    let rating = 0; // rating from 1 to 100
                    ratings[key] = { city: cities[key].city, state: cities[key].state };

                    if( cities[key].ratio > maxRatio || cities[key].ratio < minRatio ) {
                        reject( "RatioError" );
                    }

                    // Calculate rating
                    let increase = gapSize + ( cities[key].ratio - minRatio );
                    rating = ( ( increase / gapSize ) * 100 ) - 100;
                    ratings[key].rating = rating.toFixed(1);
                }
            }

            let ratingsStr = "";

            try {
                ratingsStr = JSON.stringify( ratings );

                // Update users profile with the new ratings
                DB_USERS.modifyUserItem(
                    username,
                    consts.PROF_KEYS.CITY_MATCH,
                    ratingsStr,
                    consts.MODIFIY_PREFS_MODES.MODIFY
                ).then( data => {
                    resolve( data );
                }).catch( err => {
                    reject( err );
                });

            } catch (e) {
                reject(e);
            }

        }).catch( err => {
            reject( err );
        });
    });
};

exports.getCityStats = ( username ) => {
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
                            1,       // Just 1 job is needed since we only need job count
                            RADIUS,  // radius
                            true     // Job number
                        )

                    );
                }
            }

            Promise.all( promises ).then( jobs => {

                // This part of the algorithm gives us an upper bound
                // for the ratios, this max will essentially be a 100% city match
                // in terms of jobs. Reverse applies to minRatio.
                let maxRatio = 0;
                let minRatio = 1;

                // Merge population and job count
                for( let i = 0; i < jobs.length; i++ ){
                    let city = jobs[i].city;
                    if( !cities[city] ){
                        reject( "MissingCityData" );
                    } else {
                        cities[city].jobNum = jobs[i].jobNum;

                        // Since we are already looping here,
                        // lets add the ratio part of the algorithm to each city.
                        let ratio = getCityRatio( cities[city] );

                        // Handle the extremely rare case of more jobs than population
                        ratio = ratio > 1 ? 1 : ratio;

                        cities[city].ratio = ratio;

                        // Set a new min/max
                        minRatio = minRatio > ratio ? ratio : minRatio;
                        maxRatio = maxRatio < ratio ? ratio : maxRatio;
                    }
                }

                if( minRatio > maxRatio ){
                    reject( "ErrorSettingRatio" );
                }

                resolve( { cities: cities, min: minRatio, max: maxRatio } );

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

// Algorithm step #1: Get the ratio between jon count and population.
// param cityObj - the city object with jobNum and population.
let getCityRatio = ( cityObj ) => {
    return cityObj.jobNum / cityObj.population;
};