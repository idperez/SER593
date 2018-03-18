const express = require( 'express' );
const router = express.Router();
const scrape = require( '../scrape/housing' );
const tr = require('tor-request');
const resMsg = require('../responses/responses.js');
const consts = require( "../constants" );
const qs = require( 'querystring' );
const housing = require( "../search/housing" );


/**
 * @api {get} /housing House Search
 * @apiName HouseSearch
 * @apiGroup Housing
 * @apiDescription Get list of houses by coordinates and a range.
 *
 * @apiHeader {String} authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *      {
 *          authorization: Bearer QZ3jhbfdof84GFBlSe
 *      }
 *
 * @apiExample Example-Request(s)
 *      path-to-topia-api.com/housing?long=-95.26405559&lat=29.8569348&radius=20
 *
 * @apiParam {String} lat Latitude
 * @apiParam {String} long Longitude
 * @apiParam {Number} [radius=25] Radius in miles to search for houses.
 *
 * @apiSuccessExample {json} Success-Response:
 [
     {
         "street": "6008 Bonn Echo Lane",
         "city": "Houston",
         "state": "TX",
         "zip": "77017",
         "photoLink": "http://img5.homefinder.com/_img_/314473599/88ae472e9230f5d1a3e0572af7384ed5411b2f03/200",
         "detailsLink": "http://www.homefinder.com/TX/Houston/6008-Bonn-Echo-Lane-314473599d",
         "price": "359900",
         "type": "Single Family Home",
         "fullBaths": 3,
         "halfBaths": 2,
         "beds": 4,
         "lat": 29.6728489,
         "long": -95.25548739999999,
         "rangeKey": "6008 Bonn Echo LaneHouston"
     },
     ...
 ]
 *
 * @apiError MissingCoordinates lat or long are missing.
 * @apiError TokenNotFound Bearer token not found in header.
 * @apiError TokenMismatch Bearer token does not match.
 * @apiError TokenExpired Bearer token is expired.
 * @apiErrorExample {json} Error-Response:
 *     {
 *       "err": "MissingCoordinates"
 *     }
 */
router.get( '/',
    ( req, res ) => {

        let lat = req.query.lat;
        let long = req.query.long;
        let radiusInMiles = req.query.radius;

        if( lat && long ) {
            housing.getHousingByCoordinates(
                res.locals.user,
                lat,
                long,
                radiusInMiles
            ).then( data => {
                res.send( data );
            } ).catch( err => {
                res.send( err );
            } );
        } else {
            res.send( resMsg.errorMessage( "MissingCoordinates" ) )
        }

    }
);

/**
 * @api {get} /housing/details/:rangekey House Details
 * @apiName HouseDetails
 * @apiGroup Housing
 * @apiDescription Get more details about a specific house.
 *
 * @apiHeader {String} authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *      {
 *          authorization: Bearer QZ3jhbfdof84GFBlSe
 *      }
 *
 * @apiExample Example-Request(s)
 *      path-to-topia-api.com/housing/details/0 CaddoHouston
 *      path-to-topia-api.com/housing/details/1022 E MONTOYA LanePhoenix
 *
 * @apiParam {String} rangekey The range key supplied by housing search.
 * @apiSuccessExample {json} Success-Response:
 *
 {
     "Address": "1022 E MONTOYA LanePhoenix",
     "street": "1022 E MONTOYA Lane",
     "city": "Phoenix",
     "state": "AZ",
     "zip": 85024,
     "type": "Single Family Home",
     "fullBaths": 2,
     "halfBaths": 0,
     "beds": 3,
     "detailsLink": "http://www.homefinder.com/AZ/Phoenix/1022-E-MONTOYA-Lane-314518307d",
     "photoLink": "http://img4.homefinder.com/_img_/314518307/b4630c5f6a7493fe95365af3997afa22e90e15a9/200",
     "lat": 33.6723684,
     "long": -112.0584192,
     "purchaseType": "buy",
     "price": 310000,
     "details_Description": "Natural light, fresh interior paint, and new carpet are a few of our favorite features at this single-story Phoenix home. Step inside and discover vaulted ceilings and a Great room. The open kitchen features a breakfast bar and overlooks the fireplace in the Living room. Travel through the back door and check out the covered patio and pool.All Opendoor homes come with a 30-day satisfaction guarantee. Terms and conditions apply.",
     "details_PhotoLinks": [
         "http://img1.homefinder.com/_img_/314518307/5aad30deef7b935dbc3fe5a29baf20e1de5e5ad0/592-",
         "http://img1.homefinder.com/_img_/314518307/84d0380e8cc92a9d61f1c0e711939ee2912ff313/592-",
         "http://img1.homefinder.com/_img_/314518307/a4c5c573abec47204bcf9797298c731f42794683/592-",
         "http://img1.homefinder.com/_img_/314518307/b000d8e7092580aff054272b0fcf5035b6e262dc/592-"
     ],
     "rangeKey": "1022 E MONTOYA LanePhoenix",
     "zillowID": "50181931",
     "valLow": 291868,
     "valHigh": 322590,
     "yearBuilt": "1998",
     "houseSize": 1755,
     "lotSize": 6688
 }
 *
 *
 * @apiError MissingRangeKey No range key found in request.
 * @apiError InvalidHouse Internal error getting house information from DB.
 * @apiError TokenNotFound Bearer token not found in header.
 * @apiError TokenMismatch Bearer token does not match.
 * @apiError TokenExpired Bearer token is expired.
 * @apiErrorExample {json} Error-Response:
 *     {
 *       "err": "MissingRangeKey",
 *       "msg": ""
 *     }
 */
