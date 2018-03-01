let himalaya = require( 'himalaya' );
const consts = require( "../constants" );
let ps = require('prop-search');
let nestedProperty = require("nested-property");
let findByKey = require('find-by-key');
const utils = require('../util');
const qs = require( 'querystring' );
const tr = require('tor-request');
const request = require( 'request' );
const DB = require( "../db/databaseAccess" );

const NODE_CHILDREN = "children";
const NODE_ATTRIBUTES = "attributes";
const LOCATION_ENDPOINT = "https://maps.googleapis.com/maps/api/geocode/json";
const EMPTY_PHOTO = "/image/noPhotoYet.gif";

// Multiple pieces of information need to be pulled from the photo object.
let photoObj;

exports.parseHousingSearchResults = ( html, purchaseType ) => {
    return new Promise( ( resolve, reject ) => {

        let housingJson = himalaya.parse( html );
        housingJson = getDOMObject(
            housingJson,
            consts.HOUSING.HOUSING_PARSE.SEARCH.LISTINGS
        );

        if( housingJson ){
            let housingPromises = [];
            housingJson = housingJson[NODE_CHILDREN];
            housingJson = removeWhitespace( housingJson );

            for( let i = 0; i < housingJson.length; i++ ){
                housingPromises.push( new Promise( ( resolveHouse, rejectHouse ) => {
                    let currentHouseBody = getHouseSearchBody( housingJson[i] );
                    // This should filter out ads or anything else
                    // All house results must have a house body
                    if( currentHouseBody ) {
                        // The photo is not part of the body
                        let photoLink = getPhotoLink( housingJson[i] );
                        if( photoLink !== EMPTY_PHOTO ) {
                            let detailsLink = getDetailsLink();
                            let price = getPrice( currentHouseBody );
                            let address = getAddress( currentHouseBody );
                            let type = getType( currentHouseBody );
                            let attributes = getHouseAttributes( currentHouseBody );
                            getCoordinates(
                                address.street,
                                address.city,
                                address.state
                            ).then( coords => {

                                let house = {
                                    photoLink: photoLink,
                                    detailsLink: detailsLink,
                                    price: price,
                                    address: address,
                                    type: type,
                                    attributes: attributes,
                                    coordinates: coords,
                                    purchaseType: purchaseType
                                };

                                getAndParseHousingDetails( detailsLink ).then( details => {
                                    house.details = details;
                                    resolveHouse( house );
                                }).catch( err => rejectHouse( err ) );
                            } ).catch( err => {
                                rejectHouse( err );
                            } );
                        // Empty house link
                        } else {
                            resolveHouse( null );
                        }
                    } else {
                        resolveHouse( null );
                    }
                }));
            }
            Promise.all( housingPromises ).then( houses => {
                houses = houses.filter( ( house ) => { return house != null } );
                //saveHousingTestData( houses ).then( data => {
                    resolve( houses );
               // }).catch( err => {
                //    reject( err );
                //});
            }).catch( err => {
                reject( err );
            });
        } else {
            reject( "ParseError" );
        }
    });
};

let getAndParseHousingDetails = ( detailsLink ) => {
    return new Promise( ( resolve, reject ) => {
        tr.request( detailsLink, ( err, response, body ) => {
            if( err ){
                // Empty details is preferred over killing the entire response
                resolve( null );
            } else {
                let housingDetailsJson = himalaya.parse( body );
                let description;
                let photoLinks;

                // Narrow down object to just the left rail for the next searches
                let leftRail = getDOMObject(
                    housingDetailsJson,
                    consts.HOUSING.HOUSING_PARSE.DETAILS.LEFT_RAIL.LEFT_RAIL
                );

                // Get all left rail items
                if( !leftRail ){
                    resolve( "leftRailErr" );
                } else {
                    description = getValueInObject(
                        leftRail,
                        consts.HOUSING.HOUSING_PARSE.DETAILS.LEFT_RAIL.DESCRIPTION,
                        consts.HOUSING.HOUSING_PARSE.SEARCH.ITEM_BODY.ITEM_TEXT,
                        true // Exact match to description
                    );

                    photoLinks = getDOMObject(
                        leftRail,
                        consts.HOUSING.HOUSING_PARSE.DETAILS.LEFT_RAIL.PHOTO_OBJ
                    );
                    photoLinks = getAttrValuesByKey( photoLinks, "src" );



                    resolve( photoLinks ? photoLinks : "descErr" );
                }
            }
        });
    });
};

