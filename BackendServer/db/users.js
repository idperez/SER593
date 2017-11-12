const AWS = require( 'aws-sdk' );
AWS.config.update( { region:'us-west-2' } );
const ddb = new AWS.DynamoDB( { apiVersion: '2012-08-10' } );
const consts = require( "../constants" );
const util = require( "../util" );
const jobSearch = require( "../search/jobs" );
const INDEX_SUFFIX = "-index";
const TABLE_NAME = 'topia_profiles';
const PRIMARY_KEY = consts.PROF_KEYS.USERNAME;
const JOB_UPDATE_TIME = 86400000; // Time to recheck saved jobs - 24 hours in ms

// Get user profile from database
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

                    // As stated below, resolve before the saved job update
                    resolve( resultProfile );

                    // Check expiration time stamp for the users saved jobs.
                    // This runs after the response, so the current call for the user profile
                    // will not get the updated jobs.
                    if( resultProfile[consts.PROF_KEYS.PREFS_JOBS_SAVED] ) {
                        checkAndUpdateSavedJobs(
                            resultProfile[ consts.PROF_KEYS.USERNAME ],
                            JSON.parse( JSON.stringify( resultProfile[ consts.PROF_KEYS.PREFS_JOBS_SAVED ] ) )
                        );
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
exports.modifyUserItem = ( username, key, value, mode ) => {
    let promise;

    // Check parameters
    // Key
    if( !key || !util.objectContains( consts.PROF_KEYS, key ) ) {
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
                promise = addUserItem( username, key, value );
                break;
            case consts.MODIFIY_PREFS_MODES.REMOVE:
                promise = removeUserItem( username, key );
                break;
            case consts.MODIFIY_PREFS_MODES.LIST_APPEND:
                promise = appendListItem( username, key, value );
                break;
            case consts.MODIFIY_PREFS_MODES.LIST_REMOVE:
                promise = removeListItem( username, key, value );
                break;
            default:
                promise = Promise.reject( 'ModeError' );
        }
    }

    return promise;
};

exports.addSavedJob = ( username, jobKey ) => {
    return new Promise( ( resolve, reject ) => {
       getSavedJob( username, jobKey ).then( job => {
           if( job !== null ){
               reject( 'JobAlreadySaved' )
           } else {
               // Hit indeed for job info
               jobSearch.getJobByKey( jobKey ).then( job => {
                   // Save the job
                   if( !job ){
                       reject( 'JobNotFound' )
                   } else {
                       let jobObj = job;
                       // Set the timestamp for when it was last accessed.
                       jobObj[consts.JOB_PROPS.LAST_CHECKED] = Date.now();

                       appendListItem(
                           username,
                           consts.PROF_KEYS.PREFS_JOBS_SAVED,
                           JSON.stringify( jobObj )
                       ).then( data => {
                           resolve( data );
                       }).catch( err => {
                           reject( err );
                       });
                   }
               }).catch( err => {
                   reject( err );
               });
           }
        }).catch( err => {
            reject( err );
        });
    });
};

exports.removeSavedJob = ( username, jobKey ) => {
    return new Promise( ( resolve, reject ) => {
        getSavedJob( username, jobKey ).then( job => {
            if( job === null ){
                reject( 'SavedJobNotFound' );
            } else {
                removeListItem(
                    username,
                    consts.PROF_KEYS.PREFS_JOBS_SAVED,
                    JSON.stringify( job )
                ).then( data => {
                    resolve( data );
                }).catch( err => {
                    reject( err );
                });
            }
        }).catch( err => {
            reject( err )
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
let removeListItem = ( username, listname, elemVal ) => {
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
                    ":v": { SS: [elemVal.toString()] }
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

// Get saved job from the DB
// Job is null if it's not found on users profile
let getSavedJob = ( username, jobKey ) => {
    return new Promise( ( resolve, reject ) => {
        exports.getUserProfile( username ).then( profile => {
            let job = null;
            let list = profile[consts.PROF_KEYS.PREFS_JOBS_SAVED];
            if( list ) {
                list.forEach( foundJob => {
                    if( foundJob[ "jobkey" ] === jobKey ) {
                        job = foundJob;
                    }
                } );
            }
            resolve( job );
        }).catch( err => {
            reject( err );
        });
    });
};

// Check the time stamp for when the job was last updated, if stamp expired, update it.
let checkAndUpdateSavedJobs = ( username, savedJobs ) => {
    let currentTime = Date.now();
    let promises = [];

    if( savedJobs && util.isArray( savedJobs ) ) { // If there are even any saved jobs
        for( let i = savedJobs.length - 1; i >= 0; i-- ) {
            if( savedJobs[i] && typeof savedJobs[i] === 'object'  ) {
                let lastChecked = savedJobs[i][consts.JOB_PROPS.LAST_CHECKED ];
                // Compare times and make sure it's not also expired
                if( !savedJobs[i].expired &&
                    ( !lastChecked || ( lastChecked + JOB_UPDATE_TIME ) <= currentTime ) ) {
                    // Update the job from indeed
                    promises.push(
                        new Promise( ( resolveUpdate, rejectUpdate ) => {
                            jobSearch.getJobByKey( savedJobs[i]["jobkey"] ).then( updatedJob => {
                                let resJob = Object.assign( {}, savedJobs[i], updatedJob );
                                resJob[consts.JOB_PROPS.LAST_CHECKED] = currentTime;
                                resolveUpdate( resJob );
                            } ).catch( err => {
                                rejectUpdate( err );
                            } );
                        } )
                    );
                    // Remove this job from the pool
                    savedJobs.splice( i, 1 );
                }
            } else {
                console.log( 'InvalidSavedJobFormat' );
            }
        }

        Promise.all( promises ).then( updatedJobs => {
            // Success, update savedJobs on the DB
            let usersSavedJobs = savedJobs.concat( updatedJobs );
            // Stringify all the jobs for storage on DB again.
            for(let i = 0; i < usersSavedJobs.length; i++){
                usersSavedJobs[i] = JSON.stringify( usersSavedJobs[i] );
            }
            // Store on the DB
            addUserItem(
                username,
                consts.PROF_KEYS.PREFS_JOBS_SAVED,
                usersSavedJobs
            ).then( data => {
                if( !util.emptyArray( updatedJobs ) ) {
                    let updatedStr = "";
                    for( let i = 0; i < updatedJobs.length; i++ ) {
                        updatedStr += updatedJobs[ i ].jobkey + " ";
                    }
                    console.log( username + "'s jobs updated: " + updatedStr );
                }
            }).catch( err => { console.log( err ); } );
        } ).catch( err => {
            console.log( err.toString() );
        } )
    }
};