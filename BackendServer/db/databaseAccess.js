const AWS = require( 'aws-sdk' );
AWS.config.update( { region:'us-west-2' } );
const ddb = new AWS.DynamoDB( { apiVersion: '2012-08-10' } );
const consts = require( "../constants" );
const util = require( "../util" );
const HOUSING_TABLE = "HousingTestData";

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

exports.addTestHouse = ( house ) => {
    return new Promise( (resolve, reject) => {

        let params = {
            TableName: HOUSING_TABLE,
            Item: {
                [consts.HOUSING.DB_KEYS.ADDRESS]:{
                    "S": house.address.street + "," +
                         house.address.city
                },
                [consts.HOUSING.DB_KEYS.STREET]:{
                    "S": house.address.street
                },
                [consts.HOUSING.DB_KEYS.CITY]:{
                    "S": house.address.city
                },
                [consts.HOUSING.DB_KEYS.STATE]:{
                    "S": house.address.state
                },
                [consts.HOUSING.DB_KEYS.ZIP]:{
                    "S": house.address.zip
                },
                [consts.HOUSING.DB_KEYS.TYPE]:{
                    "S": house.type
                },
                [consts.HOUSING.DB_KEYS.PRICE]:{
                    "S": house.price
                },
                [consts.HOUSING.DB_KEYS.PHOTO_LINK]:{
                    "S": house.photoLink
                },
                [consts.HOUSING.DB_KEYS.DETAILS_LINK]:{
                    "S": house.detailsLink
                },
                [consts.HOUSING.DB_KEYS.BEDS]:{
                    "N": house.attributes.bedrooms.toString()
                },
                [consts.HOUSING.DB_KEYS.HALF_BATHS]:{
                    "N": house.attributes.halfBaths.toString()
                },
                [consts.HOUSING.DB_KEYS.FULL_BATHS]:{
                    "N": house.attributes.fullBaths.toString()
                },
                [consts.HOUSING.DB_KEYS.LAT]:{
                    "N": house.coordinates.lat.toString()
                },
                [consts.HOUSING.DB_KEYS.LONG]:{
                    "N": house.coordinates.long.toString()
                },
                [consts.HOUSING.DB_KEYS.PURCHASE_TYPE]:{
                    "S": house.purchaseType.toString()
                }


            },
            ConditionExpression: "attribute_not_exists(" + consts.HOUSING.DB_KEYS.ADDRESS + ")"
        };

        // Set all missing housing keys to null.
        for( let key in params.Item ){
                if( params.Item.hasOwnProperty( key ) ) {
                    if( !params.Item[key].S && !params.Item[key].N ) {
                        params.Item[key] = {
                            "NULL": true
                        }
                    }
                }
            }


        ddb.putItem( params, ( err, data ) => {
            if ( err ) {
                // This error means that the same house was found
                // No need to reject for this.
                if( err.code === "ConditionalCheckFailedException" ){
                    console.log( house.address.street + " already saved." );
                    resolve( "HouseAlreadySaved" );
                } else {
                    reject( err );
                }
            } else {
                resolve( data );
            }
        });
    });
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