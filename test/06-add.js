describe('test add', function () {
    var couchbase = require(__dirname + '/../lib/couchbase.js');
    var assert = require('assert');
    
    var config;
    var connection;
    
    try {
        // try to require settings from file
        config = require(__dirname + '/config.json');
    } catch (e) {
        // default settings if the file was not available
        config = {
            hosts : [ 'localhost:8091' ],
            bucket : 'default'
        };
    }
    
    before(function (done) {
        couchbase.connect(config, function afterConnection(err, conn) {
            if (err) {
                return done(err);
            }

            connection = conn;
            done();
        });
    });

    // tests follow

    it('should add a key to the store', function (done) {
        var testkey = '06-add.js';

        // The test key may or may not exist. If not then we ignore the error.
        connection.remove(testkey, function(){

            connection.add(testkey, 'bar', function(err, meta) {
                assert(!err, 'Can add object at empty key');
                assert.strictEqual(testkey, meta.id, 'Callback called with wrong key!');

                // try to add existing key, should fail
                connection.add(testkey, 'baz', function (err, meta) {
                    assert(err, 'Can\'t add object at empty key');

                    done();
                });
            });
        });
    });
});