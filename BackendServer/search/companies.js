const request = require( 'request' );
const qs = require( 'querystring' );
const GLASSDOOR_ENDPOINT = "http://api.glassdoor.com/api/api.htm";

exports.getCompanyInfo = ( companyName ) => {
    return new Promise( ( resolve, reject ) => {
        if( !companyName ){
            reject(
                { code: 'NoCompanyName', message: "Check your query, companyname missing or empty." }
            );
        }
        let jobQuery = {
            "t.p": process.env.KEY_ID_GLASSDOOR,
            "t.k": process.env.KEY_KEY_GLASSDOOR,
            format: 'json',
            v: 1,                // API version
            action: 'employers', // Must be set to employers
            userip: '0.0.0.0',
            useragent: '',
            q: companyName,      // Query
            l: "country",        // Specify type of location to search. City, state or country
            country: "USA",      // Currently only support for USA.
            ps: 1                // Only grab the first result
        };

        let query = qs.stringify( jobQuery );

        request( GLASSDOOR_ENDPOINT + '?' + query, ( err, innerResponse, innerBody ) => {
            if( err ) {
                reject( err );
            } else {
                // Get only result from array
                let company =  JSON.parse(innerBody).response.employers[0];
                if( !company ){
                    reject( 'CompanyNotFound' )
                }
                resolve( company );
            }
        } );

    });
};