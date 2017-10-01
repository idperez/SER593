const express = require( 'express' );
const router = express.Router();
const DB_PROFILES = require( '../db/users.js' );
const response = require('../responses/responses.js');

/**
 * @api {get} /profile Profile
 * @apiName Profile
 * @apiGroup Users
 * @apiDescription Get users profile from database.
 *
 * @apiParam {String} username Users login username.
 *
 * @apiError UserNotFound User information is not in the database.
 * @apiErrorExample {json} Error-Response:
 *     {
 *       "err": {
 *          "type": "UserNotFound",
 *          "msg": "Explanation of failure."
 *       }
 *     }
 */
router.get( '/',
    ( req, res ) => {
        DB_PROFILES.getUserProfile( req.query.username ).then( profile => {
            res.send( profile );
        }).catch( err => {
            res.send( response.errorMessage( err ) );
        });
    }
);

/**
 * @api {post} /profile/addjobpref AddJobPref
 * @apiName AddJobPref
 * @apiGroup Users
 * @apiDescription Add or update job preference on users profile.
 *
 * @apiParam {String} username Users login username.
 * @apiParam {String} key Key to add to users job preferences.
 * @apiParam {String} value Value to assign to the key.
 *
 * @apiError UserNotFound User information is not in the database.
 * @apiErrorExample {json} Error-Response:
 *     {
 *       "err": {
 *          "type": "UserNotFound",
 *          "msg": "Explanation of failure."
 *       }
 *     }
 */
router.post( '/addjobpref',
    ( req, res ) => {
        let val = req.body.value;
        try {
            val = JSON.parse( val );
        } catch ( err ){} // No error handling needed for this event.
        DB_PROFILES.addUserItem( req.body.username, req.body.key, val ).then( profile => {
            res.send( profile );
        }).catch( err => {
            res.send( response.errorMessage( err ) );
        });
    }
);

module.exports = router;