let saveHousingTestData = ( houses ) => {
    return new Promise( ( resolve, reject ) => {
        let promises = [];
        for( let i = 0; i < houses.length; ++i ){
            promises.push( DB.addTestHouse( houses[i] ) );
        }

        Promise.all( promises ).then( housesAdded => {
            resolve( housesAdded );
        }).catch( err => {
            reject( err );
        })
    });
};

let getCoordinates = ( address, city, state ) => {
    return new Promise( ( resolve, reject ) => {
        address = address.split("-")[0];
        let fullAddress = address + "," + city + "," + state;
        fullAddress = fullAddress.replace( / /g, "+" );
        let query = {
            key: process.env.KEY_GOOGLE,
            address: fullAddress
        };

        console.log( "Getting coords for: " + address + city + state );

        query = qs.stringify( query );

        request( LOCATION_ENDPOINT + "?" + query, ( err, response, body ) => {
            let lat = null;
            let long = null;
            if( err ) {
                // Resolve null location values
                console.log( "Warning: No location found for " + fullAddress );
            } else {
                let locObj = JSON.parse( body ).results[0];
                if( locObj ) {
                    locObj = locObj.geometry.location;
                    lat = locObj.lat ? locObj.lat : null;
                    long = locObj.lng ? locObj.lng : null;
                } else {
                    console.log( "Warning: No location found for " + fullAddress );
                }
            }
            resolve( {
                lat: lat,
                long: long
            });
        });
    });
};

let getHouseAttributes = ( houseBody ) => {
    let houseAttributes = getDOMObject(
        houseBody,
        consts.HOUSING.HOUSING_PARSE.SEARCH.ITEM_BODY.ATTRIBUTES.ATTRIBUTES_BODY
    );

    let bedStr = getValueInObject(
        houseAttributes,
        consts.HOUSING.HOUSING_PARSE.SEARCH.ITEM_BODY.ATTRIBUTES.BEDS,
        consts.HOUSING.HOUSING_PARSE.SEARCH.ITEM_BODY.ITEM_TEXT,
        true
    );

    let bathsStr = getValueInObject(
        houseAttributes,
        consts.HOUSING.HOUSING_PARSE.SEARCH.ITEM_BODY.ATTRIBUTES.BATHS,
        consts.HOUSING.HOUSING_PARSE.SEARCH.ITEM_BODY.ITEM_TEXT
    );

    // Custom handling for current source
    houseAttributes = pullHouseAttributesFromStrings(
        bedStr,
        bathsStr
    );

    return houseAttributes;
};

// Gets how many bedrooms, baths and half baths
// May need to be customized on text and/or source change
let pullHouseAttributesFromStrings = ( bedStr, bathStr ) => {

    // Bed string is currently: "1 Beds"
    // Split at the space and take first half
    let beds = 0;
    if( bedStr ) {
        beds = parseInt( bedStr.split( " " )[0] );
    }

    // Baths String is currently: "1 Full, 1 Half Baths"
    // Split at comma, then split at space
    let fullBaths;
    let halfBaths;
    if( bathStr ) {
        let bathsArr = bathStr.split( ", " );
        fullBaths = parseInt( bathsArr[0].split( " " )[0] );
        halfBaths = 0;
        if( bathsArr.length > 1 ) {
            halfBaths = parseInt( bathsArr[1].split( " " )[0] );
        }
    }

    return {
        bedrooms: beds,
        fullBaths: fullBaths,
        halfBaths: halfBaths
    }
};

// Get housing types
let getType = ( houseBody ) => {
    let resType = null;
    let type = getDOMObject(
        houseBody,
        consts.HOUSING.HOUSING_PARSE.SEARCH.ITEM_BODY.TYPE
    );

    if( type ){
        resType = getFirstValueByKey(
            type,
            consts.HOUSING.HOUSING_PARSE.SEARCH.ITEM_BODY.ITEM_TEXT
        );
    }
    return resType;
};

