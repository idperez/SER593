const express = require( 'express' );
const body_parser = require( 'body-parser' );
const cookie_parser = require( 'cookie-parser' );
const port = process.env.PORT || 3000; // Grab port for AWS
const auth = require( './routes/auth' );
const test = require( './routes/test' );
const jobs = require( './routes/jobs' );
const profiles = require( './routes/profiles' );
const OAuthServer = require( 'express-oauth-server' );
const authModel = require( './auth/model' );

let app = express();

app.oauth = new OAuthServer({
    model: authModel,
    grants: ['authorization_code'],
    debug: true
});

app.get( '/', ( req, res ) => {
        res.send( "Hello!" );
    }
);

// For development use
app.use('/apidocs', express.static('apiDocs'));

app.use( require( 'morgan' )( 'combined' ) );
app.use( cookie_parser() );
app.use( body_parser.json() );
app.use( body_parser.urlencoded({ extended: false }) );
//app.use( app.oauth.authenticate() );

// Routing
app.use( '/auth', auth );
app.use( '/test', test ); // For development use
app.use( '/search/jobs', jobs );
app.use( '/profile', profiles );
app.post("/oauth/authorize", app.oauth.authorize({
    authenticateHandler: {
        handle: authModel.authorization
    }
}));
app.post("/oauth/token", app.oauth.token());

app.listen( port );
