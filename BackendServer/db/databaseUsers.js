const AWS = require( 'aws-sdk' );
AWS.config.update( { region:'us-west-2' } );
const ddb = new AWS.DynamoDB( { apiVersion: '2012-08-10' } );
const consts = require( "../constants" );
const util = require( "../util" );
const jobSearch = require( "../search/jobs" );
const thingSearch = require( "../search/thingsToDo" );
const INDEX_SUFFIX = "-index";
const TABLE_NAME_JOBS = 'jobs';
const TABLE_NAME_THINGS = "things_to_do";
const PRIM_KEY_JOBS = "jobkey";
const JOB_ID_KEY = "jobkey";
const THING_ID_KEY = "id";
// The key for which a saved item is associated with on it's table
// For example, all job details are saved under a savedItem key.
const KEY_SAVED_ITEM = "savedItem";
const PRIM_KEY_THING = "id";
const DEFAULT_UPDATE_TIME = 86400000; // Time to recheck saved jobs - 24 hours in ms
const cityData = require( "../search/cityData" );
const DB = require( "./databaseAccess" );

// Get user profile from database
// Authorize should be the only caller
exports.getUserProfile = ( username ) => {
    return exports.getUserProfileByPrimaryKey( consts.USER_PRIMARY_KEY, username );
};

// Query table by a specific key
// primKey must at least be a tables secondary key.
exports.getUserProfileByPrimaryKey = ( primKey, value ) => {
    return new Promise( ( resolve, reject ) =>{
        if( primKey && value ) {
            let params = {
                TableName: consts.USER_TABLE_NAME,
                ExpressionAttributeValues: {
                    ":v1": {
                        S: value.toString()
                    }
                },
                KeyConditionExpression: primKey.toString() + " = :v1",
            };

            if( consts.USER_PRIMARY_KEY !== primKey.toString()){
                params.IndexName = primKey + INDEX_SUFFIX;
            }

            ddb.query( params, ( err, data ) => {
                if( err ) {
                    reject( err );
                } else if( data.Items[ 0 ] ) {
                    if( data.Items.length > 1 ){
                        reject( "MultipleProfilesFound" );
                    }
                    let profile = data.Items[ 0 ];
                    let resultProfile = DB.extractData( profile );

                    let jobProms = [];
                    let houseProms = [];
                    let thingProms = [];
                    if( resultProfile[consts.PROF_KEYS.PREFS_JOBS_SAVED] ) {
                        // Get saved jobs from the job table
                        let jobKeys = resultProfile[ consts.PROF_KEYS.PREFS_JOBS_SAVED ];
                        jobKeys.forEach( jobKey => {
                            jobProms.push( getSavedItem(
                                PRIM_KEY_JOBS,
                                jobKey,
                                TABLE_NAME_JOBS
                            ));
                        } );
                    }
                    if( resultProfile[consts.PROF_KEYS.PREFS_HOUSE_SAVED] ){
                        let rangeKeys = resultProfile[consts.PROF_KEYS.PREFS_HOUSE_SAVED];
                        rangeKeys.forEach( rangeKey => {
                            houseProms.push( DB.getHouse( rangeKey ) );
                        });
                    }

                    if( resultProfile[consts.PROF_KEYS.PREFS_THINGS_SAVED] ) {
                        // Get saved things from the things to do table
                        let thingsIds = resultProfile[ consts.PROF_KEYS.PREFS_THINGS_SAVED ];
                        thingsIds.forEach( thingId => {
                            thingProms.push( getSavedItem(
                                PRIM_KEY_THING,
                                thingId,
                                TABLE_NAME_THINGS
                            ));
                        } );
                    }

                    // Get all saved things from all tables
                    Promise.all( jobProms ).then( jobs => {
                        resultProfile[ consts.PROF_KEYS.PREFS_JOBS_SAVED ] = jobs;
                        Promise.all( houseProms ).then( houses => {
                            resultProfile[consts.PROF_KEYS.PREFS_HOUSE_SAVED] = houses;
                            Promise.all( thingProms ).then( things => {
                                resultProfile[consts.PROF_KEYS.PREFS_THINGS_SAVED] = things;
                                resolve( resultProfile );
                            });
                        });
                    } ).catch( err => reject( err ) );

                    /*
                       Check expiration time stamp for the users profile.
                       This runs after the response, so the current call for the user profile
                       will not have to wait for the updates.
                    */
                    timelyUpdates( resultProfile, DEFAULT_UPDATE_TIME );

                } else {
                    reject( 'NoResultsFound' );
                }
            });
        } else {
            reject( "MissingParams" )
        }
    });
};