let getAddress = ( houseBody ) => {
    let street;
    let city;
    let state;
    let zip;
    let addressBody = getDOMObject(
        houseBody,
        consts.HOUSING.HOUSING_PARSE.SEARCH.ITEM_BODY.ADDRESS.ADDRESS_BODY
    );

    // Street address
    street = getAttrValueInObject(
        addressBody,
        consts.HOUSING.HOUSING_PARSE.SEARCH.ITEM_BODY.ADDRESS.STREET_BODY,
        consts.HOUSING.HOUSING_PARSE.SEARCH.ITEM_BODY.ITEM_TEXT
    );

    // City
    city = getAttrValueInObject(
        addressBody,
        consts.HOUSING.HOUSING_PARSE.SEARCH.ITEM_BODY.ADDRESS.CITY_BODY,
        consts.HOUSING.HOUSING_PARSE.SEARCH.ITEM_BODY.ITEM_TEXT
    );

    // State
    state = getAttrValueInObject(
        addressBody,
        consts.HOUSING.HOUSING_PARSE.SEARCH.ITEM_BODY.ADDRESS.STATE_BODY,
        consts.HOUSING.HOUSING_PARSE.SEARCH.ITEM_BODY.ITEM_TEXT
    );

    // Zip
    zip = getAttrValueInObject(
        addressBody,
        consts.HOUSING.HOUSING_PARSE.SEARCH.ITEM_BODY.ADDRESS.ZIP_BODY,
        consts.HOUSING.HOUSING_PARSE.SEARCH.ITEM_BODY.ITEM_TEXT
    );
    return {
        street: street,
        city: city,
        state: state,
        zip: zip
    };
};

// Get house search result price
let getPrice = ( houseBody ) => {
    let res;

    // Get the attributes portion of the object
    // This will speed up the search for price
    let priceObj = getDOMObject(
        houseBody,
        consts.HOUSING.HOUSING_PARSE.SEARCH.ITEM_BODY.PRICE
    );

    if( priceObj ){
        res = getFirstValueByKey(
            priceObj,
            consts.HOUSING.HOUSING_PARSE.SEARCH.ITEM_BODY.ITEM_TEXT
        );
        // Remove all non-digits from the string
        res = res.replace(/\D/g, '');
    }

    return res;
};

// Get the object for the entire house search result
let getHouseSearchBody = ( currentHouse ) => {
    return getDOMObject(
        currentHouse,
        consts.HOUSING.HOUSING_PARSE.SEARCH.ITEM_BODY.ITEM_BODY
    );
};

// This will use the photo object that was accessed earlier
let getDetailsLink = () => {
    let link = null;
    if( photoObj ){
        link = getAttrValueByKey(
            photoObj,
            consts.HOUSING.HOUSING_PARSE.SEARCH.ITEM_BODY.DETAILS_LINK
        );
    }
    return link;
};

// Get photo link from a search result
let getPhotoLink = ( currentHouse ) => {

    let link;

    photoObj = getDOMObject(
        currentHouse,
        consts.HOUSING.HOUSING_PARSE.SEARCH.PHOTO.PHOTO_OBJ
    );

    if( photoObj ){
        link = getAttrValueByKey(
            photoObj[NODE_CHILDREN],
            consts.HOUSING.HOUSING_PARSE.SEARCH.PHOTO.PHOTO_LINK
        );
        if( !link ){
            console.log( consts.HOUSING.HOUSING_PARSE.SEARCH.PHOTO.PHOTO_LINK +
                         " not found in photo object." );
        }
    } else {
        console.log( consts.HOUSING.HOUSING_PARSE.SEARCH.PHOTO.PHOTO_OBJ +
                     " not found in current house object." );
    }

    return link;
};

// Get a value by key in a sub-object defined by objectName
let getValueInObject = ( parsedHtml, objectName, key, exact = false ) => {
    // Address
    let val = getDOMObject(
        parsedHtml,
        objectName,
        exact
    );
    val = getFirstValueByKey(
        val,
        key
    );
    return val;
};

// Get attribute value inside an object
// For example:
/*
    "type": "element",
    "tagName": "meta",
    "attributes": [
        {
            "key": "itemprop",
            "value": "streetAddress"
        },
        {
            "key": "content",
            "value": "222 East 80th Street - Apt: 6A"
        }
    ],
*/
// An object name of street address will return the above
// object, and a key of content will return the address.
let getAttrValueInObject = ( parsedHtml, objectName, key, valueName = "value" ) => {
    let val = getDOMObject(
        parsedHtml,
        objectName
    );
    val = getAttrValueByKey(
        val,
        key,
        valueName
    );
    return val;
};

