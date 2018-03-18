const AWS = require( 'aws-sdk' );
AWS.config.update( { region:'us-west-2' } );
const ddb = new AWS.DynamoDB( { apiVersion: '2012-08-10' } );
const consts = require( "../constants" );
const util = require( "../util" );
const INDEX_SUFFIX = "-index";

// Modify an existing user profile key
// Internal program use
exports.modifyUserItem = ( tableName, primKey, primVal, key, value, mode ) => {
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
                promise = addItem( tableName, primKey, primVal, key, value );
                break;
            case consts.MODIFIY_PREFS_MODES.REMOVE:
                promise = removeItem( tableName, primKey, primVal, key );
                break;
            case consts.MODIFIY_PREFS_MODES.LIST_APPEND:
                promise = exports.appendListItem( tableName, primKey, primVal, key, value );
                break;
            case consts.MODIFIY_PREFS_MODES.LIST_REMOVE:
                promise = exports.removeListItem( tableName, primKey, primVal, key, value );
                break;
            default:
                promise = Promise.reject( 'ModeError' );
        }
    }

    return promise;
};

exports.getHouse = ( rangeKey ) => {
    return new Promise( ( resolve, reject ) => {
        if( rangeKey ){
            let params = {
                TableName: consts.HOUSING.TABLE,
                ExpressionAttributeValues: {
                    ":v1": {
                        S: rangeKey.toString()
                    }
                },
                KeyConditionExpression: consts.HOUSING.DB_KEYS.RANGE_KEY + " = :v1",
                IndexName: consts.HOUSING.DB_KEYS.RANGE_KEY + INDEX_SUFFIX
            };

            ddb.query( params, ( err, data ) => {
                if( err ) {
                    reject( err );
                } else if( data.Items[ 0 ] ) {
                    if( data.Items.length > 1 ){
                        reject( "MultipleHousesFound" );
                    }
                    let house = data.Items[ 0 ];
                    house = exports.extractData( house );
                    resolve( house );
                } else {
                    reject( 'NoResultsFound' );
                }
            } );
        } else {
            reject( "MissingRangeKey" )
        }

    });
};

// Extracts database data into usable JSON
exports.extractData = ( databaseData ) => {
    let cleanedData = {};
    // All db items are represented as a string and nested in a sub-object
    // with the value type. This pulls out the values, converts from string
    // if needed, and puts them in a clean profile object.
    for( let key in databaseData ) {
        if( databaseData.hasOwnProperty( key ) ) {
            let profProperty = databaseData[ key ];

            // String
            if( profProperty.hasOwnProperty( 'S' ) ) {
                let str = profProperty.S;
                try{
                    str = JSON.parse( str );
                } catch( err ){} // If it fails we assume it's a normal string
                cleanedData[ key ] = str;
                // Number (Int or float)
            } else if( profProperty.hasOwnProperty( 'N' ) ) {
                cleanedData[ key ] = parseFloat( profProperty.N );
                // Buffer type
            } else if( profProperty.hasOwnProperty( 'B' ) ) {
                cleanedData[ key ] = profProperty.B;
                // String array
            } else if( profProperty.hasOwnProperty( 'SS' ) ) {
                let stringSet = profProperty.SS;
                for( let i = 0; i < stringSet.length; i++ ) {
                    try {
                        stringSet[i] = JSON.parse( stringSet[i] );
                    } catch( err ){}// If it fails we assume it's a normal string
                }
                cleanedData[ key ] = stringSet;
                // Number array
            } else if( profProperty.hasOwnProperty( 'NS' ) ) {
                cleanedData[ key ] = profProperty.NS.map( Number );
                // Object
            } else if( profProperty.hasOwnProperty( 'M' ) ) {
                cleanedData[ key ] = profProperty.M;
                // Generic list
            } else if( profProperty.hasOwnProperty( 'L' ) ) {
                cleanedData[ key ] = profProperty.L;
                // Bool
            } else if( profProperty.hasOwnProperty( 'BOOL' ) ) {
                cleanedData[ key ] = profProperty.BOOL;
            }
        }
    }
    return cleanedData;
};

// Add new item
let addItem = ( tableName, primKey, primValue, key, value ) => {
    return new Promise( ( resolve, reject ) =>{
        if( !util.objectContains( consts.PROF_KEYS, key ) ){
            reject( "InvalidKey" );
        } else {
            let param = {
                TableName: tableName,
                Key: {
                    [ primKey ]: {
                        S: primValue
                    }
                },
                ExpressionAttributeNames: {
                    "#K": key
                },
                ExpressionAttributeValues: {
                    ":v": {}
                },
                UpdateExpression: "SET #K = :v",
            };
            // Add key/value pair by type
            param[ 'ExpressionAttributeValues' ][ ':v' ] = {};
            if( !isNaN( value ) ) {
                param[ 'ExpressionAttributeValues' ][ ':v' ][ 'N' ] = value.toString();
            } else if( typeof value === 'string' ) {
                param[ 'ExpressionAttributeValues' ][ ':v' ][ 'S' ] = value;
            } else if( typeof value === 'object' ) {
                if( Array.isArray( value ) ) {
                    // Number array
                    if( value.every( Number ) ) {
                        param[ 'ExpressionAttributeValues' ][ ':v' ][ 'NS' ] =
                            value.map( String );
                        // String array
                    } else if( value.every( String ) ) {
                        param[ 'ExpressionAttributeValues' ][ ':v' ][ 'SS' ] = value;
                        // Generic list
                    } else {
                        param[ 'ExpressionAttributeValues' ][ ':v' ][ 'L' ] = value;
                    }
                    // Object
                } else {
                    param[ 'ExpressionAttributeValues' ][ ':v' ][ 'M' ] = value;
                }
            } else if( typeof value === 'boolean' ) {
                param[ 'ExpressionAttributeValues' ][ ':v' ][ 'BOOL' ] = value;
            }

            ddb.updateItem( param, ( err, data ) => {
                if( err ) {
                    reject( err );
                } else {
                    resolve( data );
                }
            } );
        }
    });
};

// Add item to a list or set on DB
exports.appendListItem = ( tableName, primKey, primVal, listname, value ) => {
    return new Promise( ( resolve, reject ) => {

        let param = {
            TableName: tableName,
            Key:{
                [primKey]: {
                    S: primVal
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
exports.removeListItem = ( tableName, primKey, primVal, listname, elemVal ) => {
    return new Promise( ( resolve, reject ) => {

        let param = {
            TableName: tableName,
            Key: {
                [primKey]: {
                    S: primVal
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

// Sets item to null
let removeItem = ( tableName, primKey, primVal, key ) => {
    return new Promise( ( resolve, reject ) => {
        let param = {
            TableName: tableName,
            Key:{
                [primKey]: {
                    S: primVal
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