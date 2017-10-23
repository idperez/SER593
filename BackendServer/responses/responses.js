// Common responses

// Report errors
// Param errObj can be a string to represent type or an object with code and message properties.
// Used to conform with AWS errors
exports.errorMessage = ( errObj ) => {
    return {
        "err": {
            type: errObj.code ? errObj.code : errObj, // Allows for strings
            msg: errObj.message ? errObj.message : ""
        }
    }
};

exports.empty = {};