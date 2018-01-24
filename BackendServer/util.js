// Utility file for various helper functions

exports.isArray = ( array ) => {
    return array && array.constructor === Array;
};

exports.emptyArray = ( array ) => {
    return array.length === 0;
};

// See if a JSON object contains a certain value
exports.objectContains = ( obj, value ) => {
    let res = false;

    for( let key in obj ){
        if( obj.hasOwnProperty( key ) && obj[key] === value ){
            res = true;
        }
    }

    return res;
};
