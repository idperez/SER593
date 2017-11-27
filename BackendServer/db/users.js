const AWS = require( 'aws-sdk' );
AWS.config.update( { region:'us-west-2' } );
const ddb = new AWS.DynamoDB( { apiVersion: '2012-08-10' } );
const consts = require( "../constants" );
const util = require( "../util" );
const jobSearch = require( "../search/jobs" );
const INDEX_SUFFIX = "-index";
const TABLE_NAME = 'topia_profiles';
const TABLE_NAME_JOBS = 'jobs';
const PRIM_KEY_JOBS = "jobkey";
const PRIM_KEY_JOB_DETAILS = "job";
const PRIMARY_KEY = consts.PROF_KEYS.USERNAME;
const DEFAULT_UPDATE_TIME = 86400000; // Time to recheck saved jobs - 24 hours in ms
const cityData = require( "../search/cityData" );

// Get user profile from database
// Authorize should be the only caller
exports.getUserProfile = ( username ) => {
    return exports.getUserProfileByPrimaryKey( PRIMARY_KEY, username );
};

// Query table by a specific key
// primKey must at least be a tables secondary key.
exports.getUserProfileByPrimaryKey = ( primKey, value ) => {
    return new Promise( ( resolve, reject ) =>{
        if( primKey && value ) {
            let params = {
                TableName: TABLE_NAME,
                ExpressionAttributeValues: {
                    ":v1": {
                        S: value.toString()
                    }
                },
                KeyConditionExpression: primKey.toString() + " = :v1",
            };

            if( PRIMARY_KEY !== primKey.toString()){
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
                    let resultProfile = {};

                    // All db items are represented as a string and nested in a sub-object
                    // with the value type. This pulls out the values, converts from string
                    // if needed, and puts them in a clean profile object.
                    for( let key in profile ) {
                        if( profile.hasOwnProperty( key ) ) {
                            let profProperty = profile[ key ];

                            // String
                            if( profProperty.hasOwnProperty( 'S' ) ) {
                                let str = profProperty.S;
                                try{
                                    str = JSON.parse( str );
                                } catch( err ){} // If it fails we assume it's a normal string
                                resultProfile[ key ] = str;
                                // Number (Int or float)
                            } else if( profProperty.hasOwnProperty( 'N' ) ) {
                                resultProfile[ key ] = parseFloat( profProperty.N );
                                // Buffer type
                            } else if( profProperty.hasOwnProperty( 'B' ) ) {
                                resultProfile[ key ] = profProperty.B;
                                // String array
                            } else if( profProperty.hasOwnProperty( 'SS' ) ) {
                                let stringSet = profProperty.SS;
                                for( let i = 0; i < stringSet.length; i++ ) {
                                    try {
                                        stringSet[i] = JSON.parse( stringSet[i] );
                                    } catch( err ){}// If it fails we assume it's a normal string
                                }
                                resultProfile[ key ] = stringSet;
                                // Number array
                            } else if( profProperty.hasOwnProperty( 'NS' ) ) {
                                resultProfile[ key ] = profProperty.NS.map( Number );
                                // Object
                            } else if( profProperty.hasOwnProperty( 'M' ) ) {
                                resultProfile[ key ] = profProperty.M;
                                // Generic list
                            } else if( profProperty.hasOwnProperty( 'L' ) ) {
                                resultProfile[ key ] = profProperty.L;
                                // Bool
                            } else if( profProperty.hasOwnProperty( 'BOOL' ) ) {
                                resultProfile[ key ] = profProperty.BOOL;
                            }
                        }
                    }

                    // Extra safety to make sure the user has a job key on DB
                    if( resultProfile[consts.PROF_KEYS.PREFS_JOBS_SAVED] ) {
                        // Get saved jobs from the job table
                        let jobProms = [];
                        let jobKeys = resultProfile[ consts.PROF_KEYS.PREFS_JOBS_SAVED ];
                        jobKeys.forEach( jobKey => {
                            jobProms.push(
                                getSavedJob( jobKey )
                            );
                        } );
                        Promise.all( jobProms ).then( jobs => {

                            resultProfile[ consts.PROF_KEYS.PREFS_JOBS_SAVED ] = jobs;

                            resolve( resultProfile );

                            // Check expiration time stamp for the users profile.
                            // This runs after the response, so the current call for the user profile
                            // will not have to wait for the updates.

                            timelyUpdates( resultProfile, DEFAULT_UPDATE_TIME );

                        } ).catch( err => reject( err ) );

                    // If they don't have a saved jobs key, just send what's available.
                    } else {
                        resolve( resultProfile )
                    }

                } else {
                    reject( 'NoResultsFound' );
                }
            } );
        } else {
            reject( "MissingParams" )
        }
    });
};

