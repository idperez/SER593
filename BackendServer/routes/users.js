const express = require( 'express' );
const router = express.Router();
const DB_PROFILES = require( '../db/databaseUsers.js' );
const response = require('../responses/responses.js');
const consts = require( "../constants" );
const cityData = require( "../search/cityData" );

const MODIFY_TYPE_SINGLE = "single";
const MODIFY_TYPE_MULTIPLE = "multiple";
const SAVE_TYPE_ADD = "add";
const SAVE_TYPE_REMOVE = "remove";
const CITY_RATING_TIMEOUT = 300000; // 5min in ms

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
 * @apiSuccessExample {json} Success-Response:
 *
 * {
    "prefs_jobs_postedDate": 30,
    "last_updated": 1508121556207,
    "prefs_jobs_titles": [
        "software"
    ],
    "cityMatch": {
        "Phoenix": {
            "city": "Phoenix",
            "state": "Arizona",
            "rating": 16,
            "ranking": 21
        },
        "Tucson": {
            "city": "Tucson",
            "state": "Arizona",
            "rating": 14.4,
            "ranking": 22
        },
        "Fresno": {
            "city": "Fresno",
            "state": "California",
            "rating": 4.4,
            "ranking": 33
        },
        "Los Angeles": {
            "city": "Los Angeles",
            "state": "California",
            "rating": 6.5,
            "ranking": 32
        },
        "San Diego": {
            "city": "San Diego",
            "state": "California",
            "rating": 26.4,
            "ranking": 11
        },
        "San Francisco": {
            "city": "San Francisco",
            "state": "California",
            "rating": 100,
            "ranking": 1
        },
        "San Jose": {
            "city": "San Jose",
            "state": "California",
            "rating": 26,
            "ranking": 12
        },
        "Denver": {
            "city": "Denver",
            "state": "Colorado",
            "rating": 50.2,
            "ranking": 6
        },
        "Washington": {
            "city": "Washington",
            "state": "District of Columbia",
            "rating": 85,
            "ranking": 2
        },
        "Jacksonville": {
            "city": "Jacksonville",
            "state": "Florida",
            "rating": 16.3,
            "ranking": 20
        },
        "Chicago": {
            "city": "Chicago",
            "state": "Illinois",
            "rating": 23.6,
            "ranking": 14
        },
        "Indianapolis": {
            "city": "Indianapolis",
            "state": "Indiana",
            "rating": 21.7,
            "ranking": 17
        },
        "Louisville": {
            "city": "Louisville",
            "state": "Kentucky",
            "rating": 14.2,
            "ranking": 23
        },
        "Baltimore": {
            "city": "Baltimore",
            "state": "Maryland",
            "rating": 27.7,
            "ranking": 10
        },
        "Boston": {
            "city": "Boston",
            "state": "Massachusetts",
            "rating": 78,
            "ranking": 3
        },
        "Detroit": {
            "city": "Detroit",
            "state": "Michigan",
            "rating": 12.9,
            "ranking": 25
        },
        "Las Vegas": {
            "city": "Las Vegas",
            "state": "Nevada",
            "rating": 24.6,
            "ranking": 13
        },
        "Albuquerque": {
            "city": "Albuquerque",
            "state": "New Mexico",
            "rating": 12.4,
            "ranking": 27
        },
        "New York": {
            "city": "New York",
            "state": "New York",
            "rating": 8.9,
            "ranking": 31
        },
        "Charlotte": {
            "city": "Charlotte",
            "state": "North Carolina",
            "rating": 30.7,
            "ranking": 8
        },
        "Columbus": {
            "city": "Columbus",
            "state": "Ohio",
            "rating": 22.7,
            "ranking": 15
        },
        "Oklahoma City": {
            "city": "Oklahoma City",
            "state": "Oklahoma",
            "rating": 12,
            "ranking": 28
        },
        "Portland": {
            "city": "Portland",
            "state": "Oregon",
            "rating": 36.2,
            "ranking": 7
        },
        "Philadelphia": {
            "city": "Philadelphia",
            "state": "Pennsylvania",
            "rating": 13.8,
            "ranking": 24
        },
        "Memphis": {
            "city": "Memphis",
            "state": "Tennessee",
            "rating": 9.9,
            "ranking": 30
        },
        "Nashville": {
            "city": "Nashville",
            "state": "Tennessee",
            "rating": 22.1,
            "ranking": 16
        },
        "Austin": {
            "city": "Austin",
            "state": "Texas",
            "rating": 56.5,
            "ranking": 5
        },
        "Dallas": {
            "city": "Dallas",
            "state": "Texas",
            "rating": 30,
            "ranking": 9
        },
        "El Paso": {
            "city": "El Paso",
            "state": "Texas",
            "rating": 0,
            "ranking": 34
        },
        "Fort Worth": {
            "city": "Fort Worth",
            "state": "Texas",
            "rating": 10.5,
            "ranking": 29
        },
        "Houston": {
            "city": "Houston",
            "state": "Texas",
            "rating": 19.7,
            "ranking": 18
        },
        "San Antonio": {
            "city": "San Antonio",
            "state": "Texas",
            "rating": 12.7,
            "ranking": 26
        },
        "Seattle": {
            "city": "Seattle",
            "state": "Washington",
            "rating": 77.9,
            "ranking": 4
        },
        "Milwaukee": {
            "city": "Milwaukee",
            "state": "Wisconsin",
            "rating": 16.9,
            "ranking": 19
        }
    },
    "prefs_jobs_saved": [
        {
            "jobtitle": "Java Software Developer",
            "company": "Charles Schwab",
            "city": "Phoenix",
            "state": "AZ",
            "country": "US",
            "language": "en",
            "formattedLocation": "Phoenix, AZ",
            "source": "Charles Schwab",
            "date": "Wed, 22 Nov 2017 11:16:08 GMT",
            "snippet": "Provide creative technical solutions to new business requirements and partner with the business owners to implement the solution. We believe that , when done right, investing liberates people to create their own destiny. We take our responsibility to support, teach and develop our team very seriously, and we expect you to be driven to learn and grow and continuously contribute to evolving the...",
            "url": "http://www.indeed.com/rc/clk?jk=171ee9e4dd78a457&atk=",
            "onmousedown": "indeed_clk(this,'');",
            "latitude": 33.45055,
            "longitude": -112.06593,
            "jobkey": "171ee9e4dd78a457",
            "sponsored": false,
            "expired": true,
            "indeedApply": false,
            "formattedLocationFull": "Phoenix, AZ 85002",
            "formattedRelativeTime": "30+ days ago",
            "stations": "",
            "recommendations": []
        },
        {
            "jobtitle": "Software Engineer, University Graduate",
            "company": "Google",
            "city": "Seattle",
            "state": "WA",
            "country": "US",
            "language": "en",
            "formattedLocation": "Seattle, WA",
            "source": "Google",
            "date": "Wed, 22 Nov 2017 13:08:55 GMT",
            "snippet": "BA/BS degree in Computer Science or related technical field, or equivalent practical experience. As a software engineer in the Engineering Productivity organization, you'll use your software design, analysis and programming skills to create innovative automated test systems. Whether it's finding new and innovative ways to advance search quality, building computing platform and networking...",
            "url": "http://www.indeed.com/rc/clk?jk=455ba8b70208e25b&atk=",
            "onmousedown": "indeed_clk(this,'');",
            "latitude": 47.604397,
            "longitude": -122.32967,
            "jobkey": "455ba8b70208e25b",
            "sponsored": false,
            "expired": false,
            "indeedApply": false,
            "formattedLocationFull": "Seattle, WA",
            "formattedRelativeTime": "8 days ago",
            "stations": "",
            "recommendations": []
        }
    ],
    "prefs_house_beds": 4,
    "prefs_house_saved": [
        {
            "zip": 77018,
            "Address": "0 Del Norte DriveHouston",
            "fullBaths": 0,
            "geoJson": {
                "type": "POINT",
                "coordinates": [
                    -95.6476462,
                    29.7056313
                ]
            },
            "hashKey": -87,
            "purchaseType": "buy",
            "halfBaths": 0,
            "details_Description": "Small lot , road will be paved in future , good for investors or someone needing extra space for equipment or large items.",
            "state": "TX",
            "beds": 0,
            "city": "Houston",
            "photoLink": "http://img4.homefinder.com/_img_/314480392/1f498f946bd3c5bf09c888defdb21a48bafd9282/200",
            "details_PhotoLinks": [
                "http://img1.homefinder.com/_img_/314480392/7e9aebe974b4d8f88021cdff302cbeb5facc093d/592-",
                "http://img2.homefinder.com/_img_/314480392/1f498f946bd3c5bf09c888defdb21a48bafd9282/592-",
                "http://img3.homefinder.com/_img_/314480392/0014bd94a13ee69ddc6303054b9a6832e5a5cce6/592-",
                "http://img3.homefinder.com/_img_/314480392/248326dfd162e66e5b1881f6f3bd15147081ef2c/592-",
                "http://img3.homefinder.com/_img_/314480392/afe2be477ca522d3efc1bca70c6f47256cec2f5b/592-",
                "http://img5.homefinder.com/_img_/314480392/a2e73746f9fa33b115da0240ac0ede40b8a441af/592-",
                "http://img5.homefinder.com/_img_/314480392/b943cf06f615db93168c3554f1dde3f19b3c7d25/592-",
                "http://img5.homefinder.com/_img_/314480392/caeca3f0e04dd8d5e44b221d685e5314c47a6597/592-"
            ],
            "rangeKey": "0 Del Norte DriveHouston",
            "geohash": -8772767465978812000,
            "detailsLink": "http://www.homefinder.com/TX/Houston/0-Del-Norte-Drive-314480392d",
            "price": 29800,
            "lat": 29.7056313,
            "long": -95.6476462,
            "street": "0 Del Norte Drive"
        }
    ],
    "email": "testEmail@email.com",
    "prefs_things_saved": [
        {
            "id": "oscars-mexican-seafood-san-diego-6",
            "name": "Oscar's Mexican Seafood",
            "image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/YT2brlhILpPZgIlxJEZ9SA/o.jpg",
            "is_claimed": false,
            "is_closed": false,
            "url": "https://www.yelp.com/biz/oscars-mexican-seafood-san-diego-6?adjust_creative=z4rq50TEkyGgxdcoaC1u2g&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_lookup&utm_source=z4rq50TEkyGgxdcoaC1u2g",
            "phone": "+16197983550",
            "display_phone": "(619) 798-3550",
            "review_count": 1256,
            "categories": [
                {
                    "alias": "seafood",
                    "title": "Seafood"
                },
                {
                    "alias": "mexican",
                    "title": "Mexican"
                }
            ],
            "rating": 4,
            "location": {
                "address1": "646 University Ave",
                "address2": "",
                "address3": "",
                "city": "San Diego",
                "zip_code": "92103",
                "country": "US",
                "state": "CA",
                "display_address": [
                    "646 University Ave",
                    "San Diego, CA 92103"
                ],
                "cross_streets": "7th Ave & 6th Ave"
            },
            "coordinates": {
                "latitude": 32.7486014556313,
                "longitude": -117.15913947605
            },
            "photos": [
                "https://s3-media3.fl.yelpcdn.com/bphoto/YT2brlhILpPZgIlxJEZ9SA/o.jpg",
                "https://s3-media4.fl.yelpcdn.com/bphoto/fN791SLP3LI3OfZBXxTE-w/o.jpg",
                "https://s3-media4.fl.yelpcdn.com/bphoto/arNtfTJzLE2Gvril_b9BMQ/o.jpg"
            ],
            "price": "$",
            "hours": [
                {
                    "open": [
                        {
                            "is_overnight": false,
                            "start": "0800",
                            "end": "2100",
                            "day": 0
                        },
                        {
                            "is_overnight": false,
                            "start": "0800",
                            "end": "2100",
                            "day": 1
                        },
                        {
                            "is_overnight": false,
                            "start": "0800",
                            "end": "2100",
                            "day": 2
                        },
                        {
                            "is_overnight": false,
                            "start": "0800",
                            "end": "2100",
                            "day": 3
                        },
                        {
                            "is_overnight": false,
                            "start": "0800",
                            "end": "2200",
                            "day": 4
                        },
                        {
                            "is_overnight": false,
                            "start": "0800",
                            "end": "2200",
                            "day": 5
                        },
                        {
                            "is_overnight": false,
                            "start": "0800",
                            "end": "2100",
                            "day": 6
                        }
                    ],
                    "hours_type": "REGULAR",
                    "is_open_now": true
                }
            ],
            "transactions": [
                "delivery",
                "pickup"
            ]
        }
    ],
    "prefs_house_baths": 3,
    "username": "dev",
    "prefs_house_purchaseType": [
        "buy",
        "rent"
    ],
    "prefs_jobs_types": [
        "fulltime"
    ],
    "prefs_things_titles": [
        "parks",
        "thai"
    ]
}
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
 * prefs_house_purchaseType: String[]{"rent", "buy"}
 *
 * prefs_life_titles: String[]
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
 * @apiParam {String="add","remove"} type Operation to add or remove a job to/from the users profile.
 * @apiParamExample {json} Example:
 *     {
 *       "jobkey": "53091387dd962a7d",
 *       "operation": "add"
 *     }
 *
 * @apiError InvalidSaveType Save operation type is missing from the query.
 * @apiError ItemAlreadySaved Job is already saved on the users profile.
 * @apiError JobNotFound Job not found from job source.
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
            case SAVE_TYPE_ADD:
                DB_PROFILES.addSavedJob(
                    res.locals.user,
                    req.body.jobkey
                ).then( success => {
                    res.send( success );
                } ).catch( err => {
                    res.send( response.errorMessage( err ) );
                } );
                break;
            case SAVE_TYPE_REMOVE:
                DB_PROFILES.removeSavedItem(
                    res.locals.user,
                    consts.PROF_KEYS.PREFS_JOBS_SAVED,
                    req.body.jobkey
                ).then( success => {
                    res.send( success );
                }).catch( err => {
                    res.send( response.errorMessage( err ) );
                });
                break;
            default:
                res.send( response.errorMessage( "InvalidSaveType" ) );
        }
    }
);

