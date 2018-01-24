const express = require( 'express' );
const router = express.Router();
const jobSearch = require("../search/jobs.js");
const companySearch = require("../search/companies.js");
const response = require('../responses/responses.js');
const consts = require( "../constants" );

const SEARCH_TYPE_LOCATION = "location";
const SEARCH_TYPE_ZIP = "zip";
const SEARCH_TYPE_COORDS = "coordinates";

/**
 * @api {get} /jobs Jobs Search
 * @apiName JobsSearch
 * @apiGroup Jobs
 * @apiDescription Get jobs by supplied city-state, zip, or coordinates.
 *
 * NOTE: The returned array may contain an object with null lat/long for jobs that do not
 * have location information.
 *
 * @apiHeader {String} authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *      {
 *          authorization: Bearer QZ3jhbfdof84GFBlSe
 *      }
 *
 * @apiExample Example-Request(s)
 *      path-to-topia-api.com/jobs?type=location&city=Denver&state=CO&limit=500
 *      path-to-topia-api.com/jobs?type=zip&zip=07853&limit=500
 *      path-to-topia-api.com/jobs?type=coordinates&lat=32.959613&long=-117.157757&limit=500
 *
 * @apiParam {String="location","zip","coordinates"} type Type of search to perform.
 * @apiParam {String} city City to search. Req with location type.
 * @apiParam {String} state State to search. (2 letter abbreviation). Req with location type.
 * @apiParam {String} zip Zip code. Req with zip type.
 * @apiParam {String} lat Latitude. Req with coordinate type.
 * @apiParam {String} long Longitude. Req with coordinate type.
 * @apiParam {Number} limit Max number of results.
 * @apiParam {Number} [radius=25] Radius from city center to search for jobs.
 *
 * @apiSuccessExample {json} Success-Response:
 *  [
 *     {
        "latitude": null,
        "longitude": null,
        "jobs": [...]
    },
 *     {
        "latitude": 33.277313,
        "longitude": -111.88746,
        "jobs": [
            {
                "jobtitle": "Building Maintenance Engineer - First Shift",
                "company": "CBRE",
                "city": "Chandler",
                "state": "AZ",
                "country": "US",
                "language": "en",
                "formattedLocation": "Chandler, AZ",
                "source": "CBRE",
                "date": "Thu, 21 Dec 2017 05:30:22 GMT",
                "snippet": "Contracted work includes landscaping, snow removal, remodeling, HVAC, plumbers, and cleaning. Utilizes advanced skills to perform complex preventive maintenance...",
                "url": "http://www.indeed.com/viewjob?jk=53091387dd962a7d&qd=AHBv2aSOJz5QeLJ8HScbwNK2-_Y-B8Po8Ndci7Xy1gTc4blc9F2b1BPLA4kjCLtKl3e9F4vXNREZjAdV6uZz_x6nojn63AzuMLy1372sZMY&indpubnum=7658403343281086&atk=1c3oke17u19s92t9",
                "onmousedown": "indeed_clk(this,'1580');",
                "latitude": 33.277313,
                "longitude": -111.88746,
                "jobkey": "53091387dd962a7d",
                "sponsored": false,
                "expired": false,
                "indeedApply": false,
                "formattedLocationFull": "Chandler, AZ 85286",
                "formattedRelativeTime": "23 days ago",
                "stations": ""
            },
            ...
        ]
      },
 *     ...
 *  ]
 *
 * @apiError InvalidSearchType Search type is missing from the query.
 * @apiError MissingLocation City or state missing from query.
 * @apiError NoJobDate No max job age was found on db for this user.
 * @apiError NoJobTypes No job types were found on db for this user.
 * @apiError TokenNotFound Bearer token not found in header.
 * @apiError TokenMismatch Bearer token does not match.
 * @apiError TokenExpired Bearer token is expired.
 * @apiErrorExample {json} Error-Response:
 *     {
 *       "err": "MissingLocation"
 *     }
 */
router.get( '/',
    ( req, res ) => {
        // Switch between valid search types.
        switch(req.query.type){
            case SEARCH_TYPE_LOCATION:
                jobSearch.getJobsByCityState(
                    res.locals.user,
                    req.query.city,
                    req.query.state,
                    req.query.limit,
                    req.query.radius
                ).then( jobResults => {
                    res.send( jobResults );
                }).catch( err => {
                    res.send( response.errorMessage( err ) );
                });
                break;
            case SEARCH_TYPE_ZIP:
                jobSearch.getJobsByZip(
                    res.locals.user,
                    req.query.zip,
                    req.query.limit,
                    req.query.radius
                ).then( jobResults => {
                    res.send( jobResults );
                }).catch( err => {
                    res.send( response.errorMessage( err ) );
                });
                break;
            case SEARCH_TYPE_COORDS:
                jobSearch.getJobsByCoord(
                    res.locals.user,
                    req.query.lat,
                    req.query.long,
                    req.query.limit,
                    req.query.radius
                ).then( jobResults => {
                    res.send( jobResults );
                }).catch( err => {
                    res.send( response.errorMessage( err ) );
                });
                break;
            default:
                res.send( response.errorMessage( "InvalidSearchType" ) );
        }
    }
);

