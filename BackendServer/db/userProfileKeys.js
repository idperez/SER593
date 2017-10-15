/*
    This file represents user keys to pre_populate the database for new user profiles
 */

exports.profile = {
    "username": { S: "" },
    "prefs_jobs_titles": { NULL: true },
    "prefs_jobs_types": { SS: ["fulltime"] }, // parttime, fulltime, intern, etc
    "prefs_jobs_postedDate": { N: "30" },  // Limit by days old
    "accessToken_token": { NULL: true },
    "accessToken_Expr": { NULL: true },
    "tokenScope": { NULL: true },
    "refreshToken_token": { NULL: true },
    "refreshToken_expr": { NULL: true },
    "authCode_code": { NULL: true },
    "authCode_expr": { NULL: true },
    "authCode_redirectUrl": { NULL: true },
    "authCode_scope": { NULL: true },
    "client_id": { NULL: true },
    "client_secret": { NULL: true },
    "client_grants": { SS: ["authorization_code"]},
    "client_redirectUris": { SS: ["/"]},
};