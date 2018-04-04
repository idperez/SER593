const express = require( 'express' );
const router = express.Router();
const resMsg = require('../responses/responses.js');
const consts = require( "../constants" );
const thingsToDo = require( '../search/thingsToDo' );

/**
 * @api {get} /thingstodo Things To Do Search
 * @apiName ThingsToDoSearch
 * @apiGroup ThingsToDo
 * @apiDescription Get list of things to do by coordinates or city/state.
 *
 * @apiHeader {String} authorization Bearer token
 * @apiHeaderExample {json} Header-Example:
 *      {
 *          authorization: Bearer QZ3jhbfdof84GFBlSe
 *      }
 *
 * @apiExample Example-Request(s)
 *      path-to-topia-api.com/thingstodo?city=San+Diego&state=CA&radius=5
 *      path-to-topia-api.com/lat=33.218390&long=-111.767775&radius=5
 *
 * @apiParam {String} lat Latitude. Required when city/state are not provided
 * @apiParam {String} long Longitude. Required when city/state are not provided.
 * @apiParam {String} city City to search. Required when lat/long are not provided.
 * @apiParam {String} state state to search. Required when lat/long are not provided.
 * @apiParam {Number} [radius=25] Radius in miles to search for things to do.
 *
 * @apiSuccessExample {json} Success-Response for fish tacos:
 *
 {
 "businesses": [
 {
     "id": "oscars-mexican-seafood-san-diego-6",
     "name": "Oscar's Mexican Seafood",
     "image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/YT2brlhILpPZgIlxJEZ9SA/o.jpg",
     "is_closed": false,
     "url": "https://www.yelp.com/biz/oscars-mexican-seafood-san-diego-6?adjust_creative=z4rq50TEkyGgxdcoaC1u2g&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=z4rq50TEkyGgxdcoaC1u2g",
     "review_count": 1247,
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
     "coordinates": {
         "latitude": 32.7486014556313,
         "longitude": -117.15913947605
     },
     "transactions": [
         "delivery",
         "pickup"
     ],
     "price": "$",
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
         ]
     },
     "phone": "+16197983550",
     "display_phone": "(619) 798-3550",
     "distance": 4690.501461512596
 },
 ...
 ],
 "total": 332
 "terms": [
       "fish tacos"
    ]
}
 *
 * @apiError SearchLocationMissing lat/long or city/state missing from query.
 * @apiError InvalidSearchType Internal error.
 * @apiError TokenNotFound Bearer token not found in header.
 * @apiError TokenMismatch Bearer token does not match.
 * @apiError TokenExpired Bearer token is expired.
 * @apiErrorExample {json} Error-Response:
 *     {
 *       "err": "MissingCoordinates"
 *     }
 */
router.get('/', (req, res) => {
    // Coordinates take precedence on purpose
    if( req.query.lat && req.query.long ) {
        thingsToDo.getThingsToDoByCoordinates(
            res.locals.user,
            req.query.lat,
            req.query.long,
            req.query.radius
        ).then( things => {
            res.send( things );
        } ).catch( err => res.send( resMsg.errorMessage( err ) ) );
    } else if( req.query.city && req.query.state ) {
        thingsToDo.getThingsToDoByLocation(
            res.locals.user,
            req.query.city,
            req.query.state,
            req.query.radius
        ).then( things => {
            res.send( things );
        } ).catch( err => res.send( resMsg.errorMessage( err ) ) );
    } else {
        res.send( resMsg.errorMessage( "SearchLocationMissing" ) )
    }
});

module.exports = router;