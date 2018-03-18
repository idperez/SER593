require('dotenv').config();
const express = require( 'express' );
const body_parser = require( 'body-parser' );
const cookie_parser = require( 'cookie-parser' );
const bearerToken = require('express-bearer-token');
const port = process.env.PORT || 3000; // Grab port for AWS
const auth = require( './routes/auth' );
const test = require( './routes/test' );
const jobs = require( './routes/jobs' );
const profiles = require( './routes/users' );
const housing = require( './routes/housing' );
const authorize = require( './auth/passGrant' ).authorize;

let app = express();

app.get( '/', ( req, res ) => {
        res.send( "Hello!" );
    }
);

let except = ( paths, middleware ) => {
    return ( req, res, next ) => {
        if ( paths.includes( req.path ) ) {
            return next();
        } else {
            return middleware( req, res, next );
        }
    };
};

// For development use
app.use('/apidocs', express.static('apiDocs'));

app.use( require( 'morgan' )( 'combined' ) );
app.use( cookie_parser() );
app.use( body_parser.json() );
app.use( body_parser.urlencoded({ extended: false }) );
app.use( bearerToken() );
// Authorization
app.use( except(
    [
        '/auth/login',
        '/auth/register',
    ],
    authorize
) );

// Routing
app.use( '/auth', auth );
app.use( '/test', test ); // For development use
app.use( '/jobs', jobs );
app.use( '/users', profiles );
app.use( '/housing', housing );

app.listen( port );
