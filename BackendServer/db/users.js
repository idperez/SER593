var records = [
    { 
        username: 'doug', 
        password: 'passwrd' 
    },
    { 
        username: 'isidro', 
        password: 'testpwd'
    }
];

exports.findByUsername = function( username, cb ) {
    process.nextTick( function() {
        for ( var i = 0, len = records.length; i < len; i++ ) {
            var record = records[i];
            if ( record.username === username ) {
                return cb( null, record );
            }
        }
        return cb( null, null );
    });
};
