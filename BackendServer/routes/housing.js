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

        let path = process.env.HOUSING_SITE;
        let state = req.body.state;
        let city = req.body.city;
        let pages = req.body.pages;

        path += "/" + state +
            "/" + city;

        path += req.body.type === consts.HOUSING.BUY_TYPE ?
            consts.HOUSING.BUY_PATH :
            consts.HOUSING.RENT_PATH;

        console.log( path );

        if( city && state && pages ) {
            let promises = [];
            for( let i = 1; i <= pages; ++i ) {

                let queryString = qs.stringify( {
                    page: i
                } );

                promises.push(
                    new Promise( ( pageResolve, pageReject ) => {
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
                    } )
                );
            }

            Promise.all( promises ).then( pages => {
                res.send( pages );
            } ).catch( err =>
                res.send( err )
            );

        } else {
            res.send( resMsg.errorMessage( "MissingParams" ) );
        }
    }
);


module.exports = router;