exports.addNewUser = ( username, password, email ) => {
    return new Promise( (resolve, reject) => {
        let params = {
            TableName: TABLE_NAME,
            Item: {
                [consts.PROF_KEYS.USERNAME]:{
                    "S": username
                },
                [consts.PROF_KEYS.PASSWORD]:{
                    "S": password
                },
                [consts.PROF_KEYS.EMAIL]:{
                    "S": email
                }
            },
            ConditionExpression: "attribute_not_exists(" + consts.PROF_KEYS.USERNAME + ")"
        };

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

// Modify an existing user profile key
exports.modifyUserItem = ( userObj, key, value, mode ) => {
    let promise;

    // Check parameters
    // Key
    if( !key ) {
        promise = Promise.reject( 'InvalidKey' );
    // Mode
    } else if ( !mode || !util.objectContains( consts.MODIFIY_PREFS_MODES, mode ) ) {
        promise = Promise.reject( 'InvalidMode' );
    // Value
    } else if ( !value && mode !== consts.MODIFIY_PREFS_MODES.REMOVE ) {
        promise = Promise.reject( 'MissingValue' );
    } else {

        switch( mode ){
            case consts.MODIFIY_PREFS_MODES.MODIFY:
                promise = addUserItem( userObj[consts.PROF_KEYS.USERNAME], key, value );
                break;
            case consts.MODIFIY_PREFS_MODES.REMOVE:
                promise = removeUserItem( userObj[consts.PROF_KEYS.USERNAME], key );
                break;
            case consts.MODIFIY_PREFS_MODES.LIST_APPEND:
                promise = appendListItem( userObj[consts.PROF_KEYS.USERNAME], key, value );
                break;
            case consts.MODIFIY_PREFS_MODES.LIST_REMOVE:
                promise = removeListItem( userObj, key, value );
                break;
            default:
                promise = Promise.reject( 'ModeError' );
        }
    }

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
                    exports.modifyUserItem(
                        userObj,
                        key,
                        prefObj[ key ],
                        mode
                    )
                );
            }
        }

        Promise.all( promises ).then( changes => {
            resolve( changes[changes.length - 1] ); // resolve the last change
            updatesOnProfileChange( userObj );
        }).catch( err => reject( err ) );
    });
};

