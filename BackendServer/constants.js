// File containing globally used constants

// Profile keys stored on database
exports.PROF_KEYS = {
    USERNAME: "username",
    PASSWORD: "password",
    EMAIL: "email",
    PREFS_JOBS_TITLES: "prefs_jobs_titles",
    PREFS_JOBS_TYPES: "prefs_jobs_types", // "fulltime", "parttime", "contract", "internship", "temporary".
    PREFS_JOBS_DATE: "prefs_jobs_postedDate", // Number of days old
    PREFS_JOBS_SAVED: "prefs_jobs_saved",
    CITY_MATCH: "cityMatch",
    ACCESS_TOKEN: "accessToken_token",
    ACCESS_EXPR: "accessToken_expr",
    LAST_UPDATED: "last_updated"
};

exports.USER_TABLE_NAME = "topia_profiles";
exports.USER_PRIMARY_KEY = exports.PROF_KEYS.USERNAME;


// Profile keys to exclude from the profile object when sending to front-end
// These must be defined in PROF_KEYS.
exports.PROF_KEYS_TO_EXCLUDE = [
    exports.PROF_KEYS.PASSWORD,
    exports.PROF_KEYS.ACCESS_TOKEN,
    exports.PROF_KEYS.LAST_UPDATED
];

// Modes for modifying a user preference
exports.MODIFIY_PREFS_MODES = {
    MODIFY: "modify",           // Modify an existing DB value
    REMOVE: "remove",           // Remove an existing DB value
    LIST_APPEND: "listappend",  // Append value to a DB list
    LIST_REMOVE: "listremove"   // Remove value from a DB list
};

// Saved job properties in addition to the ones on indeed
exports.JOB_PROPS = {
    LAST_CHECKED: "last_checked" // The timestamp in ms of when the job was last updated
};

// Temp token to be used between registration and authentication
// This is an invalid token, with no access.
exports.TEMP_TOKEN = "registering";

exports.HOUSING = {
    BUY_PATH: "",
    RENT_PATH: "/rentals/",
    BUY_TYPE: "buy",
    RENT_TYPE: "rent",

    // Begin the housing parse object
    HOUSING_PARSE:{
        SEARCH:{
            LISTINGS: "leftColumn",
            ITEM_BODY: {
                ITEM_BODY: "propertyInformation",
                ITEM_TEXT: "content", // Common key where the text for house info is stored
                PRICE: "price",
                ADDRESS:{
                    ADDRESS_BODY: "address",
                    STREET_BODY: "streetAddress",
                    CITY_BODY: "addressLocality",
                    STATE_BODY: "addressRegion",
                    ZIP_BODY: "postalCode"
                },
                TYPE: "propertyType",
                ATTRIBUTES: {
                    ATTRIBUTES_BODY: "attributes",
                    BEDS: "beds",
                    BATHS: "baths"
                },
                DETAILS_LINK: "href"
            },
            PHOTO:{
                PHOTO_OBJ: "alignForTwoPhotos",
                PHOTO_LINK: "src"
            }
        },

        DETAILS:{
           INFO_HEADER: {
               INFO_HEADER: "propertyInformationDetailsHeader",
               PAYMENT: "estimatedPaymentValue"
               // Square feet

           },
           LEFT_RAIL:{
               LEFT_RAIL: "leftRail",
               DESCRIPTION: "description",
               PHOTO_OBJ: "largePhotoCarousel"
           }
        }
    },

    DB_KEYS:{
        ADDRESS: "Address", // Primary key
        STREET: "street",
        CITY: "city",
        STATE: "state",
        ZIP: "zip",
        TYPE: "type",
        FULL_BATHS: "fullBaths",
        HALF_BATHS: "halfBaths",
        BEDS: "beds",
        DETAILS_LINK: "detailsLink",
        PHOTO_LINK: "photoLink",
        LAT: "lat",
        LONG: "long",
        PURCHASE_TYPE: "purchaseType",
        PRICE: "price",
        DETAILS_DESCRIPTION: "details_Description",
        DETAILS_PHOTO_LINKS: "details_PhotoLinks"
    },

    // Key names for the zillow deep search API
    ZILLOW_OBJ:{
        RESPONSE: "response",
        RESULTS: "results",
        RESULT_ARRAY: "result",
        BEST_RESULT_INDEX: 0,
        PROPERTY_ID: "zpid",
        YEAR_BUILT: "yearBuilt",
        LOT_SIZE: "lotSizeSqFt",
        HOUSE_SIZE: "finishedSqFt",
        // Valuation
        VAL_LOW: "low",
        VAL_HIGH: "high",
        VALUATION_AMT: "_",
        ZEST: "zestimate",
        VALUATION_RANGE: "valuationRange",
        // Valuation end

    }
};

// The cities included in our rating.
// This is variable with city population, but
// for development in 2018, this will be used to scrape
// housing test data
exports.RATED_CITIES = [
        {"city":"Phoenix","state":"AZ"},
        {"city":"Tucson","state":"AZ"},
        {"city":"Fresno","state":"CA"},
        {"city":"Los Angeles","state":"CA"},
        {"city":"San Diego","state":"CA"},
        {"city":"San Francisco","state":"CA"},
        {"city":"San Jose","state":"CA"},
        {"city":"Denver","state":"CO"},
        {"city":"Washington","state":"DC"},
        {"city":"Jacksonville","state":"FL"},
        {"city":"Chicago","state":"IL"},
        {"city":"Indianapolis","state":"IN"},
        {"city":"Louisville","state":"KY"},
        {"city":"Baltimore","state":"MD"},
        {"city":"Boston","state":"MA"},
        {"city":"Detroit","state":"MI"},
        {"city":"Las Vegas","state":"NV"},
        {"city":"Albuquerque","state":"NM"},
        {"city":"New York","state":"NY"},
        {"city":"Charlotte","state":"North Carolina"},
        {"city":"Columbus","state":"OH"},
        {"city":"Oklahoma City","state":"OK"},
        {"city":"Portland","state":"OR"},
        {"city":"Philadelphia","state":"PA"},
        {"city":"Memphis","state":"TN"},
        {"city":"Nashville","state":"TN"},
        {"city":"Austin","state":"TX"},
        {"city":"Dallas","state":"TX"},
        {"city":"El Paso","state":"TX"},
        {"city":"Fort Worth","state":"TX"},
        {"city":"Houston","state":"TX"},
        {"city":"San Antonio","state":"TX"},
        {"city":"Seattle","state":"WA"},
        {"city":"Milwaukee","state":"WI"}
];
