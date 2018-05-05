// Utility file for various helper functions
const LOCATION_ENDPOINT = "https://maps.googleapis.com/maps/api/geocode/json";
const qs = require( 'querystring' );
const request = require( 'request' );


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

exports.capitalizeFirstLetter = ( str ) => {
    return str.charAt( 0 ).toUpperCase() + str.slice( 1 ).toLowerCase();
};

// Miles to kilometer conversion
exports.milesToKm = ( miles ) => {
    return 1.6 * miles;
};

exports.average = ( numArr ) => {
    return numArr.reduce( ( a, b ) => { return a + b } ) / numArr.length;
};

// Use google geocaching API to get coordinates
exports.getCoordinatesByAddress = ( address, city, state ) => {
    return new Promise( ( resolve, reject ) => {

        let fullAddress;
        if( address && address !== "" ){
            address = address.split("-")[0];
            fullAddress = address + "," + city + "," + state;
        } else {
            fullAddress = city + "," + state;
        }

        fullAddress = fullAddress.replace( / /g, "+" );
        let query = {
            key: process.env.KEY_GOOGLE,
            address: fullAddress
        };

        console.log( "Getting coords for: " + fullAddress );

        query = qs.stringify( query );

        request( LOCATION_ENDPOINT + "?" + query, ( err, response, body ) => {
            let lat = null;
            let long = null;
            if( err ) {
                // Resolve null location values
                console.log( "Warning: No location found for " + fullAddress );
            } else {
                let locObj = JSON.parse( body ).results[0];
                if( locObj ) {
                    locObj = locObj.geometry.location;
                    lat = locObj.lat ? locObj.lat : null;
                    long = locObj.lng ? locObj.lng : null;
                } else {
                    console.log( "Warning: No location found for " + fullAddress );
                }
            }
            resolve( {
                lat: lat,
                long: long,
                city: city
            });
        });
    });
};

// Get location of a business as coordinates
exports.getCoordinatesOfCompany = ( companyName ) => {
    return new Promise( ( resolve, reject ) => {
        resolve("some coords here");
    });
};

exports.allPromisesSkipErrors = ( promises ) => {
    return Promise.all(
        promises.map(p => p.catch(err => null))
    )
};