/**
 * @api {get} /jobs/companies/:companyname Company Information
 * @apiName Company
 * @apiGroup Jobs
 * @apiDescription Get company information for a job.
 *
 * @apiHeader {String} authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *      {
 *          authorization: Bearer QZ3jhbfdof84GFBlSe
 *      }
 *
 * @apiExample Example-Request(s)
 *      path-to-topia-api.com/jobs/companies/viasat
 *
 * @apiParam {String} companyname Name of company to get information on.
 * @apiSuccessExample {json} Success-Response:
 *
 *{
 *    "id": 3520,
 *    "name": "Mazda",
 *    "website": "www.mazda.com",
 *    "isEEP": false,
 *    "exactMatch": true,
 *    "industry": "Transportation Equipment Manufacturing",
 *    "numberOfRatings": 45,
 *    "squareLogo": "https://media.glassdoor.com/sqll/3520/mazda-squarelogo.png",
 *    "overallRating": "3.5",
 *    "ratingDescription": "Satisfied",
 *    "cultureAndValuesRating": "3.2",
 *    "seniorLeadershipRating": "3.0",
 *    "compensationAndBenefitsRating": "3.2",
 *    "careerOpportunitiesRating": "2.9",
 *    "workLifeBalanceRating": "3.3",
 *    "recommendToFriendRating": 55,
 *    "sectorId": 10015,
 *    "sectorName": "Manufacturing",
 *    "industryId": 200075,
 *    "industryName": "Transportation Equipment Manufacturing",
 *    "ceo": {
 *        "name": "Masamichi Kogai",
 *        "title": "President and CEO",
 *        "numberOfRatings": 8,
 *        "pctApprove": 53,
 *        "pctDisapprove": 47,
 *        "image": {
 *            "src": "https://media.glassdoor.com/people/sqll/3520/mazda-masamichi-kogai.png",
 *            "height": 200,
 *            "width": 200
 *        }
 *    }
 *}
 *
 * @apiError NoCompanyName Company name missing from query.
 * @apiError CompanyNotFound No company information was found for the given company name.
 * @apiError TokenNotFound Bearer token not found in header.
 * @apiError TokenMismatch Bearer token does not match.
 * @apiError TokenExpired Bearer token is expired.
 * @apiErrorExample {json} Error-Response:
 *     {
 *       "err": "CompanyNotFound",
 *       "msg": ""
 *     }
 */
router.get( '/companies/:companyname(*)',
    ( req, res ) => {
        companySearch.getCompanyInfo( req.params.companyname ).then( compResults => {
            res.send( compResults );
        }).catch( err => {
            res.send( response.errorMessage( err ) );
        });
    }
);

/**
 * @api {get} /jobs/:jobkey Job Information
 * @apiName JobByKey
 * @apiGroup Jobs
 * @apiDescription Get job by key
 *
 * @apiHeader {String} authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *      {
 *          authorization: Bearer QZ3jhbfdof84GFBlSe
 *      }
 *
 * @apiExample Example-Request(s)
 *      path-to-topia-api.com/jobs/455ba8b70208e25b
 *
 * @apiParam {String} jobkey Indeed job key
 * @apiSuccessExample {json} Success-Response:
 *
 *      {
 *        "jobtitle": "Graduate SubSystems Engineer",
 *        "company": "ARM",
 *        "city": "Austin",
 *        "state": "TX",
 *        "country": "US",
 *        "language": "en",
 *        "formattedLocation": "Austin, TX",
 *        "source": "ARM",
 *        "date": "Wed, 20 Sep 2017 02:04:17 GMT",
 *        "snippet": "Bachelors or Masters degree in Electrical/Computer Engineering or Computer Science with a 3.5+ GPA. Be motivated to continuously develop skills and accept a variety of responsibilities as part of contributing to the design center’s success. We employ leading-edge modeling, design and verification technologies to design low-power high-performance products....",
 *        "url": "http://www.indeed.com/rc/clk?jk=455ba8b70208e25b&atk=",
 *        "onmousedown": "indeed_clk(this,'');",
 *        "latitude": 30.266483,
 *        "longitude": -97.74176,
 *        "jobkey": "455ba8b70208e25b",
 *        "sponsored": false,
 *        "expired": false,
 *        "indeedApply": false,
 *        "formattedLocationFull": "Austin, TX",
 *        "formattedRelativeTime": "10 days ago",
 *        "stations": "",
 *        "recommendations": []
 *      }
 *
 *
 * @apiError NoJobsKeysFound jobkeys not found in query.
 * @apiError NoJobsFound No jobs found with the given key.
 * @apiError TokenNotFound Bearer token not found in header.
 * @apiError TokenMismatch Bearer token does not match.
 * @apiError TokenExpired Bearer token is expired.
 * @apiErrorExample {json} Error-Response:
 *     {
 *       "err": "NoJobKeyFound",
 *       "msg": ""
 *     }
 */
router.get( '/:jobkey(*)',
    ( req, res ) => {
        jobSearch.getJobByKey( req.params.jobkey ).then( jobResults => {
            res.send( jobResults );
        }).catch( err => {
            res.send( response.errorMessage( err ) );
        });
    }
);

module.exports = router;