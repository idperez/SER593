const users = require( '../db/users' );

//generateAccessToken() omitted, default used.

//generateRefreshToken() omitted, default used.

//generateAuthorizationCode() omitted, default used.

exports.getAccessToken = ( bearerToken ) => {
    console.log(1)
    return new Promise( ( resolve, reject ) => {
        users.getUserProfileByPrimaryKey( "accessToken_token", bearerToken ).then( user => {
            resolve( user[ "accessToken_token" ] ? user[ "accessToken_token" ] : false );
        } ).catch( err => {
            reject( err );
        } );
    });
};

exports.getRefreshToken = ( refreshToken ) => {
    console.log(2)

    return new Promise( ( resolve, reject ) => {
        users.getUserProfileByPrimaryKey( "refreshToken_token", refreshToken ).then( user => {
            resolve( user[ "refreshToken_token" ] ? user[ "refreshToken_token" ] : false );
        } ).catch( err => {
            reject( err );
        } );
    });
};

// Used to retrieve auth code from DB
exports.getAuthorizationCode = ( authCode ) => {
    console.log(3)

    return new Promise( ( resolve, reject ) => {
        users.getUserProfileByPrimaryKey( "authCode_code", authCode ).then( user => {
            resolve( {
                code: user.authCode.code,
                expiresAt: user.authCode.expr,
                scope: user.authCode.scope,
                client: { id: user[ "client_id" ] },
                user: user
            } );
        } ).catch( err => {
            reject( err );
        } );
    });
};

// Used to retrieve client by id and secret
exports.getClient = ( id, secret ) => {
    console.log(4)

    return new Promise( ( resolve, reject ) => {
        users.getUserProfileByPrimaryKey( "client_id", id ).then( user => {
            let currentProfile = {
                id: user[ "client_id" ],
                grants: user[ "client_grants" ],
                redirectUris: user[ "client_redirectUris" ],
                accessTokenLifetime: 5000,
                refreshTokenLifetime: 5000,
            };
            if( secret !== null ) {
                if( user[ "client_secret" ] === secret ) {
                    let user = users[ 0 ];
                    resolve( currentProfile );
                } else {
                    reject("SecretMismatch");
                }
            // No secret provided, thus no authentication needed.
            } else {
                resolve( currentProfile );
            }

        } ).catch( err => {
            console.log( err );
            reject( err );
        } );
    });
};

// Used to save access token and refresh token to DB
exports.saveToken = ( token, client, user ) => {
    console.log(5)

    return new Promise( ( resolve, reject ) => {
        // TODO - clean up to make it one single call to database
        let promises = [
            users.addUserItem( user.id, "accessToken_token", token.accessToken ),
            users.addUserItem( user.id, "accessToken_Expr", token.accessTokenExpiresAt ),
            users.addUserItem( user.id, "tokenScope", token.scope ),
            users.addUserItem( user.id, "refreshToken_token", token.refreshToken ),
            users.addUserItem( user.id, "refreshToken_expr", token.refreshTokenExpiresAt ),
            users.addUserItem( user.id, "client_id", client.id )
        ];
        Promise.all( promises ).then( () => {
            resolve( {
                accessToken: token.accessToken,
                accessTokenExpiresAt: token.accessTokenExpiresAt,
                refreshToken: token.refreshToken,
                refreshTokenExpiresAt: token.refreshTokenExpiresAt,
                scope: token.scope,
                client: { id: client.id },
                user: { id: user.id }
            } );
        } ).catch( err => {
            reject( err );
        } )
    });
};

// Used to save auth code to DB
exports.saveAuthorizationCode = ( authCode, client, user ) => {
    console.log(6)

    return new Promise( ( resolve, reject ) => {
        // TODO - clean up to make it one single call to database
        let promises = [
            users.addUserItem( user.id, "authCode_code", authCode.authorizationCode ),
            users.addUserItem( user.id, "authCode_expr", authCode.expiresAt ),
            users.addUserItem( user.id, "authCode_redirectUrl", authCode.redirectUri ),
            users.addUserItem( user.id, "authCode_scope", authCode.scope ),
            users.addUserItem( user.id, "client_id", client.id )
        ];
        Promise.all( promises ).then( () => {
            resolve( {
                accessToken: token.accessToken,
                accessTokenExpiresAt: token.accessTokenExpiresAt,
                refreshToken: token.refreshToken,
                refreshTokenExpiresAt: token.refreshTokenExpiresAt,
                scope: token.scope,
                client: { id: client.id },
                user: { id: user.id }
            } );
        } ).catch( err => {
            reject( err );
        } );
    });
};

// Used to revoke auth code from DB
exports.revokeAuthorizationCode = ( authCode ) => {
    console.log(7)

    return new Promise( ( resolve, reject ) => {
        users.addUserItem( authCode.user.id, "authCode_code", "" ).then( () => {
            resolve( true );
        } ).catch( err => {
            reject( false );
        } );
    });
};

// Used to revoke auth code from DB
exports.revokeToken = ( token ) => {
    console.log(8)

    return new Promise( ( resolve, reject ) => {
        users.addUserItem( token.user.id, "accessToken_token", "" ).then( () => {
            resolve( true );
        } ).catch( err => {
            reject( false );
        } );
    });
};

exports.validateScope = ( scope ) => {
    console.log(9)

    return true;
};

// Get user profile for authorization
exports.authorization = {
    handle: (request, response) => {
        console.log(10)

        return new Promise( ( resolve, reject ) => {
            users.getUserProfile( request.query.username ).then( userProfile => {
                userProfile.id = userProfile.username;
                userProfile.clientId = userProfile[ "client_id" ];
                userProfile.clientSecret = userProfile[ "client_secret" ];
                resolve( userProfile, request, response );
            } ).catch( err => {
                reject( err );
            } );
        });
    }
};