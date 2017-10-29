const express = require( 'express' );
const router = express.Router();
const DB_PROFILES = require( '../db/users.js' );
const response = require('../responses/responses.js');
const consts = require( "../constants" );


/**
 * @api {get} /users/profile Profile
 * @apiName Profile
 * @apiGroup Users
 * @apiDescription Get users profile from database.
 *
 * @apiHeader {String} authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *      {
 *          authorization: Bearer QZ3jhbfdof84GFBlSe
 *      }
 *
 * @apiParam {String} username Users login username.
 *
 * @apiError UserNotFound User information is not in the database.
 * @apiError TokenNotFound Bearer token not found in header.
 * @apiError TokenMismatch Bearer token does not match.
 * @apiError TokenExpired Bearer token is expired.
 * @apiErrorExample {json} Error-Response:
 *     {
 *       "err": {
 *          "type": "UserNotFound",
 *          "msg": "Explanation of failure."
 *       }
 *     }
 */
router.get( '/profile',
    ( req, res ) => {
        DB_PROFILES.getUserProfile(
            req.query[consts.PROF_KEYS.USERNAME]
        ).then( profile => {
            res.send( profile );
        }).catch( err => {
            res.send( response.errorMessage( err ) );
        });
    }
);

/**
 * @api {post} /users/modify Modify
 * @apiName Modify
 * @apiGroup Users
 * @apiDescription Modify a preference on users profile.
 *
 * MODES:
 *
 * modify: Modifies an existing non-list value.
 *
 * remove: Removes a key/value pair. If used on an list, the entire list is removed.
 *
 * listappend: Appends a value to an existing list.
 *
 * listremove: Removes a value from an existing list.
 *
 * @apiHeader {String} authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *      {
 *          authorization: Bearer QZ3jhbfdof84GFBlSe
 *      }
 *
 * @apiParam {String} username Users login username.
 * @apiParam {String} key Key to add to users job preferences.
 * @apiParam {String} value Value to assign to the key. (Required for modes: modify, listappend, listremove)
 * @apiParam {String} mode Specify what operation to run. Options: modify, remove, listappend, listremove
 * @apiParamExample {json} Request-Example:
 *     {
 *       "username": "bob",
 *       "key": "prefs_jobs_types",
 *       "value": "fulltime",
 *       "mode": "listappend"
 *     }
 *
 * @apiError UserNotFound User information is not in the database.
 * @apiError TokenNotFound Bearer token not found in header.
 * @apiError TokenMismatch Bearer token does not match.
 * @apiError TokenExpired Bearer token is expired.
 * @apiErrorExample {json} Error-Response:
 *     {
 *       "err": {
 *          "type": "UserNotFound",
 *          "msg": "Explanation of failure."
 *       }
 *     }
 */
router.post( '/modify',
    ( req, res ) => {
        let val = req.body.value;
        try {
            val = JSON.parse( val );
        } catch ( err ){} // No error handling needed for this event.
        DB_PROFILES.modifyUserItem(
            req.body[consts.PROF_KEYS.USERNAME],
            req.body.key,
            val,
            req.body.mode
        ).then( profile => {
            res.send( profile );
        }).catch( err => {
            res.send( response.errorMessage( err ) );
        });
    }
);

/**
 * @api {post} /users/savejob SaveJob
 * @apiName SaveJob
 * @apiGroup Users
 * @apiDescription Add a saved job to the users profile.
 *
 * @apiHeader {String} authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *      {
 *          authorization: Bearer QZ3jhbfdof84GFBlSe
 *      }
 *
 * @apiParam {String} username Users login username.
 * @apiParam {String} jobkey Indeed job key.
 *
 * @apiError JobAlreadySaved Job is already saved on the users profile.
 * @apiError NoJobsKeysFound jobkey not found in query.
 * @apiError NoJobsFound No jobs found with the given key(s).
 * @apiError TokenNotFound Bearer token not found in header.
 * @apiError TokenMismatch Bearer token does not match.
 * @apiError TokenExpired Bearer token is expired.
 * @apiErrorExample {json} Error-Response:
 *     {
 *       "err": {
 *          "type": "TokenNotFound",
 *          "msg": ""
 *       }
 *     }
 */
router.post( '/savejob',
    ( req, res ) => {

        DB_PROFILES.addSavedJob( req.body.username, req.body.jobkey ).then( success => {
           res.send( success );
        }).catch( err => {
           res.send( response.errorMessage( err ) );
        });
    }
);

/**
 * @api {post} /users/removejob RemoveJob
 * @apiName RemoveJob
 * @apiGroup Users
 * @apiDescription Remove a saved job from the users profile.
 *
 * @apiHeader {String} authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *      {
 *          authorization: Bearer QZ3jhbfdof84GFBlSe
 *      }
 *
 * @apiParam {String} username Users login username.
 * @apiParam {String} jobkey Indeed job key.
 *
 * @apiError SavedJobNotFound Job is not saved on users profile.
 * @apiError TokenNotFound Bearer token not found in header.
 * @apiError TokenMismatch Bearer token does not match.
 * @apiError TokenExpired Bearer token is expired.
 * @apiErrorExample {json} Error-Response:
 *     {
 *       "err": {
 *          "type": "TokenNotFound",
 *          "msg": ""
 *       }
 *     }
 */
router.post( '/removejob',
    ( req, res ) => {

        DB_PROFILES.removeSavedJob( req.body.username, req.body.jobkey ).then( success => {
            res.send( success );
        }).catch( err => {
            res.send( response.errorMessage( err ) );
        });
    }
);

module.exports = router;