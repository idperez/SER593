const consts = require( "../constants" );
const DB = require( "../db/databaseAccess" );

// Get the last job index that was updated
exports.getLastUpdatedIndex = ( indexPrimKey ) => {
    return new Promise( ( resolve, reject ) => {
        DB.getPrimaryItem( consts.CONFIG_TABLE_NAME, consts.CONFIG_PRIMARY_KEY, indexPrimKey ).then( lastIndex => {
            lastIndex = lastIndex[consts.CONFIG_VALUE_KEY];
            if( isNaN( lastIndex ) ){
                reject( "Last updated index is not a number!" )
            } else {
                resolve( lastIndex );
            }
        }).catch( err => reject( err ) );
    });
};

// Set the last updated job index
exports.setLastUpdatedIndex = ( indexPrimKey, endingIndex ) => {
    DB.modifyDBItem(
        consts.CONFIG_TABLE_NAME,
        consts.CONFIG_PRIMARY_KEY,
        indexPrimKey,
        consts.CONFIG_VALUE_KEY,
        endingIndex,
        consts.MODIFIY_PREFS_MODES.MODIFY
    ).then( done => {
        console.log( "Index updated: " + endingIndex );
    }).catch( err => {
        console.log( "Failed to update index to " + endingIndex + ": " + err )
    });
};