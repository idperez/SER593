let AWS = require( 'aws-sdk' );
AWS.config.update( { region:'us-west-2' } );

let ddb = new AWS.DynamoDB( { apiVersion: '2012-08-10' } );
const TABLE_NAME = 'topia_profiles';

exports.findByUsername = ( username, cb ) => {
    process.nextTick( () => {
        ddb.getItem( {
            TableName: TABLE_NAME,
            Key:{
                "username": {
                    S: username
                }
            }
        }, ( err, data ) => {
            if ( err ) {
                return cb( err, null );
            } else if ( data.Item ){
                let record = {
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

exports.addNewUser = ( user, cb ) => {
    process.nextTick( () => {
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
        }, ( err, data ) => {
            if ( err ) {
                return cb( err );
            } else {
                return cb( null, data );
            }
        });
    });
};
