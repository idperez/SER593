var express = require( 'express' );
var passport = require( 'passport' );
var Strategy = require( 'passport-local' ).Strategy;
var db = require( './db' );
var port = process.env.PORT || 3000; // Grab port for AWS


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

passport.deserializeUser( function( id, cb ) {
    db.users.findById( id, function ( err, user ) {
        if ( err ) { return cb( err ); }
        cb( null, user );
    });
});


var app = express();

app.use( require( 'morgan' )( 'combined' ) );
app.use( require( 'cookie-parser' )() );
app.use( require( 'body-parser' ).urlencoded( { extended: true } ));
app.use( require( 'express-session' )( { secret: 'keyboard cat', resave: false, saveUninitialized: false } ) );
app.use( passport.initialize() );
app.use( passport.session() );

app.get( '/',
    function( req, res ) {
        res.send( "Hello!" );
    });

app.get( '/loginfail',
    function( req, res ) {
        res.send( "Login failed." );
    });

app.post( '/login',
    passport.authenticate( 'local', { failureRedirect: '/loginfail' } ),
    function( req, res ) {
        res.send( "Logged in." );
    });
  
app.get( '/logout',
    function( req, res ){
        req.logout();
        res.redirect( '/' );
    });

app.listen( port );
