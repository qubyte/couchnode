describe('test replace', function () {
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
    
    console.log(config);

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

    it('should replace a key in the store', function (done) {
        var testkey = '05-replace.js';

        // The test key may or may not exist. If not then we ignore the error.
        couchbase.remove(testkey, function () {

            couchbase.replace(testkey, 'bar', function(err, meta) {
                assert(err, 'Can\'t replace object that is already removed');

                couchbase.set(testkey, 'bar', function (err, meta) {
                    assert(!err, 'Failed to store object');

                    couchbase.replace(testkey, 'bazz', function (err, meta) {
                        assert(!err, 'Failed to replace object');

                        couchbase.get(testkey, function (err, doc) {
                            assert(!err, 'Failed to get object');
                            assert.strictEqual('bazz', doc, 'Replace didn\'t work');

                            done();
                        });
                    });
                });
            });
        });
    });
});