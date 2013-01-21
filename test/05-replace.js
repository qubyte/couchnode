describe('test replace', function () {
    var assert = require('assert');
    var setup = require(__dirname + '/setup');
    var connection;

    before(function (done) {
        setup.connect(function (err, conn) {
            if (err) {
                return done(err);
            }

            connection = conn;
            done();
        });
    });

    // tests follow

    // tests follow

    it('should replace a key in the store', function (done) {
        var testkey = '05-replace.js';

        // The test key may or may not exist. If not then we ignore the error.
        connection.remove(testkey, function () {

            connection.replace(testkey, 'bar', function(err, meta) {
                assert(err, 'Can\'t replace object that is already removed');

                connection.set(testkey, 'bar', function (err, meta) {
                    assert(!err, 'Failed to store object');

                    connection.replace(testkey, 'bazz', function (err, meta) {
                        assert(!err, 'Failed to replace object');

                        connection.get(testkey, function (err, doc) {
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