exports.addNewUser = ( username, password, email ) => {
    return new Promise( (resolve, reject) => {

        let params = {
            TableName: consts.USER_TABLE_NAME,
            Item: {
                [consts.PROF_KEYS.USERNAME]:{
                    "S": username
                },
                [consts.PROF_KEYS.PASSWORD]:{
                    "S": password
                },
                [consts.PROF_KEYS.EMAIL]:{
                    "S": email
                },
                // Must be set to string for DB indexing
                [consts.PROF_KEYS.ACCESS_TOKEN]:{
                    "S": consts.TEMP_TOKEN
                }
            },
            ConditionExpression: "attribute_not_exists(" + consts.PROF_KEYS.USERNAME + ")"
        };

        // Set all user keys to null upon registration.
        for( let key in consts.PROF_KEYS ){
            if( consts.PROF_KEYS.hasOwnProperty( key ) ){
                // Only set to null if this item is not already defined.
                if( !params.Item.hasOwnProperty( consts.PROF_KEYS[key] ) )
                params.Item[consts.PROF_KEYS[key]] = {
                    "NULL": true
                }
            }
        }


        ddb.putItem( params, ( err, data ) => {
            if ( err ) {
                // This error means that the same username was found
                if( err.code === "ConditionalCheckFailedException" ){
                    reject( "UsernameTaken" );
                } else {
                    reject( err );
                }
            } else {
                resolve( data );
            }
        });
    });
};

// Endpoint entrance to modify an existing user profile key
// This is for routing use to prevent a loop on profile change updates
exports.modifyUserItemEndpoint = ( userObj, key, value, mode ) => {
    let promise = DB.modifyUserItem(
        consts.USER_TABLE_NAME,
        consts.USER_PRIMARY_KEY,
        userObj[consts.PROF_KEYS.USERNAME],
        key, value, mode );

    // Updates on profile change
    promise.then( ( data ) => {
        exports.getUserProfile( userObj[consts.PROF_KEYS.USERNAME] )
            .then( updatedProfile => {
                updatesOnProfileChange( updatedProfile );
            }).catch( err => { console.log( err ) });
    }).catch( err => console.log( err ) );


    return promise;
};

// Allows modifying entire user preferences based on a passed in preference object
// Any keys that match will be updated, if a value is null, that key will be removed from the DB
exports.modifyUserPreferences = ( userObj, prefObj ) => {
    return new Promise( ( resolve, reject ) => {

        let promises = [];

        // Get every key from the obj and update it on the DB
        for( let key in prefObj ){
            if( prefObj.hasOwnProperty( key ) ){
                let mode = consts.MODIFIY_PREFS_MODES.MODIFY;

                // If it's null, remove it from DB
                if( prefObj[key] === null ){
                    mode = consts.MODIFIY_PREFS_MODES.REMOVE;
                }

                promises.push(
                    DB.modifyUserItem(
                        consts.USER_TABLE_NAME,
                        consts.USER_PRIMARY_KEY,
                        userObj[consts.PROF_KEYS.USERNAME],
                        key,
                        prefObj[ key ],
                        mode
                    )
                );
            }
        }

        Promise.all( promises ).then( changes => {
            resolve( changes[changes.length - 1] ); // resolve the last change

            // Updates on profile change
            exports.getUserProfile( userObj[consts.PROF_KEYS.USERNAME] )
                .then( updatedProfile => {
                    updatesOnProfileChange( updatedProfile );
                }).catch( err => { console.log( err ) } )
        }).catch( err => reject( err ) );
    });
};

exports.addSavedJob = ( userObj, jobKey ) => {
    return addSavedItem(
        userObj,
        consts.PROF_KEYS.PREFS_JOBS_SAVED,
        PRIM_KEY_JOBS,
        jobKey,
        TABLE_NAME_JOBS
    );
};

exports.addSavedThingToDo = ( userObj, id ) => {
    return addSavedItem(
        userObj,
        consts.PROF_KEYS.PREFS_THINGS_SAVED,
        PRIM_KEY_THING,
        id,
        TABLE_NAME_THINGS
    );
};

