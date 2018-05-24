const jobSearch = require("../search/jobs.js");
const utils = require('../util');
const consts = require( "../constants" );
const cacheUtils = require("./cachingUtil");
const DB = require( "../db/databaseAccess" );

const TABLE_NAME = "top_job_results";
const PRIM_KEY = "city";
const LAST_INDEX_PRIM_KEY = "lastJobIndexUsed";

// Update and store the next set of top job titles per city.
exports.storeNextJobSet = () => {
    return new Promise( ( resolve, reject ) => {
        // Get the last index of job titles that was updated.
        // Start from there with our daily subset
        cacheUtils.getLastUpdatedIndex( LAST_INDEX_PRIM_KEY ).then( lastUpdatedIndex => {
            let maxIndex = consts.JOB_TITLES.length - 1;
            let updateToIndex = maxIndex <= 0 ? 0 :
                ( Math.floor( consts.JOB_TITLES.length / consts.UPDATE_PERIOD ) + lastUpdatedIndex ) % maxIndex;
            let userObj = {
                [consts.PROF_KEYS.PREFS_JOBS_TYPES] : "fulltime",
                [consts.PROF_KEYS.PREFS_JOBS_DATE] : 30,
                [consts.PROF_KEYS.PREFS_JOBS_TITLES]: ""
            };

            let completedJobProms = [];
            // Each job title to be updated
            let i = lastUpdatedIndex;
            do{
                let title = consts.JOB_TITLES[ i ];
                // Each rated city
                for( let j = 0; j < consts.RATED_CITIES.length; ++j ) {
                    completedJobProms.push( new Promise( ( resolveJob, rejectJob ) => {
                        let city = consts.RATED_CITIES[ j ].city;
                        let state = consts.RATED_CITIES[ j ].state;
                        userObj[ consts.PROF_KEYS.PREFS_JOBS_TITLES ] = [ title ];
                        jobSearch.getJobsByCityState(
                            userObj, city,
                            state, consts.BEST_MATCH_RESULTS_MAX,
                            consts.DEFAULT_RADIUS
                        ).then( jobs => {
                            let jobSetPromises = [];
                            jobs.forEach( job => {
                                // Hit google API with job result
                                jobSetPromises.push( new Promise( ( resolveJobSet, rejectJobSet ) => {
                                    utils.getCoordinatesOfCompany( job["company"] ).then( coords => {
                                        let jobObj = {
                                            job: job,          // The job itself
                                            key: city + state, // Prim key to save on DB
                                            category: title    // Category the job belongs to
                                        };
                                        jobObj.job[ "coordinates" ] = coords;
                                        // If getting updated jobs for this job title and city are successful
                                        // then it is safe to remove the old list
                                        DB.modifyDBItem(
                                            TABLE_NAME, PRIM_KEY,
                                            city + state,
                                            title,
                                            null,
                                            consts.MODIFIY_PREFS_MODES.EMPTY_LIST
                                        ).catch( err => reject( err ) );
                                        resolveJobSet( jobObj );
                                    } ).catch( err => {
                                        console.log( "Failed to get coordinates for company: " + job[ "company" ] );
                                        rejectJobSet( err );
                                    } );
                                } ) );
                            } );
                            Promise.all( jobSetPromises ).then( jobSet => resolveJob( jobSet ) ).catch( err => rejectJob( err ) );
                        } ).catch( err => reject( err ) );
                    }));
                }
                i = (i + 1) % maxIndex;
            } while( maxIndex > 0 && i !== updateToIndex && i <= maxIndex );

            Promise.all( completedJobProms ).then( jobList => {
                let dbSavedProms = [];
                jobList = [].concat.apply( [], jobList );
                // Save updated values to DB
                if( utils.emptyArray( jobList ) ){
                    reject("NoJobsFound");
                }
                jobList.forEach( jobObj => {
                    if( jobObj && jobObj.key && jobObj.category && jobObj.job ) {
                        console.log( "Updating job: " + jobObj.category + " " + jobObj.key );
                        dbSavedProms.push( new Promise( ( resolveSave, rejectSave ) => {
                            DB.modifyDBItem(
                                TABLE_NAME,
                                PRIM_KEY,
                                jobObj.key,
                                jobObj.category,
                                JSON.stringify( jobObj ),
                                consts.MODIFIY_PREFS_MODES.LIST_APPEND
                            ).then( done => {
                                resolveSave( done );
                            } ).catch( err => {
                                console.log(
                                    "Error adding job to the DB: " +
                                    "\nDB Key: " + jobObj.key +
                                    "\nCategory: " + jobObj.category +
                                    "\nError: " + err );
                                rejectSave( err );
                            } );
                        } ) );
                    }
                });
                // If all saves were successful, we are done.
                Promise.all( dbSavedProms ).then( everythingSaved => {
                    cacheUtils.setLastUpdatedIndex( LAST_INDEX_PRIM_KEY, updateToIndex );
                    resolve();
                } ).catch( err => reject( err ) );
            }).catch( err => reject( err ) );
        }); // Get the last updated index of job titles
    });
};
