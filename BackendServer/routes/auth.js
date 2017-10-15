const express = require( 'express' );
const router = express.Router();
const db = require( '../db' );
const response = require('../responses/responses.js');

/**
 * @api {post} /auth/register Register
 * @apiName Register
 * @apiGroup Authentication
 *
 * @apiParam {String} username
 * @apiParam {String} password
 *
 * @apiError MissingInformation Username or password is missing
 * @apiError UsernameTaken There is already an account with the supplied username.
 * @apiErrorExample {json} Error-Response:
 *     {
 *       "err": "UsernameTaken",
 *       "msg": ""
 *     }
 */
router.post( '/register',
    function( req, res ) {
        let username = req.body.username;
        if( !username ){
            res.send( response.errorMessage( "MissingInformation" )  )
        }
        db.users.authByUsername( username, ( err, user ) => {
            if ( err ) {
                res.send( { "err": err.message } );
            } else if ( user ) {
                res.send( response.errorMessage( "UsernameTaken" ) );
            } else if ( !( username && req.body.password ) ){
                res.send( response.errorMessage( "MissingInformation" ) );
            } else {
                let userInfo = {
                    username: username,
                    password: req.body.password
                };
                db.users.addNewUser( userInfo, ( err, data ) => {
                    if ( err ) {
                        res.send( response.errorMessage( err ) );
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
 *       "err": "InvalidLogin",
 *       "msg": ""
 *     }
 */
router.post( '/login',
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
 */
router.get( '/logout', ( req, res ) => {
        req.logout();
        res.redirect( '/' );
    }
);

module.exports = router;