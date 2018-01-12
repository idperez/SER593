const express = require( 'express' );
const router = express.Router();
const response = require('../responses/responses.js');
const auth = require( '../auth/passGrant' );
const consts = require( "../constants" );

/**
 * @api {post} /auth/register Register
 * @apiName Register
 * @apiGroup Authentication
 *
 * @apiExample Example-Request(s)
 *      path-to-topia-api.com/auth/register
 *
 * @apiParam {String} username
 * @apiParam {String} password
 * @apiParam {String} email
 * @apiParamExample {json} Example:
 *     {
 *       "username": "freddy123",
 *       "password": "pw123456",
 *       "email": "freddy123@gmail.com"
 *     }
 *
 * @apiError MissingInformation Username or password is missing
 * @apiError UsernameTaken There is already an account with the supplied username.
 * @apiError ErrorGettingProfile Cannot find profile associated with username during authentication.
 * @apiErrorExample {json} Error-Response:
 *     {
 *       "err": "UsernameTaken",
 *       "msg": ""
 *     }
 *
 * @apiSuccess {json} token Access token assigned to user.
 * @apiSuccessExample {json} Success-Response:
 *     {
 *       "token": "QZ3jhbfdof84GFBlSe"
 *     }
 *
 */
router.post( '/register', ( req, res ) => {
        auth.register(
            req.body[consts.PROF_KEYS.USERNAME],
            req.body[consts.PROF_KEYS.PASSWORD],
            req.body[consts.PROF_KEYS.EMAIL]
        ).then( accessToken => {
            res.send(  { token: accessToken } );
        }).catch( err => {
            res.send( response.errorMessage( err ) );
        });
    }
);

/**
 * @api {post} /auth/login Login
 * @apiName Login
 * @apiGroup Authentication
 *
 * @apiExample Example-Request(s)
 *      path-to-topia-api.com/auth/login
 *
 * @apiParam {String} username
 * @apiParam {String} password
 * @apiParamExample {json} Example:
 *     {
 *       "username": "freddy123",
 *       "password": "pw123456"
 *     }
 *
 * @apiError ErrorGettingProfile Cannot find profile associated with username during authentication.
 * @apiError PasswordMismatch Password was incorrect.
 * @apiErrorExample {json} Error-Response:
 *     {
 *       "err": "PasswordMismatch",
 *       "msg": ""
 *     }
 *
 * @apiSuccess {json} token Access token assigned to user.
 * @apiSuccessExample {json} Success-Response:
 *     {
 *       "token": "QZ3jhbfdof84GFBlSe"
 *     }
 *
 */
router.post( '/login', ( req, res ) => {
        auth.authenticate(
            req.body[consts.PROF_KEYS.USERNAME],
            req.body[consts.PROF_KEYS.PASSWORD]
        ).then( accessToken => {
            res.send( { token: accessToken } );
        }).catch( err => {
            res.send( response.errorMessage(err) );
        });
    }
);

/**
 * @api {post} /auth/logout/ Logout
 * @apiName Logout
 * @apiGroup Authentication
 *
 * @apiHeader {String} authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *      {
 *          authorization: Bearer QZ3jhbfdof84GFBlSe
 *      }
 *
 * @apiExample Example-Request(s)
 *      path-to-topia-api.com/auth/logout
 *
 * @apiError TokenNotFound Bearer token not found in header.
 * @apiError TokenMismatch Bearer token does not match.
 * @apiError TokenExpired Bearer token is expired.
 * @apiErrorExample {json} Error-Response:
 *     {
 *       "err": "TokenNotFound",
 *       "msg": ""
 *     }
 */
router.post( '/logout', ( req, res ) => {
        auth.revokeToken( res.locals.user ).then( ( data ) => {
            res.send( data );
        }).catch( err => {
            res.send( response.errorMessage( err ) );
        });
    }
);

module.exports = router;