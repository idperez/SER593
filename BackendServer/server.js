var express = require( 'express' );
var passport = require( 'passport' );
var Strategy = require( 'passport-local' ).Strategy;
var session = require( 'express-session' );
var body_parser = require( 'body-parser' );
var cookie_parser = require( 'cookie-parser' );
var db = require( './db' );
var port = process.env.PORT || 3000; // Grab port for AWS
var auth = require( './routes/auth' );

// Configure the local strategy
passport.use( new Strategy(
    function( username, password, cb ) {
        db.users.findByUsername( username, function( err, user ) {
            if ( err ) { return cb( err ); }
            if ( !user ) { return cb( null, false ); }
            if ( user.password != password ) { return cb( null, false ); }
            return cb( null, user );
        });
    }));


// Configure passport for sessions
passport.serializeUser(function( user, cb ) {
    cb( null, user.username );
});

passport.deserializeUser( function( username, cb ) {
    db.users.findByUsername( username, function ( err, user ) {
        if ( err ) { return cb( err ); }
        cb( null, user );
    });
});


var app = express();

app.use( require( 'morgan' )( 'combined' ) );
app.use( cookie_parser() );
app.use( body_parser.urlencoded( { extended: true } ));
app.use( session( {
    // TODO - Hide the secret in a private file.
    secret: 'HIDE_ME',
    resave: true,
    saveUninitialized: false
} ) );
app.use( passport.initialize() );
app.use( passport.session() );

// Routing
app.use( '/auth', auth );

app.get( '/',
    function( req, res ) {
        res.send( "Hello!" );
    });

app.listen( port );
