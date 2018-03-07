const express = require( 'express' );
const router = express.Router();
const scrape = require( '../scrape/housing' );
const tr = require('tor-request');
const resMsg = require('../responses/responses.js');
const consts = require( "../constants" );
const qs = require( 'querystring' );
const housing = require( "../search/housing" );



router.get( '/',
    ( req, res ) => {

        let lat = req.query.lat;
        let long = req.query.long;
        let radiusInMiles = req.query.radius;

        housing.getHousingByCoordinates(
            null,
            lat,
            long,
            radiusInMiles
        ).then( data => {
            res.send( data );
        }).catch( err => {
            res.send( err );
        });

    }
);

router.get( '/housedetails',
    ( req, res ) => {

        let address = req.query.address;
        let city = req.query.city;
        let state = req.query.state;
        // Since we have static housing search data,
        // price needs to be carried from front end
        // because zillow may not have it for sale
        let price = req.query.price;

        housing.getHouseDetails(
            address,
            city,
            state,
            price
        ).then( data => {
            res.send( data );
        }).catch( err => {
            res.send( err );
        });

    }
);

// Server development use only
// Type is rent or buy
// pages is the max page number to scrape
// City must have a dash ( - ) in place of spaces
// State is two letter abbreviation
// Response: { link:"https...", results:... }
// No API docs for this since it is not available
// outside of backend development.
router.post( '/scrape',
    ( req, res ) => {

        if( process.env.DEV_USER === res.locals.user[ "accessToken_token" ] ) {
            let pages = req.body.pages;
            let type = req.body.type === consts.HOUSING.BUY_TYPE ?
                consts.HOUSING.BUY_PATH :
                consts.HOUSING.RENT_PATH;
            let timeout = 0;

            if( pages ) {
                let promises = [];
                for( let i = 0; i < consts.RATED_CITIES.length; ++i ){

                    let city = consts.RATED_CITIES[i].city;
                    let state = consts.RATED_CITIES[i].state;
                    let path = process.env.HOUSING_SITE;
                    path += "/" + state +
                        "/" + city;
                    path += type;

                    console.log( path );

                    for( let j = 1; j <= pages; ++j ) {

                        let queryString = qs.stringify( {
                            page: j
                        } );

                        promises.push(
                            new Promise( ( pageResolve, pageReject ) => {
                                setTimeout(function() {

                                    tr.request( path + "?" + queryString, ( err, response, body ) => {
                                        if( err ) {
                                            console.log( "Error: " + err );
                                        } else {
                                            scrape.parseHousingSearchResults(
                                                body,
                                                req.body.type
                                            ).then( searchResults => {
                                                pageResolve( searchResults );
                                            } ).catch( err => {
                                                pageReject( err );
                                            } );
                                        }
                                    } )
                                }, timeout );
                            } )
                        );
                        timeout += 1000;
                    }
                }

                Promise.all( promises ).then( pages => {
                    res.send( pages );
                } ).catch( err =>
                    res.send( err )
                );

            } else {
                res.send( resMsg.errorMessage( "MissingParams" ) );
            }
        } else {
            res.send("Access Denied! Development use only.")
        }
    }
);

// ONE time use to setup table! Just a helper to setup table on AWS.
router.post('/scrape/tablesetup', (req, res) => {
    if( process.env.DEV_USER === res.locals.user["accessToken_token"] ) {
        scrape.setupTable();
        res.send("Table setup ran, see console on server");
    } else {
        res.send("Access Denied! Development use only.")
    }
});

module.exports = router;