/**
 * @api {post} /profile/houses Save or Remove Houses
 * @apiName SaveHouse
 * @apiGroup Users
 * @apiDescription Add/remove a saved house to/from the users profile.
 *
 * @apiHeader {String} authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *      {
 *          authorization: Bearer QZ3jhbfdof84GFBlSe
 *      }
 *
 * @apiExample Example-Request(s)
 *      path-to-topia-api.com/users/profile/houses
 *
 * @apiParam {String} rangekey House range key.
 * @apiParam {String="add","remove"} type Operation to add or remove a house to/from the users profile.
 * @apiParamExample {json} Example:
 *     {
 *       "rangeKey": "0 Del Norte DriveHouston",
 *       "operation": "add"
 *     }
 *
 * @apiError InvalidSaveType Save operation type is missing from the query.
 * @apiError HouseAlreadySaved House is already saved on the users profile.
 * @apiError MissingRangeKey rangeKey not found in query.
 * @apiError NoResultsFound No house found with the given range key.
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

router.post( '/profile/houses',
    ( req, res ) => {

        switch( req.body.type ) {
            case SAVE_TYPE_ADD:
                DB_PROFILES.addSavedHouse(
                    res.locals.user, req.body.rangekey
                ).then( done => {
                    res.send( done );
                }).catch( err => {
                    res.send( response.errorMessage( err ) );
                });
                break;
            case SAVE_TYPE_REMOVE:
                DB_PROFILES.removeSavedHouse(
                    res.locals.user, req.body.rangekey
                ).then( done => {
                    res.send( done );
                }).catch( err => {
                    res.send( response.errorMessage( err ) );
                });
                break;
            default:
                res.send( response.errorMessage( "InvalidSaveType" ) );
        }
    }
);


/**
 * @api {post} /profile/things Save or Remove Things
 * @apiName SaveThing
 * @apiGroup Users
 * @apiDescription Add/remove a saved thing to do to/from the users profile.
 *
 * @apiHeader {String} authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *      {
 *          authorization: Bearer QZ3jhbfdof84GFBlSe
 *      }
 *
 * @apiExample Example-Request(s)
 *      path-to-topia-api.com/users/profile/things
 *
 * @apiParam {String} id Business id.
 * @apiParam {String="add","remove"} type Operation to add or remove a thing to/from the users profile.
 * @apiParamExample {json} Example:
 *     {
 *       "id": "oscars-mexican-seafood-san-diego-6",
 *       "operation": "add"
 *     }
 *
 * @apiError InvalidSaveType Save operation type is missing from the query.
 * @apiError ItemAlreadySaved Item is already saved on the users profile.
 * @apiError InvalidTable Internal error.
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
router.post( '/profile/things',
    ( req, res ) => {
        switch( req.body.type ) {
            case SAVE_TYPE_ADD:
                DB_PROFILES.addSavedThingToDo(
                    res.locals.user,
                    req.body.id
                ).then( success => {
                    res.send( success );
                } ).catch( err => {
                    res.send( response.errorMessage( err ) );
                } );
                break;
            case SAVE_TYPE_REMOVE:
                DB_PROFILES.removeSavedItem(
                    res.locals.user,
                    consts.PROF_KEYS.PREFS_THINGS_SAVED,
                    req.body.id
                ).then( success => {
                    res.send( success );
                }).catch( err => {
                    res.send( response.errorMessage( err ) );
                });
                break;
            default:
                res.send( response.errorMessage( "InvalidSaveType" ) );
        }
    }
);

/**
 * @api {post} /users/profile/ratings Update Ratings
 * @apiName UpdateRatings
 * @apiGroup Users
 * @apiDescription Allows front-end to update city match ratings for the current user.
 *
 * Note: Update is not immediate.
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
 * @apiError CityMatchFailed Internal error. See console logs.
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
        // City rating does job and house searches on every single city, which takes lots of time.
        // This keeps the connection open longer.
        res.connection.setTimeout( CITY_RATING_TIMEOUT );
        cityData.updateCityRatings( res.locals.user ).then( success => {
            console.log( "City match successfully updated for " + res.locals.user[consts.PROF_KEYS.USERNAME] );
        }).catch( err => {
            res.send( response.errorMessage(
                {
                    code: "CityMatchFailed",
                    msg: "City match failed for " + res.locals.user[consts.PROF_KEYS.USERNAME] + ": " + err
                }
            ));
        });
        res.send({});
    }
);

module.exports = router;