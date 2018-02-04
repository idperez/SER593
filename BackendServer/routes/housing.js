const express = require( 'express' );
const router = express.Router();
const housing = require( '../search/housing' );

router.post( '/',
    ( req, res ) => {
        housing.parseHousingSearchResults(
            req.body.results
        ).then( parsedSearch => {
            res.send( parsedSearch );
        }).catch( err => {

        });
    }
);


module.exports = router;