exports.removeSavedItem = ( userObj, key, value ) => {
    return new Promise( ( resolve, reject ) => {

        DB.removeListItem(
            consts.USER_TABLE_NAME,
            consts.USER_PRIMARY_KEY,
            userObj[consts.PROF_KEYS.USERNAME],
            key,
            value
        ).then( data => {
            resolve( data );
        }).catch( err => {
            reject( err );
        });
    });
};

exports.addSavedHouse = ( userObj, rangeKey ) => {
    return new Promise( ( resolve, reject ) => {
        if( util.isArray( userObj[consts.PROF_KEYS.PREFS_HOUSE_SAVED] ) &&
            userObj[consts.PROF_KEYS.PREFS_HOUSE_SAVED].includes( rangeKey ) ) {
            reject( "HouseAlreadySaved" );
        } else {
            DB.getHouse( rangeKey ).then( house => {
                // We don't care about the house data itself.
                // This just proves it's a house for sale.
                DB.appendListItem(
                    consts.USER_TABLE_NAME,
                    consts.USER_PRIMARY_KEY,
                    userObj[ consts.PROF_KEYS.USERNAME ],
                    consts.PROF_KEYS.PREFS_HOUSE_SAVED,
                    rangeKey
                ).then( data => {
                    resolve( data );
                } ).catch( err => {
                    reject( err );
                } );
            } ).catch( err => reject( err ) );
        }
    });
};

exports.removeSavedHouse = ( userObj, rangeKey ) => {
    return new Promise( ( resolve, reject ) => {
        DB.removeListItem(
            consts.USER_TABLE_NAME,
            consts.USER_PRIMARY_KEY,
            userObj[consts.PROF_KEYS.USERNAME],
            consts.PROF_KEYS.PREFS_HOUSE_SAVED,
            rangeKey
        ).then( data => {
            resolve( data );
        }).catch( err => {
            reject( err );
        });
    });
};

// Change the users city match results to an array sorted by city rank
exports.cityMatchToArray = ( cityMatches ) => {
    let resArray = [];

    for( let key in cityMatches ){
        if( cityMatches.hasOwnProperty( key ) ){
            let ranking = cityMatches[key].ranking;
            resArray[ranking - 1] = cityMatches[key];
        }
    }

    return resArray;
};

// Filter sensitive/backend only data from the profile before a response
// This includes passwords, access tokens, etc.
exports.filterProfile = ( profile ) => {
    consts.PROF_KEYS_TO_EXCLUDE.forEach( ( key ) => {
        delete profile[key];
    });
    return profile;
};


let addSavedItem = ( userObj, itemKey, primKey, value, tableName ) => {
    return new Promise( ( resolve, reject ) => {
        if( userObj[consts.PROF_KEYS.PREFS_JOBS_SAVED].includes( value ) ){
            reject( 'ItemAlreadySaved' );
        } else {
            getSavedItem( primKey, value, tableName ).then( item => {
                // We're not really concerned with the return value,
                // as long as it's resolved we know everything is okay.
                DB.appendListItem(
                    consts.USER_TABLE_NAME,
                    consts.USER_PRIMARY_KEY,
                    userObj[consts.PROF_KEYS.USERNAME],
                    itemKey,
                    value
                ).then( data => {
                    resolve( data );
                }).catch( err => {
                    reject( err );
                });
            }).catch( err => {
                reject( err );
            });
        }
    });
};

// Add new thing to do
// Exists is a boolean flag to determine if we should add the job ONLY if it exists.
// Exists - true to update an existing job, false to add a new job.
let addSavedThingToSavedTable = ( value, exists ) => {
    return new Promise( ( resolve, reject ) => {
        thingSearch.getThingToDoById( value ).then( thing => {
            addSavedItemToSavedTable( PRIM_KEY_THING, value, thing, TABLE_NAME_THINGS, exists  ).then( done => {
                resolve( done );
            }).catch( err => reject( err ));
        }).catch( err => reject( err ));
    });
};

// Add new job
// Exists is a boolean flag to determine if we should add the job ONLY if it exists.
// Exists - true to update an existing job, false to add a new job.
let addSavedJobToSavedTable = ( value, exists ) => {
    return new Promise( ( resolve, reject ) => {
        jobSearch.getJobByKey( value ).then( job => {
            addSavedItemToSavedTable( PRIM_KEY_JOBS, value, job, TABLE_NAME_JOBS, exists  ).then( done => {
                resolve( done );
            }).catch( err => reject( err ));
        }).catch( err => reject( err ));
    });
};

