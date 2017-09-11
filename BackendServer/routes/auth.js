var express = require( 'express' );
var passport = require( 'passport' );
var router = express.Router();
var db = require( '../db' );

router.post( '/register',
    function( req, res ) {
        db.users.findByUsername( req.body.username, function ( err, user ) {
            if ( err ) {
                res.send( err );
            } else if ( user ) {
                res.send( "Username already taken." );
            } else {
                var userInfo = {
                    username: req.body.username,
                    password: req.body.password
                };
                db.users.addNewUser( userInfo, function( err, data ){
                    if ( err ) {
                        res.send( "Error: " + err );
                    } else {
                        res.send( "Username added." )
                    }
                });
            }
        });
    });


router.get( '/loginfail',
    function( req, res ) {
        res.send( "Login failed." );
    });

router.post( '/login',
    passport.authenticate( 'local', { failureRedirect: '/auth/loginfail' } ),
    function( req, res ) {
        res.send( "Logged in." );
    });

router.get( '/logout',
    function( req, res ){
        req.logout();
        res.redirect( '/' );
    });

module.exports = router;