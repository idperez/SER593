const express = require( 'express' );
const router = express.Router();
const DB_PROFILES = require( '../db/databaseUsers.js' );
const response = require('../responses/responses.js');
const consts = require( "../constants" );
const cityData = require( "../search/cityData" );

const MODIFY_TYPE_SINGLE = "single";
const MODIFY_TYPE_MULTIPLE = "multiple";
const JOB_TYPE_ADD = "add";
const JOB_TYPE_REMOVE = "remove";

/**
 * @api {get} /users/profile Get Profile
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
 * @apiExample Example-Request(s)
 *      path-to-topia-api.com/users/profile
 *      path-to-topia-api.com/users/profile?cityarray=true
 *
 * @apiParam {Boolean} [cityarray=false] Optional - Return city match results as a sorted array by match percentage.
 * @apiParamExample {json} Request-Example:
 *     {
 *       "cityarray": true
 *     }
 *
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
        let useCityArray = req.query.cityarray;
        let profile = DB_PROFILES.filterProfile( res.locals.user );

        if( useCityArray && useCityArray === "true" ) {
            profile[consts.PROF_KEYS.CITY_MATCH] = DB_PROFILES.cityMatchToArray( profile[consts.PROF_KEYS.CITY_MATCH] );
        }

        res.send( profile );
    }
);

/**
 * @api {post} /users/profile Modify Profile
 * @apiName Modify
 * @apiGroup Users
 * @apiDescription Modify preference(s) on users profile.
 *
 * TYPES:
 *
 * Single: Make a change to a single profile value.
 *
 * Multiple: Send a JSON representation of all the values to be overwritten in the profile.
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
 * PROFILE ITEMS:
 *
 * email: String
 *
 * prefs_jobs_postedDate: Number
 *
 * prefs_jobs_saved: String[]
 *
 * prefs_jobs_titles: String[]
 *
 * prefs_jobs_types: String[]{"fulltime", "parttime", "contract", "internship", "temporary"}
 *
 * prefs_house_beds: Number
 *
 * prefs_house_baths: Number
 *
 * @apiHeader {String} authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *      {
 *          authorization: Bearer QZ3jhbfdof84GFBlSe
 *      }
 *
 * @apiExample Example-Request(s)
 *      path-to-topia-api.com/users/profile
 *
 * @apiParam {String="single","multiple"} type Type of profile change to make.
 * @apiParam {String="modify","remove","listappend","listremove"} mode Specify what operation to run. Req with type of single.
 * @apiParam {String} key Key to add to users job preferences.
 * @apiParam {String} value Value to assign to the key. (Required for modes: modify, listappend, listremove). Req with type of single.
 * @apiParamExample {json} Single Example:
 *     {
 *       "key": "prefs_jobs_types",
 *       "value": "fulltime",
 *       "mode": "listappend",
 *       "type": "single"
 *     }
 * @apiParam {Object} prefs Object to overwrite user preferences. Req with type of multiple.
 * @apiParamExample {json} Multiple Example:
 *      {
 *         "prefs": {
 *              "prefs_jobs_titles": ["Software Engineer", "Developer", "Java"],
 *              "prefs_jobs_postedDate": 60
 *         },
 *         "type":"multiple"
 *      }
 *
 * @apiError InvalidModifyType Modify type is missing from the query.
 * @apiError UserNotFound User information is not in the database.
 * @apiError InvalidKey Invalid key given, either missing from body or not found on the database.
 * @apiError InvalidMode Invalid mode given.
 * @apiError ElemNotFound Element not found in list.
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
router.post( '/profile',
    ( req, res ) => {

        switch(req.body.type){
            case MODIFY_TYPE_SINGLE:
                let val = req.body.value;
                try {
                    val = JSON.parse( val );
                } catch ( err ){} // No error handling needed for this event.
                DB_PROFILES.modifyUserItemEndpoint(
                    res.locals.user,
                    req.body.key,
                    val,
                    req.body.mode
                ).then( data => {
                    res.send( data );
                }).catch( err => {
                    res.send( response.errorMessage( err ) );
                });
                break;
            case MODIFY_TYPE_MULTIPLE:
                DB_PROFILES.modifyUserPreferences(
                    res.locals.user,
                    req.body.prefs
                ).then( data => {
                    res.send( data );
                }).catch( err => {
                    res.send( response.errorMessage( err ) );
                });
                break;
            default:
                res.send( response.errorMessage( "InvalidModifyType" ) );
        }
    }
);

/**
 * @api {post} /profile/jobs Save or Remove Jobs
 * @apiName SaveJob
 * @apiGroup Users
 * @apiDescription Add/remove a saved job to/from the users profile.
 *
 * @apiHeader {String} authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *      {
 *          authorization: Bearer QZ3jhbfdof84GFBlSe
 *      }
 *
 * @apiExample Example-Request(s)
 *      path-to-topia-api.com/users/profile/jobs
 *
 * @apiParam {String} jobkey Indeed job key.
 * @apiParam {String="add","remove"} Operation to add or remove a job to/from the users profile.
 * @apiParamExample {json} Example:
 *     {
 *       "jobkey": "53091387dd962a7d",
 *       "operation": "add"
 *     }
 *
 * @apiError InvalidJobsType Jobs operation type is missing from the query.
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

router.post( '/profile/jobs',
    ( req, res ) => {

        switch( req.body.type ) {
            case JOB_TYPE_ADD:
                DB_PROFILES.addSavedJob( res.locals.user, req.body.jobkey ).then( success => {
                    res.send( success );
                } ).catch( err => {
                    res.send( response.errorMessage( err ) );
                } );
                break;
            case JOB_TYPE_REMOVE:
                DB_PROFILES.removeSavedJob( res.locals.user, req.body.jobkey ).then( success => {
                    res.send( success );
                }).catch( err => {
                    res.send( response.errorMessage( err ) );
                });
                break;
            default:
                res.send( response.errorMessage( "InvalidJobsType" ) );
        }
    }
);

/**
 * @api {post} /users/profile/ratings Update Ratings
 * @apiName UpdateRatings
 * @apiGroup Users
 * @apiDescription Allows front-end to update city match ratings for the current user.
 *
 * @apiHeader {String} authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *      {
 *          authorization: Bearer QZ3jhbfdof84GFBlSe
 *      }
 *
 * @apiExample Example-Request(s)
 *      path-to-topia-api.com/users/profile/ratings
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
router.post( '/profile/ratings',
    ( req, res ) => {

        cityData.updateCityRatings( res.locals.user ).then( success => {
            res.send( success );
        }).catch( err => {
            res.send( response.errorMessage( err ) );
        });
    }
);

module.exports = router;