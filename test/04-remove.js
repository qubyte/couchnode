describe('test remove', function () {
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

    it('should remove a key from the store', function (done) {
        var testkey = "04-remove.js"

        connection.set(testkey, 'bar', function (err, meta) {
            assert(!err, 'Failed to store object.');
            assert.strictEqual(testkey, meta.id, 'Get callback called with wrong key!');
            
            var cas = meta.cas;

            connection.remove(testkey, function (err, meta) {
                assert(!err, 'Failed to remove object.');
                assert.strictEqual(testkey, meta.id, 'Remove existing called with wrong key!');

                connection.remove(testkey, function (err, meta) {
                    assert(err, 'Can\'t remove object that is already removed.');
                    assert.strictEqual(testkey, meta.id, 'Remove missing called with wrong key!');
                    assert.notStrictEqual(cas, meta.cas);

                    done();
                });
            });
        });
    });
});