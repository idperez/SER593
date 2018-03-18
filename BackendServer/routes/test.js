// Test file for development
const express = require( 'express' );
const router = express.Router();
const city = require("../search/cityData");


router.get('/cityratings', ( req, res ) => {
    city.updateCityRatings( res.locals.user ).then( user => {
        res.send( user );
    }).catch( err => {
        res.send( err );
    })
});


module.exports = router;