// Test file for development
const express = require( 'express' );
const router = express.Router();
const users = require( "../db/users" );
const city = require("../search/cityData");
const housing = require( '../search/housing' );
const request = require( 'request' );
const consts = require( "../constants" );


router.get('/cityratings', ( req, res ) => {
    city.updateCityRatings( res.locals.user ).then( user => {
        res.send( user );
    }).catch( err => {
        res.send( err );
    })
});

// Type is rent or buy
// State is two letter abbreviation
// Response: { link:"https...", results:... }
router.get( '/housing',
    ( req, res ) => {

        let path = process.env.HOUSING_SITE;

        // TODO - allow query for renting or buying
        path += consts.HOUSING.BUY_PATH;

        path += "/" + req.query.state +
                "/" + req.query.city;

        request( path, ( err, response, body ) => {
            if( err ) {
                res.send( err );
            } else {
                housing.parseHousingSearchResults( body
                ).then( searchResults => {
                    res.send( { link: path, results: searchResults } );
                }).catch( err => {
                    res.send( err );
                });
            }
        });

    }
);


module.exports = router;