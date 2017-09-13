let express = require( 'express' );
let passport = require( 'passport' );
let router = express.Router();
let db = require( '../db' );
let response = require('../responses');

/**
 * @api {post} /auth/register Register
 * @apiName Register
 * @apiGroup Authentication
 *
 * @apiParam {String} username
 * @apiParam {String} password
 *
 * @apiError UsernameTaken There is already an account with the supplied username.
 * @apiErrorExample {json} Error-Response:
 *     {
 *       "err": "UsernameTaken"
 *     }
 */
router.post( '/register',
    function( req, res ) {
        db.users.findByUsername( req.body.username, ( err, user ) => {
            if ( err ) {
                res.send( { "err": err.message } );
            } else if ( user ) {
                res.send( response.errorMessage( "UsernameTaken" ) );
            } else {
                let userInfo = {
                    username: req.body.username,
                    password: req.body.password
                };
                db.users.addNewUser( userInfo, ( err, data ) => {
                    if ( err ) {
                        res.send( response.errorMessage( err.message ) );
                    } else {
                        res.send( response.empty )
                    }
                });
            }
        });
    }
);

/**
 * @api {post} /auth/login Login
 * @apiName Login
 * @apiGroup Authentication
 *
 * @apiParam {String} username
 * @apiParam {String} password
 *
 * @apiError InvalidLogin Username or password were incorrect.
 * @apiErrorExample {json} Error-Response:
 *     {
 *       "err": "InvalidLogin"
 *     }
 */
router.post( '/login',
    passport.authenticate( 'local', { failureRedirect: '/auth/loginfail' } ),
    ( req, res ) => {
        res.send( response.empty );
    }
);

router.get( '/loginfail',
    ( req, res ) => {
        res.send( response.errorMessage( "InvalidLogin" ) );
    }
);


/**
 * @api {get} /auth/logout/ Logout
 * @apiName Logout
 * @apiGroup Authentication
 *
 * @apiParam {String} user Username to logout.
 */
router.get( '/logout', ( req, res ) => {
        req.logout();
        res.redirect( '/' );
    }
);

module.exports = router;