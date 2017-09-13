let express = require( 'express' );
let passport = require( 'passport' );
let Strategy = require( 'passport-local' ).Strategy;
let session = require( 'express-session' );
let body_parser = require( 'body-parser' );
let cookie_parser = require( 'cookie-parser' );
let db = require( './db' );
let port = process.env.PORT || 3000; // Grab port for AWS
let auth = require( './routes/auth' );

// Configure the local strategy
passport.use( new Strategy(
    ( username, password, cb ) => {
        db.users.findByUsername( username, ( err, user ) => {
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
    db.users.findByUsername( username, ( err, user ) => {
        if ( err ) { return cb( err ); }
        cb( null, user );
    });
});

let app = express();

app.get( '/', ( req, res ) => {
        res.send( "Hello!" );
    }
);

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

app.listen( port );
