var AWS = require( 'aws-sdk' );
AWS.config.update( { region:'us-west-2' } );

var ddb = new AWS.DynamoDB( { apiVersion: '2012-08-10' } );
const TABLE_NAME = 'topia_profiles';

exports.findByUsername = function( username, cb ) {
    process.nextTick( function() {
        ddb.getItem( {
            TableName: TABLE_NAME,
            Key:{
                "username": {
                    S: username
                }
            }
        }, function( err, data ) {
            if ( err ) {
                return cb( err, null );
            } else if ( data.Item ){
                var record = {
                    username: data.Item.username.S,
                    password: data.Item.pw.S
                };
                return cb( null, record );
            } else {
                return cb( null, null ); // If not found, return nothing.
            }
        });
    });
};

exports.addNewUser = function( user, cb ) {
    process.nextTick( function() {
        ddb.putItem( {
            TableName: TABLE_NAME,
            Item:{
                "username": {
                    S: user.username
                },
                "pw": {
                    S: user.password
                }
            }
        }, function( err, data ) {
            if ( err ) {
                return cb( err );
            } else {
                return cb( null, data );
            }
        });
    });
};
