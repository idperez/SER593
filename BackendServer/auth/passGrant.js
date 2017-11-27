const users = require( '../db/users' );
const response = require( "../responses/responses" );
const tokenGen = require( "rand-token" );
const tokenProps = require( "../keys/token" );
const consts = require( "../constants" );
const passwordHash = require('password-hash');


// Generate access token for user
exports.authenticate = ( username, password ) => {
    return new Promise(( resolve, reject ) => {
        users.getUserProfile( username ).then( userProfile => {
            if( passwordHash.verify( password, userProfile[consts.PROF_KEYS.PASSWORD] ) ) {
                let accessToken = generateToken();
                // Save token to user profile
                saveToken(
                    userProfile,
                    accessToken
                ).then( () =>{
                    // Success, send the token.
                    resolve( accessToken.token );
                }).catch( err => {
                    reject( err );
                });
            } else {
                reject( "PasswordMismatch" );
            }
        } ).catch( err => {
            reject( {
                code: "ErrorGettingProfile",
                message: JSON.stringify( err )
            } );
        } );
    });
};

// Authorize use of api
exports.authorize = ( req, res, next ) => {
    // Grab access token from DB
    users.getUserProfileByPrimaryKey( consts.PROF_KEYS.ACCESS_TOKEN, req.token ).then( user => {
        if( req.token === user[consts.PROF_KEYS.ACCESS_TOKEN] ) {
            if( !user[consts.PROF_KEYS.ACCESS_EXPR] || user[consts.PROF_KEYS.ACCESS_EXPR] <= Date.now() ) {
                res.send( response.errorMessage( "TokenExpired" ) );
            } else {
                res.locals.user = user;
                next();
            }
        } else {
            res.send( response.errorMessage( "TokenMismatch" ) );
        }
    } ).catch( err => {
        res.send( response.errorMessage( {
            code: "TokenNotFound",
            message: JSON.stringify( err )
        } ) );
    } );
};

exports.register = ( username, password, email ) => {
    return new Promise( ( resolve, reject ) => {
        users.addNewUser( username, passwordHash.generate( password ), email ).then( data => {
            exports.authenticate( username, password ).then( token => {
                // Success, send the auth token for new user.
                resolve( token );
            }).catch( err => {
                reject( err );
            });

        }).catch( err => {
            reject( err );
        });
    });
};

exports.revokeToken = ( userObj ) => {
    return new Promise( ( resolve, reject ) => {
        users.modifyUserItem( userObj, consts.PROF_KEYS.ACCESS_EXPR, 0, consts.MODIFIY_PREFS_MODES.MODIFY ).then( data => {
            resolve( data );
        }).catch( err => {
            reject( err );
        });
    });
};

// Used to save access token to DB
let saveToken = ( userObj, token ) => {
    return new Promise( ( resolve, reject ) => {
        // TODO - clean up to make it one single call to database
        let promises = [
            users.modifyUserItem( userObj, consts.PROF_KEYS.ACCESS_TOKEN, token.token, consts.MODIFIY_PREFS_MODES.MODIFY ),
            users.modifyUserItem( userObj, consts.PROF_KEYS.ACCESS_EXPR, token.expr, consts.MODIFIY_PREFS_MODES.MODIFY )
        ];
        Promise.all( promises ).then( () => {
            resolve();
        } ).catch( err => {
            reject( err );
        } )
    });
};

// TODO - Make sure token is not already taken somehow
let generateToken = () => {
    let tokenExpr = Date.now() + tokenProps.tokenExpr;
    let token = tokenGen.generate( tokenProps.tokenSize );
    return {
        token: token,
        expr: tokenExpr
    }
};