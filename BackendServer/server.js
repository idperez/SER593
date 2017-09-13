const express = require( 'express' );
const passport = require( 'passport' );
const Strategy = require( 'passport-local' ).Strategy;
const session = require( 'express-session' );
const body_parser = require( 'body-parser' );
const cookie_parser = require( 'cookie-parser' );
const db = require( './db' );
const port = process.env.PORT || 3000; // Grab port for AWS
const auth = require( './routes/auth' );
const jobs = require( './routes/jobs' );
const profiles = require( './routes/profiles' );

// Configure the local strategy
passport.use( new Strategy(
    ( username, password, cb ) => {
        db.users.authByUsername( username, ( err, user ) => {
            if ( err ) { return cb( err ); }
            if ( !user ) { return cb( null, false ); }
            if ( user.password !== password ) { return cb( null, false ); }
            return cb( null, user );
        });
    })
);

// Configure passport for sessions
passport.serializeUser( ( user, cb ) => {
        cb( null, user.username );
    }
);

passport.deserializeUser( ( username, cb ) => {
    db.users.authByUsername( username, ( err, user ) => {
        if ( err ) { return cb( err ); }
        cb( null, user );
    });
});

let app = express();

app.get( '/', ( req, res ) => {
        res.send( "Hello!" );
    }
);

// For development use
app.use('/apidocs', express.static('apiDocs'));

app.use( require( 'morgan' )( 'combined' ) );
app.use( cookie_parser() );
app.use( body_parser.urlencoded( { extended: true } ));
app.use( session( {
        // TODO - Hide the secret in a private file.
        secret: 'HIDE_ME',
        resave: true,
        saveUninitialized: false
    })
);
app.use( passport.initialize() );
app.use( passport.session() );

// Routing
app.use( '/auth', auth );
app.use( '/search/jobs', jobs );
app.use( '/profile', profiles );

app.listen( port );
