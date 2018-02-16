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
    RENT_PATH: "/rentals",

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
        DETAILS_LINK: "details",
        PHOTO_LINK: "photoLink",
        LAT: "lat",
        LONG: "long"
    }
};