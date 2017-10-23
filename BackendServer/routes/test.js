// Test file for development
const express = require( 'express' );
const router = express.Router();
const users = require( "../db/users" );

router.get('/getuserprofilebyprimarykey', ( req, res ) => {
    users.getUserProfileByPrimaryKey( req.query.primkey, req.query.value ).then( user => {
        res.send( user );
    }).catch( err => {
        res.send( err );
    })
});

router.get('/getuserprofile', ( req, res ) => {
    users.getUserProfileByPrimaryKey( req.query.username ).then( user => {
        res.send( user );
    }).catch( err => {
        res.send( err );
    })
});

module.exports = router;