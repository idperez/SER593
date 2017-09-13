let express = require( 'express' );
let passport = require( 'passport' );
let router = express.Router();
let db = require( '../db' );

router.post( '/register',
    function( req, res ) {
        db.users.findByUsername( req.body.username, ( err, user ) => {
            if ( err ) {
                res.send( err );
            } else if ( user ) {
                res.send( "Username already taken." );
            } else {
                let userInfo = {
                    username: req.body.username,
                    password: req.body.password
                };
                db.users.addNewUser( userInfo, ( err, data ) => {
                    if ( err ) {
                        res.send( "Error: " + err );
                    } else {
                        res.send( "Username added." )
                    }
                });
            }
        });
    }
);


router.get( '/loginfail',
    ( req, res ) => {
        res.send( "Login failed." );
    }
);

router.post( '/login',
    passport.authenticate( 'local', { failureRedirect: '/auth/loginfail' } ),
    ( req, res ) => {
        res.send( "Logged in." );
    }
);

router.get( '/logout', ( req, res ) => {
        req.logout();
        res.redirect( '/' );
    }
);

module.exports = router;