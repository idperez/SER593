const request = require( 'request' );
const qs = require( 'querystring' );
const utils = require('../util');
const consts = require( "../constants" );
const sanitizeHTML = require( "sanitize-html" );

const INDEED_ENDPOINT = 'http://api.indeed.com/ads/apisearch';
const INDEED_JOB_KEY_API = 'http://api.indeed.com/ads/apigetjobs';
const INDEED_VERSION = 2;
const ZIP_ENDPOINT = 'http://api.geonames.org/findNearbyPostalCodesJSON';
const DEFAULT_RADIUS = 25;     // In miles
const MILE_TO_KM = 1.60934;
const MAX_ZIP_RADIUS_KM = 1;   // Max radius for the zipcode api

// 1 zip code works well with Indeeds search because indeed will also return
// jobs in nearby zipcodes in the results.
const MAX_ZIPS = 1;
const RESULTS_PER_PAGE = 25;  // 25 is the max per page.
const DEFAULT_JOB_AGE = 60;   // In days

exports.getJobByKey = ( jobKey ) => {
    return new Promise( ( resolve, reject ) => {
        if( !jobKey ){
            reject( 'NoJobKeyFound' );
        }
        let jobQuery = {
            publisher: process.env.KEY_INDEED, // API Key
            v: INDEED_VERSION,          // API version
            format: 'json',
            jobkeys: jobKey
        };

        let query = qs.stringify( jobQuery );

        request( INDEED_JOB_KEY_API + '?' + query, ( err, innerResponse, innerBody ) => {
            if( err ) {
                reject( err );
            } else {
                let jobs = JSON.parse( innerBody ).results;
                if( !utils.isArray( jobs ) || utils.emptyArray( jobs ) ){
                    reject( 'JobNotFound' );
                } else {
                    let job = jobs[0];
                    sanitizeSnippet( job );
                    resolve( job );
                }
            }
        } );

    });
};

exports.getJobsByCityState = ( userObj, city, state, maxResults, radius, numJobs = false ) => {
    return new Promise( ( resolve, reject ) => {
        if( !city || !state ){
            reject( 'MissingLocation' );
        } else {
            getJobsList( userObj, city, state, null, maxResults, radius, numJobs ).then( jobList => {
                resolve( jobList );
            }).catch( err => {
                reject( err );
            });
        }
    });
};

exports.getJobsByZip = ( userObj, zip, maxResults, radius ) => {
    return new Promise( ( resolve, reject ) => {
        if( !zip ){
            reject( 'MissingLocation' )
        } else {
            getJobsList( userObj, null, null, zip, maxResults, radius ).then( jobList => {
                resolve( jobList );
            }).catch( err => {
                reject( err );
            });
        }
    });
};

exports.getJobsByCoord = ( userObj, lat, long, maxResults, radius ) => {
    return new Promise( ( resolve, reject ) => {

        radius = radius * MILE_TO_KM;

        if( !lat || !long ){
            reject( 'MissingLocation' );
        }

        let baseQuery = {
            username: process.env.KEY_ZIP,
            lat: lat,
            lng: long,
            radius: radius > MAX_ZIP_RADIUS_KM ? MAX_ZIP_RADIUS_KM : radius,
            maxRows: MAX_ZIPS
        };

        let query = qs.stringify( baseQuery );

        request( ZIP_ENDPOINT + '?' + query, function( err, response, body ) {
            if( err ){
                reject( err.toString() );
            } else {
                let postalResults = JSON.parse( body ).postalCodes;

                if( !postalResults ){
                    reject( { code: "NoResultsFound", message: "Check your params." } );
                } else {

                    let jobProms = [];
                    maxResults = Math.floor( maxResults / postalResults.length ); // Spread max results out by zip code
                    postalResults.forEach( ( zipResult ) => {
                        jobProms.push( exports.getJobsByZip( userObj, zipResult.postalCode, maxResults, radius ) );
                    } );
                    Promise.all( jobProms ).then( totalResults => {
                        // Flatten results before sending
                        resolve( [].concat.apply( [], totalResults ) );
                    } ).catch( err => {
                        reject( err );
                    } );
                }
            }
        });
    });
};

