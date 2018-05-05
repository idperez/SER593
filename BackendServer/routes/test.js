// Test file for development
const express = require( 'express' );
const router = express.Router();
const city = require("../search/cityData");
const jobCache = require( "../data_caching/jobCaching" );


router.get('/cityratings', ( req, res ) => {
    city.updateCityRatings( res.locals.user ).then( user => {
        res.send( user );
    }).catch( err => {
        res.send( err );
    })
});

router.get('/cachejobs', ( req, res ) => {
    jobCache.storeNextJobSet().then( updated => {
        res.send( "Check DB" );
    }).catch( err => res.send( err ) );
});



module.exports = router;