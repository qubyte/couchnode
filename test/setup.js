var couchbase = require(__dirname + '/../lib/couchbase.js');
var connection;
var config;

function connect(callback) {
    // If the connection has already been established, callback immediately.
    if (connection) {
        return callback(null, connection);
    }

    // If there is no connection yet, read from a config file or use default settings.
    try {
        config = require(__dirname + '/config.json');
        console.log('using config file:', config);
    } catch (e) {
        config = { hosts : [ 'localhost:8091' ], bucket : 'default' };
        console.log('using default config:', config);
    }

    // Establish the connection to couchbase.
    couchbase.connect(config, function afterConnection(err, conn) {
        if (err) {
            return callback(err);
        }

        connection = conn;

        callback(null, connection);
    });
}

exports.connect = connect;