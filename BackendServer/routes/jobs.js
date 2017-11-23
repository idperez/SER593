const express = require( 'express' );
const router = express.Router();
const jobSearch = require("../search/jobs.js");
const companySearch = require("../search/companies.js");
const response = require('../responses/responses.js');
const consts = require( "../constants" );

/**
 * @api {get} /search/jobs/location JobsByLocation
 * @apiName JobsByLocation
 * @apiGroup Jobs
 * @apiDescription Get jobs by supplied city and state and user preferences.
 *
 * @apiHeader {String} authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *      {
 *          authorization: Bearer QZ3jhbfdof84GFBlSe
 *      }
 *
 * @apiParam {String} city City to search.
 * @apiParam {String} state State to search. (2 letter abbreviation)
 * @apiParam {Number} limit Max number of results.
 * @apiParam {Number} radius from city center to get results (Optional: default is 25).
 *
 * @apiSuccessExample {json} Success-Response:
 *  [
 *    {
 *      "jobtitle": "Senior Software Developer",
 *      "company": "IBM",
 *      "city": "Austin",
 *      "state": "TX",
 *      "country": "US",
 *      "language": "en",
 *      "formattedLocation": "Austin, TX",
 *      "source": "IBM",
 *      "date": "Fri, 08 Sep 2017 03:01:34 GMT",
 *      "snippet": "We are looking for <b>Software</b> Developers to join our Cloud Innovation Lab team in Austin, TX . With industry leadership in analytics, security, commerce, and...",
 *      "url": "http://www.indeed.com/viewjob?jk=2fb6f6598eb121bb&qd=AHBv2aSOJz5QeLJ8HScbwBYPiZNGjz23m_pprWrYM6_QIqvTB8w9VPZxJV3B6V4zrh6KYLpBfM79FCbByGe97Rkt9i6ApQ8v0up_BH1c3Wcep6I5-twM7jC8td-9rGTG&indpubnum=7658403343281086&atk=1bra0uipja39cfrp",
 *      "onmousedown": "indeed_clk(this,'5681');",
 *      "latitude": 30.266483,
 *      "longitude": -97.74176,
 *      "jobkey": "2fb6f6598eb121bb",
 *      "sponsored": false,
 *      "expired": false,
 *      "indeedApply": false,
 *      "formattedLocationFull": "Austin, TX",
 *      "formattedRelativeTime": "22 days ago",
 *      "stations": ""
 *     },
 *     ...
 *  ]
 *
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
router.get( '/location',
    ( req, res ) => {
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
    }
);


/**
 * @api {get} /search/jobs/zip JobsByZip
 * @apiName JobsByZip
 * @apiGroup Jobs
 * @apiDescription Get jobs by supplied zip code and user preferences.
 *
 * @apiHeader {String} authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *      {
 *          authorization: Bearer QZ3jhbfdof84GFBlSe
 *      }
 *
 * @apiParam {String} zip Zip code.
 * @apiParam {Number} limit Max number of results.
 * @apiParam {Number} radius Radius in miles (Optional: default is 25).
 *
 * @apiSuccessExample {json} Success-Response:
 *  [
 *    {
 *      "jobtitle": "Senior Software Developer",
 *      "company": "IBM",
 *      "city": "Austin",
 *      "state": "TX",
 *      "country": "US",
 *      "language": "en",
 *      "formattedLocation": "Austin, TX",
 *      "source": "IBM",
 *      "date": "Fri, 08 Sep 2017 03:01:34 GMT",
 *      "snippet": "We are looking for <b>Software</b> Developers to join our Cloud Innovation Lab team in Austin, TX . With industry leadership in analytics, security, commerce, and...",
 *      "url": "http://www.indeed.com/viewjob?jk=2fb6f6598eb121bb&qd=AHBv2aSOJz5QeLJ8HScbwBYPiZNGjz23m_pprWrYM6_QIqvTB8w9VPZxJV3B6V4zrh6KYLpBfM79FCbByGe97Rkt9i6ApQ8v0up_BH1c3Wcep6I5-twM7jC8td-9rGTG&indpubnum=7658403343281086&atk=1bra0uipja39cfrp",
 *      "onmousedown": "indeed_clk(this,'5681');",
 *      "latitude": 30.266483,
 *      "longitude": -97.74176,
 *      "jobkey": "2fb6f6598eb121bb",
 *      "sponsored": false,
 *      "expired": false,
 *      "indeedApply": false,
 *      "formattedLocationFull": "Austin, TX",
 *      "formattedRelativeTime": "22 days ago",
 *      "stations": ""
 *     },
 *     ...
 *  ]
 *
 * @apiError MissingLocation zip code missing from query.
 * @apiError NoJobDate No max job age was found on db for this user.
 * @apiError NoJobTypes No job types were found on db for this user.
 * @apiError TokenNotFound Bearer token not found in header.
 * @apiError TokenMismatch Bearer token does not match.
 * @apiError TokenExpired Bearer token is expired.
 * @apiErrorExample {json} Error-Response:
 *     {
 *       "err": "MissingLocation",
 *       "msg": ""
 *     }
 */