// Allow multiple values by key
let getValuesByKey = ( parsedHtml, key ) => {
    let results = findByKey( parsedHtml, key );

    // If there is one result, it's not an array
    // Lets always make it an array
    results = utils.emptyArray( results ) ? results : [results];

    return results;
};

// Simply find the first key buried in an object and get it's value
let getFirstValueByKey = ( parsedHtml, key ) => {
    let vals = getValuesByKey( parsedHtml, key );
    let cleanedValues = [];
    let bestValue;

    // Clean up any empty values
    for( let i = 0; i < vals.length; i++ ){
        if( vals[i] && vals[i] !== " " ){
            cleanedValues.push(vals[i]);
        }
    }

    if( !utils.emptyArray( cleanedValues ) ){
        bestValue = cleanedValues[0];
    } else {
        bestValue = null;
    }
    return bestValue;
};

/* Get an attribute value by a key.
   valueName allows to specify what key for value is.
   Usually it is "value", but sometimes not.
   Example of typical key/value pair:
   {
    "key": "class",
    "value": "addr"
   }
   In this case, your key param would be "class", and "addr" is returned.
*/
let getAttrValueByKey = ( parsedHtml, key, valueName = "value" ) => {
    let res;
    let path = getTagNamePath( parsedHtml, key );

    if( path ){
        path = path + "." + valueName;
        res = nestedProperty.get( parsedHtml, path );
    }
    return res;
};

/*
    See above, except get ALL matches in an object for this key
 */
let getAttrValuesByKey = ( parsedHtml, key, valueName = "value" ) => {
    let results = [];
    let paths = getTagNamePath( parsedHtml, key, true, true );

    paths.forEach( path => {
        path = path + "." + valueName;
        let result = nestedProperty.get( parsedHtml, path );
        results.push( result );
    });

    return results;
};

// Get dom object containing the tagName
let getDOMObject = ( parsedHtml, tagName, exact = false ) => {
    let res;
    let path = getTagNamePath( parsedHtml, tagName, exact );

    if( path ){
        // Remove the "attributes" portion of the path to get the object location
        path = path.substring( 0, path.lastIndexOf( NODE_ATTRIBUTES ) - 1 );
        res = nestedProperty.get( parsedHtml, path );
    }
    return res;
};

// Get the path to the tagName
// Exact determines if the tag should match exactly or allow for partial matches
let getTagNamePath = ( parsedHtml, tagName, exact = false, multiple = false ) => {
    let paths;
    let objPaths;

    // Allow the value of tagName to be a substring of the actual
    // string value found while searching
    let looseFunc = ( testObj ) => {
        if( typeof testObj === "object" ) {
            for( let key in testObj ) {
                if( testObj.hasOwnProperty( key ) &&
                    typeof testObj[ key ] === "string"
                ){
                    // Trim anything after and including a space from the tag string
                    // This will remove any styling nonsense that may have been added
                    let subStr = exact ? testObj[ key ] : testObj[ key ].split( " " )[0];
                    if( tagName === subStr ){
                        return true;
                    }
                }
            }
        }
        return false;
    };

    objPaths = ps.search(
        parsedHtml,
        looseFunc,
        { separator: '.' }
    );


    if( !utils.emptyArray( objPaths ) ){
        if( !multiple ) {
            paths = objPaths[ 0 ].path;
        } else {
            // Get a list of paths
            paths = [];
            objPaths.forEach( objPath => {
                paths.push( objPath.path );
            });
        }
    }

    return paths;
};

// Remove html white space - following 3 functions.
// Written/Shared by the developer of himalaya - Chris Andrejewski
// https://github.com/andrejewski
let removeEmptyNodes = (nodes) => {
    return nodes.filter(node => {
        if (node.type === 'element') {
            node.children = removeEmptyNodes(node.children);
            return true
        }
        return node.content.length
    })
};
let stripWhitespace = (nodes) => {
    return nodes.map(node => {
        if (node.type === 'element') {
            node.children = stripWhitespace(node.children)
        } else {
            node.content = node.content.trim()
        }
        return node
    })
};
let removeWhitespace = (nodes) => {
    return removeEmptyNodes(stripWhitespace(nodes))
};