// Helper for adding saved items to their respective tables
let addSavedItemToSavedTable = ( primKey, value, itemData, tableName, exists ) => {
    return new Promise( ( resolve, reject ) => {
        let params = {
            TableName: tableName,
            Item: {
                [primKey]: {
                    "S": value
                },
                [KEY_SAVED_ITEM]: {
                    "S": JSON.stringify( itemData )
                }
            },
            ConditionExpression: exists ?
                "attribute_exists(" + primKey + ")" :
                "attribute_not_exists(" + primKey + ")"
        };

        ddb.putItem( params, ( err, data ) => {
            if( err ) {
                reject( err );
            } else {
                resolve( data );
            }
        });
    });
};

// Get saved item from the DB
let getSavedItem = ( primKey, value, tableName ) => {
    return new Promise( ( resolve, reject ) =>{
        if( value && primKey ) {
            let params = {
                TableName: tableName,
                ExpressionAttributeValues: {
                    ":v1": {
                        S: value
                    }
                },
                KeyConditionExpression: primKey + " = :v1",
            };

            ddb.query( params, ( err, data ) => {
                if( err ) {
                    reject( err );
                } else if( data.Items[ 0 ] ) {
                    if( data.Items.length > 1 ){
                        reject( "MultipleItemsFound" );
                    }
                    let savedItem = data.Items[ 0 ];
                    savedItem = savedItem[KEY_SAVED_ITEM].S; // Get the value back
                    try{
                        resolve( JSON.parse( savedItem ) );
                    } catch( err ){
                        reject( err );
                    }
                } else {
                    // If it's not on the DB, try to add it.
                    // Job
                    if( tableName === TABLE_NAME_JOBS ) {
                        addSavedJobToSavedTable( value, false ).then( data => {
                            resolve( data );
                        } ).catch( err => reject( err ) );
                    } else if( tableName === TABLE_NAME_THINGS ){
                        addSavedThingToSavedTable( value, false ).then( data => {
                            resolve( data );
                        } ).catch( err => reject( err ) );
                    } else {
                        reject( "InvalidTable" );
                    }
                }
            } );
        } else {
            reject( "MissingParams" )
        }
    });
};

// Update users saved jobs on the job table
// If the job isn't found on indeed anymore, just log the error
// We still want to keep the most recent job information on the job table
let checkAndUpdateSavedJobs = ( jobs ) => {
    if( util.isArray( jobs ) ) {
        jobs.forEach( job => {
            let jobKey = job[ "jobkey" ];
            addSavedJobToSavedTable( jobKey, true ).then( data => {
                console.log( "Job " + jobKey + " updated successfully." );
            } ).catch( err => {
                console.log( "Job " + jobKey + " not updated: " + err );
            } );
        } );
    }
};

let timelyUpdates = ( userObj, timeGap ) => {
    let lastUpdated = userObj[consts.PROF_KEYS.LAST_UPDATED];
    let currentTime = Date.now();

    if( !lastUpdated || ( lastUpdated + timeGap ) <= currentTime ){
        let username = userObj[consts.PROF_KEYS.USERNAME];

        // START UPDATES

        // City ratings
        updateCityRatings( userObj );

        // Saved jobs
        checkAndUpdateSavedJobs( userObj[consts.PROF_KEYS.PREFS_JOBS_SAVED] );

        // END UPDATES

        // Update time stamp
        DB.modifyUserItem(
            consts.USER_TABLE_NAME,
            consts.USER_PRIMARY_KEY,
            userObj[consts.PROF_KEYS.USERNAME],
            consts.PROF_KEYS.LAST_UPDATED,
            currentTime,
            consts.MODIFIY_PREFS_MODES.MODIFY
        ).then( data => {
            console.log( username + " time stamp updated." );
        }).catch( err => {
            console.log( "Error updating " + username + " time stamp: " + err );
        });
    }
};

// Any updates that need to happen on a profile/preference change go here.
let updatesOnProfileChange = ( userObj ) => {
    updateCityRatings( userObj );
};

// Update users city ratings
let updateCityRatings = ( userObj ) => {
    // Update city ratings
    let username = userObj[consts.PROF_KEYS.USERNAME];
    cityData.updateCityRatings( userObj ).then( data => {
        console.log( "Updating " + username + " city ratings successful." );
    }).catch( err => {
        console.log( "Error updating " + username + " city ratings: " + err );
    });

};