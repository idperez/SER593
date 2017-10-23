const AWS = require( 'aws-sdk' );
AWS.config.update( { region:'us-west-2' } );
const ddb = new AWS.DynamoDB( { apiVersion: '2012-08-10' } );
const consts = require( "../constants" );
const INDEX_SUFFIX = "-index";
const TABLE_NAME = 'topia_profiles';
const PRIMARY_KEY = consts.PROF_KEYS.USERNAME;

exports.hasUser = ( username ) => {
    return new Promise( ( resolve, reject ) => {
        exports.getUserProfile( username ).then( data => {
            if( data.Item )
            resolve(  );
        }).catch( err => {
            reject( err );
        });
    });
};

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
                                resultProfile[ key ] = profProperty.S;
                                // Number (Int or float)
                            } else if( profProperty.hasOwnProperty( 'N' ) ) {
                                resultProfile[ key ] = parseFloat( profProperty.N );
                                // Buffer type
                            } else if( profProperty.hasOwnProperty( 'B' ) ) {
                                resultProfile[ key ] = profProperty.B;
                                // String array
                            } else if( profProperty.hasOwnProperty( 'SS' ) ) {
                                resultProfile[ key ] = profProperty.SS;
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
                    resolve( resultProfile );
                } else {
                    reject( 'NoResultsFound' );
                }
            } );
        } else {
            reject( "MissingParams" )
        }
    });
};

// Add or replace user profile item
exports.addUserItem = ( username, key, value ) => {
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
        if( typeof value === 'string' ){
            param['ExpressionAttributeValues'][':v']['S'] = value;
        } else if( typeof value === 'number' ){
            param['ExpressionAttributeValues'][':v']['N'] = value.toString();
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

// Sets user item to null
exports.removeUserItem = ( username, key ) => {
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
            UpdateExpression: "REMOVE #K",
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


