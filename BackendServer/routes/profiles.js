const express = require( 'express' );
const router = express.Router();
const DB_PROFILES = require( '../db/users.js' );
const response = require('../responses/responses.js');
const consts = require( "../constants" );
const cityData = require( "../search/cityData" );


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
 * @apiError InvalidKey Invalid key given.
 * @apiError InvalidMode Invalid mode given.
 * @apiError MissingValue No value given.
 * @apiError ModeError Internal error.
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
 * @api {post} /users/modifymulti Modify Multiple
 * @apiName ModifyMultiple
 * @apiGroup Users
 * @apiDescription Modify multiple preferences on users profile.
 *
 * This allows passing in an object containing some keys from a users profile.
 * All keys within the object will overwrite the matching profile key on the database.
 *
 * To remove a key from the database, include it in the object and set it's value to null.
 *
 * NOTE: Entire arrays must be included with this method, as whatever is on the database will
 * be overwritten. See /modify to append or remove from an array value.
 *
 * NOTE: Any timely profile updates will be updated at this point, since there was a profile change.
 *
 * @apiHeader {String} authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *      {
 *          authorization: Bearer QZ3jhbfdof84GFBlSe
 *      }
 *
 * @apiParam {String} username Users login username.
 * @apiParam {String} prefs Object to overwrite user preferences.
 * @apiParamExample {json} Request-Example:
 *      {
 *          "username": "dev",
 *          "prefs": {
  *             "prefs_jobs_titles": ["Software Engineer", "Developer", "Java"],
 *              "prefs_jobs_postedDate": 60
  *          }
 *      }
 *
 * @apiError UserNotFound User information is not in the database.
 * @apiError InvalidKey Invalid key given.
 * @apiError InvalidMode Invalid mode given.
 * @apiError MissingValue No value given.
 * @apiError ModeError Internal error.
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
router.post( '/modifymulti',
    ( req, res ) => {
        let val = req.body.value;
        try {
            val = JSON.parse( val );
        } catch ( err ){} // No error handling needed for this event.
        DB_PROFILES.modifyUserPreferences(
            req.body[consts.PROF_KEYS.USERNAME],
            req.body.prefs
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

/**
 * @api {post} /users/updateratings UpdateRatings
 * @apiName UpdateRatings
 * @apiGroup Users
 * @apiDescription Allows front-end to update city match ratings.
 *
 * @apiHeader {String} authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *      {
 *          authorization: Bearer QZ3jhbfdof84GFBlSe
 *      }
 *
 * @apiParam {String} username Users login username.
 *
 * @apiError TokenNotFound Bearer token not found in header.
 * @apiError TokenMismatch Bearer token does not match.
 * @apiError TokenExpired Bearer token is expired.
 * @apiError NoCitiesInObject Internal error.
 * @apiError RatioError Internal error.
 * @apiError MissingCityData Internal error.
 * @apiError ErrorSettingRatio Internal error.
 * @apiErrorExample {json} Error-Response:
 *     {
 *       "err": {
 *          "type": "TokenNotFound",
 *          "msg": ""
 *       }
 *     }
 */
router.post( '/updateratings',
    ( req, res ) => {

        cityData.updateCityRatings( req.body.username ).then( success => {
            res.send( success );
        }).catch( err => {
            res.send( response.errorMessage( err ) );
        });
    }
);

module.exports = router;