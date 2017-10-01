/*
    This file represents user keys to pre-populate the database for new user profiles
 */

exports.profile = {
    "username": { S: "" },
    "pw": { S: "" },
    "prefs.jobs.titles": { NULL: true },
    "prefs.jobs.types": { SS: ["fulltime"] }, // parttime, fulltime, intern, etc
    "prefs.jobs.postedDate": { N: "30" },  // Limit by days old
};