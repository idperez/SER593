// File containing globally used constants

// Profile keys stored on database
exports.PROF_KEYS = {
    USERNAME: "username",
    PASSWORD: "password",
    EMAIL: "email",
    PREFS_JOBS_TITLES: "prefs_jobs_titles",
    PREFS_JOBS_TYPES: "prefs_jobs_types",
    PREFS_JOBS_DATE: "prefs_jobs_postedDate", // Number of days old
    PREFS_JOBS_SAVED: "prefs_jobs_saved",
    CITY_MATCH: "cityMatch",
    ACCESS_TOKEN: "accessToken_token",
    ACCESS_EXPR: "accessToken_expr",
    LAST_UPDATED: "last_updated"
};

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