exports.addSavedJob = ( userObj, jobKey ) => {
    return new Promise( ( resolve, reject ) => {
       if( userObj[consts.PROF_KEYS.PREFS_JOBS_SAVED].includes( jobKey ) ){
           reject( 'JobAlreadySaved' );
       } else {
           // Hit indeed for job info
           getSavedJob( jobKey ).then( job => {
               // We're not really concerned with the return value,
               // as long as it's resolved we know everything is okay.
               appendListItem(
                   userObj[consts.PROF_KEYS.USERNAME],
                   consts.PROF_KEYS.PREFS_JOBS_SAVED,
                   jobKey
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

exports.removeSavedJob = ( userObj, jobKey ) => {
    return new Promise( ( resolve, reject ) => {

        removeListItem(
            userObj,
            consts.PROF_KEYS.PREFS_JOBS_SAVED,
            jobKey
        ).then( data => {
            resolve( data );
        }).catch( err => {
            reject( err );
        });
    });
};

// Add new user profile item
let addUserItem = ( username, key, value ) => {
    return new Promise( ( resolve, reject ) =>{
        let param = {
            TableName: TABLE_NAME,
            Key:{
                [PRIMARY_KEY]: {
                    S: username
                }
            },
            ExpressionAttributeNames:{
                "#K": key
            },
            ExpressionAttributeValues:{
                ":v": {}
            },
            UpdateExpression: "SET #K = :v",
        };
        // Add key/value pair by type
        param['ExpressionAttributeValues'][':v'] = {};
        if( !isNaN( value ) ) {
            param['ExpressionAttributeValues'][':v']['N'] = value.toString();
        } else if( typeof value === 'string' ){
            param['ExpressionAttributeValues'][':v']['S'] = value;
        } else if( typeof value === 'object' ) {
            if( Array.isArray( value ) ){
                // Number array
                if( value.every( Number ) ){
                    param['ExpressionAttributeValues'][':v']['NS'] =
                        value.map( String );
                    // String array
                } else if ( value.every( String ) ){
                    param['ExpressionAttributeValues'][':v']['SS'] = value;
                    // Generic list
                } else {
                    param['ExpressionAttributeValues'][':v']['L'] = value;
                }
                // Object
            } else {
                param['ExpressionAttributeValues'][':v']['M'] = value;
            }
        } else if( typeof value === 'boolean' ) {
            param['ExpressionAttributeValues'][':v']['BOOL'] = value;
        }

        ddb.updateItem( param, ( err, data ) => {
            if( err ) {
                reject( err );
            } else {
                resolve( data );
            }
        });
    });
};

// Add item to a list or set on DB
let appendListItem = ( username, listname, value ) => {
    return new Promise( ( resolve, reject ) => {

        let param = {
            TableName: TABLE_NAME,
            Key:{
                [PRIMARY_KEY]: {
                    S: username
                }
            },
            ExpressionAttributeNames:{
                "#K": listname
            },
            ExpressionAttributeValues:{
                ":v": { SS: [value.toString()] }
            },
            UpdateExpression: "ADD #K :v",
        };
        ddb.updateItem( param, ( err, data ) => {
            if( err ) {
                reject( err );
            } else {
                resolve( data );
            }
        });
    });
};

// Remove item from a list or set on DB
let removeListItem = ( userObj, listname, elemVal ) => {
    return new Promise( ( resolve, reject ) => {

        let param = {
            TableName: TABLE_NAME,
            Key: {
                [PRIMARY_KEY]: {
                    S: userObj[ consts.PROF_KEYS.USERNAME ]
                }
            },
            ExpressionAttributeNames: {
                "#K": listname
            },
            ExpressionAttributeValues: {
                ":v": { SS: [ elemVal.toString() ] }
            },
            UpdateExpression: "DELETE #K :v",
        };
        ddb.updateItem( param, ( err, data ) => {
            if( err ) {
                reject( err );
            } else {
                resolve( data );
            }
        });

    });
};

// Sets user item to null
let removeUserItem = ( username, key ) => {
    return new Promise( ( resolve, reject ) => {
        let param = {
            TableName: TABLE_NAME,
            Key:{
                [PRIMARY_KEY]: {
                    S: username
                }
            },
            ExpressionAttributeNames:{
                "#K": key
            },
            ExpressionAttributeValues:{
                ":v": { NULL: true }
            },
            UpdateExpression: "SET #K = :v",
        };
        ddb.updateItem( param, ( err, data ) => {
            if( err ) {
                reject( err );
            } else {
                resolve( data );
            }
        });
    });
};

// Add job to the job DB table
let addJob = ( jobKey ) => {
    return new Promise( ( resolve, reject ) => {
        jobSearch.getJobByKey( jobKey ).then( job => {

            // Sanitize any HTML tags in the job snippet before saving to the DB.
            job.snippet = sanitizeHTML( job.snippet );

            let params = {
                TableName: TABLE_NAME_JOBS,
                Item: {
                    [PRIM_KEY_JOBS]: {
                        "S": jobKey
                    },
                    [PRIM_KEY_JOB_DETAILS]: {
                        "S": JSON.stringify( job )
                    }
                },
                ConditionExpression: "attribute_not_exists(" + PRIM_KEY_JOBS + ")"
            };

            ddb.putItem( params, ( err, data ) => {
                if( err ) {
                    reject( err );
                } else {
                    resolve( data );
                }
            });
        });
    });

};

// Get saved job from the DB
let getSavedJob = ( jobKey ) => {
    return new Promise( ( resolve, reject ) =>{

        if( jobKey ) {
            let params = {
                TableName: TABLE_NAME_JOBS,
                ExpressionAttributeValues: {
                    ":v1": {
                        S: jobKey
                    }
                },
                KeyConditionExpression: PRIM_KEY_JOBS + " = :v1",
            };

            ddb.query( params, ( err, data ) => {
                if( err ) {
                    reject( err );
                } else if( data.Items[ 0 ] ) {
                    if( data.Items.length > 1 ){
                        reject( "MultipleJobsFound" );
                    }
                    let job = data.Items[ 0 ];
                    job = job[PRIM_KEY_JOB_DETAILS].S; // Get the job value back
                    try{
                        resolve( JSON.parse( job ) );
                    } catch( err ){
                        reject( err );
                    }
                } else {
                    // If it's not on the DB, try to add it.
                    addJob(jobKey).then( data => {
                        resolve( data );
                    }).catch( err => reject( err ));
                }
            } );
        } else {
            reject( "MissingParams" )
        }
    });
};

// Check the time stamp for when the job was last updated, if stamp expired, update it.
let checkAndUpdateSavedJobs = ( username, savedJobs ) => {
    let promises = [];

    if( savedJobs && util.isArray( savedJobs ) ) { // If there are even any saved jobs
        for( let i = savedJobs.length - 1; i >= 0; i-- ) {
            if( savedJobs[i] && typeof savedJobs[i] === 'object'  ) {
                // Update the job from indeed
                promises.push(
                    new Promise( ( resolveUpdate, rejectUpdate ) => {
                        jobSearch.getJobByKey( savedJobs[i]["jobkey"] ).then( updatedJob => {
                            resolveUpdate( updatedJob );
                        } ).catch( err => {
                            rejectUpdate( err );
                        } );
                    } )
                );
            } else {
                console.log( 'InvalidSavedJobFormat: ' + savedJobs[i].toString() );
            }
        }

        Promise.all( promises ).then( updatedJobs => {
            // Success, update savedJobs on the DB
            // Stringify all the jobs for storage on DB again.
            for(let i = 0; i < updatedJobs.length; i++){
                updatedJobs[i] = JSON.stringify( updatedJobs[i] );
            }
            // Store on the DB
            addUserItem(
                username,
                consts.PROF_KEYS.PREFS_JOBS_SAVED,
                updatedJobs
            ).then( data => {
                console.log( "Updating " + username + " saved jobs successful." )
            }).catch( err => {
                console.log( "Error updating " + username + " saved jobs on DB: " + err );
            } );
        } ).catch( err => {
            console.log( "Error updating " + username + " saved jobs: " + err );
        } )
    } else {
        console.log( username + " has no saved jobs." );
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

        // DISABLED UNTIL AFTER SHOWCASE - Issue #137
        // Saved jobs
        //checkAndUpdateSavedJobs( username, userObj[consts.PROF_KEYS.PREFS_JOBS_SAVED] );

        // END UPDATES

        // Update time stamp
        exports.modifyUserItem(
            userObj,
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