const jobSearch = require( './jobs.js' );
const housing = require( "../search/housing" );
const POPULATION_ENDPOINT = "https://api.census.gov/data/2016/pep/population";
const request = require( 'request' );
const DB = require( "../db/databaseAccess" );
const consts = require( "../constants" );
const util = require( "../util.js" );
const qs = require( 'querystring' );
const CITY_NAME_POS = 1;     // Position of city name string in the population array
const CITY_POP_POS = 0;      // Position of the city population in the population array
const MAX_POP = "999999999"; // Maximum population city to get city percentage match for.
const MIN_POP = "500000";    // Minimum population city to get city percentage match for.
const LOCATION_NAME_DELIMITERS = [
    " city",        // An extra "city" word is added to all the city names.
    " (balance)",   // Some locations have a balance here instead of city
    "-",            // Remove shared name with nearby smaller towns
    "/"             // Remove shared name with nearby smaller towns
] ;
const CITY_STATE_SEPARATOR = ", ";
const JOB_RADIUS = 0;       // Radius for the city job search in miles.
const HOUSING_RADIUS = 30;  // Radius for the housing search in miles.

exports.updateCityRatings = ( userObj ) => {
    return new Promise( ( resolve, reject ) => {
        exports.getCityStats( userObj ).then( ( cityRatiosObj ) => {

            let ratings = {};

            console.log(cityRatiosObj);

            // Parse out param
            let cities = cityRatiosObj.cities;
            let minRatio = cityRatiosObj.min;
            let maxRatio = cityRatiosObj.max;

            if( !cities ){
                reject( "NoCitiesInObject" );
            }

            let gapSize = maxRatio - minRatio;

            let orderedRatings = [];
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
                    ratings[key].rating = parseFloat( rating.toFixed(1) );

                    orderedRatings.push( ratings[key] );
                }

            }

            // Sort ratings highest to lowest
            orderedRatings.sort( ( city1, city2 ) => {
                return city2.rating - city1.rating;
            });

            // Set the ratings in the objects
            for( let i = 0; i < orderedRatings.length; i++ ){
                ratings[orderedRatings[i].city].ranking = i + 1;
            }

            let ratingsStr = "";

            try {
                ratingsStr = JSON.stringify( ratings );

                // Update users profile with the new ratings
                DB.modifyUserItem(
                    consts.USER_TABLE_NAME,
                    consts.USER_PRIMARY_KEY,
                    userObj[consts.PROF_KEYS.USERNAME],
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

exports.getCityStats = ( userObj ) => {
    return new Promise( ( resolve, reject ) => {

        exports.grabCityPopulations().then( cities => {
            let jobPromises = [];
            let housePromises = [];
            for( let key in cities ){
                if( cities.hasOwnProperty( key ) ){
                    jobPromises.push(
                        jobSearch.getJobsByCityState(
                            userObj,
                            cities[key]["city"],
                            cities[key]["state"],
                            1,       // Just 1 job is needed since we only need job count
                            JOB_RADIUS,  // radius
                            true     // Job number
                        )

                    );
                    housePromises.push(
                        housing.getHousingByCoordinates(
                            userObj,
                            cities[key]["lat"],
                            cities[key]["long"],
                            HOUSING_RADIUS
                        )
                    )
                }
            }

            util.allPromisesSkipErrors( housePromises ).then( houses => {
                Promise.all( jobPromises ).then( jobs => {
                    // This part of the algorithm gives us an upper bound
                    // for the ratios, this max will essentially be a 100% city match
                    // in terms of jobs. Reverse applies to minRatio.
                    let maxRatio = 0;
                    let minRatio = 1;

                    // Merge population and job count
                    for( let i = 0; i < jobs.length; i++ ) {
                        let city = jobs[ i ].city;
                        if( !cities[ city ] ) {
                            reject( "MissingCityData" );
                        } else {
                            cities[city].jobNum = jobs[i].jobNum;
                            cities[city].houseNum = houses.length;

                            // Since we are already looping here,
                            // lets add the ratio part of the algorithm to each city.
                            let ratio = getCityRatio( cities[ city ] );

                            // Handle the extremely rare case of more jobs than population
                            ratio = ratio > 1 ? 1 : ratio;

                            cities[ city ].ratio = ratio;

                            // Set a new min/max
                            minRatio = minRatio > ratio ? ratio : minRatio;
                            maxRatio = maxRatio < ratio ? ratio : maxRatio;
                        }
                    }

                    if( minRatio > maxRatio ) {
                        reject( "ErrorSettingRatio" );
                    }

                    resolve( { cities: cities, min: minRatio, max: maxRatio } );

                } ).catch( err => {
                    reject( err );
                } );
            }).catch( err => {
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
            key: process.env.KEY_CENSUS
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
                let coordPromises = [];
                for( let i = 1; i < body.length; i++ ){
                    let location = body[i][CITY_NAME_POS];
                    let splitLoc = location.split( CITY_STATE_SEPARATOR );
                    let pop = parseInt( body[i][CITY_POP_POS] );
                    let city = splitLoc[0];
                    let state = splitLoc[1];

                    // Clean city name
                    let splitCity = [];
                    for( let j = 0; j < LOCATION_NAME_DELIMITERS.length; j++ ){
                        splitCity = city.split( LOCATION_NAME_DELIMITERS[j] );
                        // Only update if a split occurred.
                        if( util.isArray( splitCity ) ) {
                            city = splitCity[ 0 ]; // Always take far left of city string when a split occurs
                        }
                    }

                    if( city && state ) {
                        coordPromises.push(
                            util.getCoordinates(
                                "",     // Empty to get city center
                                city,
                                state
                            )
                        );
                        cityMatchJSON[ city ] = { // Use city name as the key
                            city: city,
                            state: state,
                            population: pop
                        };
                    }

                }

                Promise.all( coordPromises ).then( cities => {
                    for( let i = 0; i < cities.length; i++ ){
                        let currentCity = cities[i].city;
                        if( currentCity && cityMatchJSON.hasOwnProperty( currentCity ) ) {
                            cityMatchJSON[currentCity].lat = cities[i].lat;
                            cityMatchJSON[currentCity].long = cities[i].long;
                        } else {
                            reject( "InvalidCity" + currentCity );
                        }
                    }
                    resolve(cityMatchJSON);
                }).catch( err => reject( err ) );

            }
        });
    });
};

// Algorithm step #1: Get the ratio between job/house count and population.
// param cityObj - the city object with jobNum, houseNum and population.
let getCityRatio = ( cityObj ) => {
    return util.average( [cityObj.jobNum, cityObj.houseNum]) / cityObj.population;
};