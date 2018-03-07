const AWS = require( 'aws-sdk' );
AWS.config.update( { region:'us-west-2' } );
const ddb = new AWS.DynamoDB( { apiVersion: '2012-08-10' } );
const consts = require( "../constants" );
const util = require( "../util" );

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