router.get( '/details/:rangekey(*)',
    ( req, res ) => {

        let rangeKey = req.params.rangekey;

        if( rangeKey ) {
            housing.getHouseDetails(
                rangeKey
            ).then( data => {
                res.send( data );
            } ).catch( err => {
                res.send( err );
            } );
        } else {
            res.send( resMsg.errorMessage( "MissingRangeKey" ) );
        }

    }
);

// Type is rent or buy
// pages is the max page number to scrape
// City must have a dash ( - ) in place of spaces
// State is two letter abbreviation
// Response: { link:"https...", results:... }
// No API docs for this since it is not available
// outside of backend development.
router.post( '/scrape',
    ( req, res ) => {

        if( process.env.DEV_USER === res.locals.user[ "accessToken_token" ] ) {
            let pages = req.body.pages;
            let type = req.body.type === consts.HOUSING.BUY_TYPE ?
                consts.HOUSING.BUY_PATH :
                consts.HOUSING.RENT_PATH;
            let timeout = 0;

            if( pages ) {
                let promises = [];
                for( let i = 0; i < consts.RATED_CITIES.length; ++i ){

                    let city = consts.RATED_CITIES[i].city;
                    let state = consts.RATED_CITIES[i].state;
                    let path = process.env.HOUSING_SITE;
                    path += "/" + state +
                        "/" + city;
                    path += type;

                    console.log( path );

                    for( let j = 1; j <= pages; ++j ) {

                        let queryString = qs.stringify( {
                            page: j
                        } );

                        promises.push(
                            new Promise( ( pageResolve, pageReject ) => {
                                setTimeout(function() {

                                    tr.request( path + "?" + queryString, ( err, response, body ) => {
                                        if( err ) {
                                            console.log( "Error: " + err );
                                        } else {
                                            scrape.parseHousingSearchResults(
                                                body,
                                                req.body.type
                                            ).then( searchResults => {
                                                pageResolve( searchResults );
                                            } ).catch( err => {
                                                pageReject( err );
                                            } );
                                        }
                                    } )
                                }, timeout );
                            } )
                        );
                        timeout += 1000;
                    }
                }

                Promise.all( promises ).then( pages => {
                    res.send( pages );
                } ).catch( err =>
                    res.send( err )
                );

            } else {
                res.send( resMsg.errorMessage( "MissingParams" ) );
            }
        } else {
            res.send("Access Denied! Development use only.")
        }
    }
);

// ONE time use to setup table! Just a helper to setup table on AWS.
router.post('/scrape/tablesetup', (req, res) => {
    if( process.env.DEV_USER === res.locals.user["accessToken_token"] ) {
        scrape.setupTable();
        res.send("Table setup ran, see console on server");
    } else {
        res.send("Access Denied! Development use only.")
    }
});

module.exports = router;