// Helper to get jobs by city/state or zip, which is required by indeed.
function getJobsList( profile, city, state, zip, maxResults, radius = DEFAULT_RADIUS, numJobs = false ){
    return new Promise( ( resolve, reject ) => {
        let jobAge = profile[ consts.PROF_KEYS.PREFS_JOBS_DATE ] ?
            profile[ consts.PROF_KEYS.PREFS_JOBS_DATE ] : DEFAULT_JOB_AGE;
        let jobTypes = profile[ consts.PROF_KEYS.PREFS_JOBS_TYPES ] ?
            profile[ consts.PROF_KEYS.PREFS_JOBS_TYPES ] : reject( "NoJobTypes" );
        let jobTitles = profile[ consts.PROF_KEYS.PREFS_JOBS_TITLES ] ?
            profile[ consts.PROF_KEYS.PREFS_JOBS_TITLES ] : [""]; // Empty string to get all results
        let typePromises = [];

        maxResults /= jobTypes.length;

        jobTitles = utils.isArray( jobTitles ) ? jobTitles : [jobTitles];
        jobTypes = utils.isArray( jobTypes ) ? jobTypes : [jobTypes];
        jobTypes.forEach( jobType => {

            typePromises.push( new Promise( ( typeResolve, typeReject ) => {

                let baseQuery = {
                    publisher: process.env.KEY_INDEED,
                    format: 'json',
                    v: INDEED_VERSION,  // API version
                    limit: RESULTS_PER_PAGE, // Number of results per call, max is 25
                    filter: 1,          // Filter duplicate results
                    latlong: 1,         // Returns the lat/log of each job
                    co: "us",           // Country
                    userip: "localhost",
                    useragent: 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 ' +
                    '(KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36',
                    radius: radius,
                    // Database values
                    jt: jobType,                                // Job type
                    fromage: jobAge, // Max number of days back job was posted
                    q: jobTitles.join( "," )                    // Keywords

                };

                // Set location
                if( city && state ) {
                    baseQuery[ "l" ] = city + ", " + state;
                } else {
                    baseQuery[ "l" ] = zip.toString();
                }

                let query = qs.stringify( baseQuery );

                // Get total results from API first
                request( INDEED_ENDPOINT + '?start=0&' + query, function( err, response, body ) {
                    if( err ) {
                        reject( err );
                    } else {
                        let numOfResults = JSON.parse( body ).totalResults;

                        // If number of jobs is requested, end here.
                        if( numJobs ){
                            typeResolve( numOfResults );
                        } else {
                            let promises = [];
                            for( let i = 0; i < numOfResults && i < maxResults; i += RESULTS_PER_PAGE ) {
                                promises.push( new Promise( ( jobResolve, jobReject ) => {
                                        request( INDEED_ENDPOINT + '?start=' + i + '&' + query, function( err, innerResponse, innerBody ) {
                                            if( err ) {
                                                jobReject( err );
                                            } else {
                                                jobResolve( JSON.parse( innerBody ).results );
                                            }
                                        } );
                                    } )
                                );
                            }
                            // Pages
                            Promise.all( promises ).then( totalResults => {
                                // Flatten results before sending
                                typeResolve( [].concat.apply( [], totalResults ) );
                            } ).catch( err => {
                                typeReject( err );
                            } );
                        }
                    }
                } );
            } ) );
        } );
        // Job types
        Promise.all( typePromises ).then( totalResults => {
            if( numJobs ) {
                let sumOfResults = 0;
                for( let i = 0; i < totalResults.length; i++ ){
                    sumOfResults += totalResults[i];
                }
                resolve( { city: city, state: state, jobNum:sumOfResults } );
            } else {
                // Flatten results before sending
                let jobsArr = [].concat.apply( [], totalResults );
                jobsArr = organizeResults( jobsArr );

                resolve( jobsArr );
            }
        }).catch( err => {
            reject( err );
        });
    });
}

// Helper to sanitize all job snippets and organize jobs by location
let organizeResults = ( jobsArr ) => {
    let emptyLocStr = "nolocation";
    // Initial jobs object, will be converted to an array before sending
    let locationsObj = {};

    for( let i = 0; i < jobsArr.length; i++ ){
        // Sanitize the html
        sanitizeSnippet( jobsArr[i] );

        // Group by location
        let lat = jobsArr[i].latitude;
        let long = jobsArr[i].longitude;
        let key = lat.toString() + long.toString();

        if( lat && long ) {
            // If the location object already exists just append the job, else make a new object
            if( locationsObj[key] ) {
                locationsObj[key].jobs.push( jobsArr[i] );
            } else {
                locationsObj[key] =
                    {
                        latitude: lat,
                        longitude: long,
                        jobs: [
                            jobsArr[i]
                        ]
                    };
            }
        // No lat long available, add to the empty object.
        } else {
            if( locationsObj[emptyLocStr] ){
                locationsObj[emptyLocStr].jobs.push( jobsArr[i] );
            // Create new empty location object if one does not already exist
            } else {
                locationsObj[emptyLocStr] = {
                    latitude: null,
                    longitude: null,
                    jobs:[
                        jobsArr[i]
                    ]
                }
            }
        }
    }

    // Now convert object to array for sending
    return Object.keys( locationsObj ).map( ( key ) => {
                return locationsObj[key];
           });

};

let sanitizeSnippet = ( job ) => {
    job.snippet = sanitizeHTML( job.snippet, {
        allowedTags: [],
        allowedAttributes: []
    });
};