router.get( '/zip',
    ( req, res ) => {
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
    }
);

/**
 * @api {get} /search/jobs/coords JobsByCoordinates
 * @apiName JobsByCoordinates
 * @apiGroup Jobs
 * @apiDescription Get jobs by supplied coordinates and user preferences.
 *
 * @apiHeader {String} authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *      {
 *          authorization: Bearer QZ3jhbfdof84GFBlSe
 *      }
 *
 * @apiParam {String} lat Latitude
 * @apiParam {String} long Longitude
 * @apiParam {Number} limit Max number of results.
 * @apiParam {String} radius Radius in miles (Optional: default is 25).
 *
 * @apiSuccessExample {json} Success-Response:
 *  [
 *    {
 *      "jobtitle": "Senior Software Developer",
 *      "company": "IBM",
 *      "city": "Austin",
 *      "state": "TX",
 *      "country": "US",
 *      "language": "en",
 *      "formattedLocation": "Austin, TX",
 *      "source": "IBM",
 *      "date": "Fri, 08 Sep 2017 03:01:34 GMT",
 *      "snippet": "We are looking for <b>Software</b> Developers to join our Cloud Innovation Lab team in Austin, TX . With industry leadership in analytics, security, commerce, and...",
 *      "url": "http://www.indeed.com/viewjob?jk=2fb6f6598eb121bb&qd=AHBv2aSOJz5QeLJ8HScbwBYPiZNGjz23m_pprWrYM6_QIqvTB8w9VPZxJV3B6V4zrh6KYLpBfM79FCbByGe97Rkt9i6ApQ8v0up_BH1c3Wcep6I5-twM7jC8td-9rGTG&indpubnum=7658403343281086&atk=1bra0uipja39cfrp",
 *      "onmousedown": "indeed_clk(this,'5681');",
 *      "latitude": 30.266483,
 *      "longitude": -97.74176,
 *      "jobkey": "2fb6f6598eb121bb",
 *      "sponsored": false,
 *      "expired": false,
 *      "indeedApply": false,
 *      "formattedLocationFull": "Austin, TX",
 *      "formattedRelativeTime": "22 days ago",
 *      "stations": ""
 *     },
 *     ...
 *  ]
 *
 * @apiError NoResultsFound No results were returned.
 * @apiError MissingLocation lat/long missing from query.
 * @apiError NoJobDate No max job age was found on db for this user.
 * @apiError NoJobTypes No job types were found on db for this user.
 * @apiError TokenNotFound Bearer token not found in header.
 * @apiError TokenMismatch Bearer token does not match.
 * @apiError TokenExpired Bearer token is expired.
 * @apiErrorExample {json} Error-Response:
 *     {
 *       "err": "MissingLocation",
 *       "msg": ""
 *     }
 */
router.get( '/coords',
    ( req, res ) => {
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
    }
);

/**
 * @api {get} /search/jobs/bykey JobByKey
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
 * @apiParam {String} jobkeys Indeed job key
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
 *      },
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
router.get( '/bykey',
    ( req, res ) => {
        jobSearch.getJobByKey( req.query.jobkeys ).then( jobResults => {
            res.send( jobResults );
        }).catch( err => {
            res.send( response.errorMessage( err ) );
        });
    }
);


/**
 * @api {get} /search/jobs/companyinfo CompanyInfo
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
router.get( '/companyinfo',
    ( req, res ) => {
        companySearch.getCompanyInfo( req.query.companyname ).then( compResults => {
            res.send( compResults );
        }).catch( err => {
            res.send( response.errorMessage( err ) );
        });
    }
);

module.exports = router;