describe('test replace', function () {
    var assert = require('assert');
    var setup = require('./setup');
    var connection;
    var testkey = '05-replace.js';

    before(function (done) {
        setup.connect(function (err, conn) {
            if (err) {
                return done(err);
            }

            connection = conn;

            // Unconditional removal, so we don't care about errors.
            connection.remove(testkey, function () {
                done();
            });
        });
    });

    // tests follow

    it('should replace a key in the store', function (done) {
        connection.replace(testkey, 'bar', function (err) {
            assert(err, 'Can\'t replace object that is already removed');

            connection.set(testkey, 'bar', function (err) {
                assert.ifError(err, 'Failed to store object');

                connection.replace(testkey, 'bazz', function (err) {
                    assert.ifError(err, 'Failed to replace object');

                    connection.get(testkey, function (err, doc) {
                        assert.ifError(err, 'Failed to get object');
                        assert.strictEqual('bazz', doc, 'Replace didn\'t work');

                        done();
                    });
                });
            });
        });
    });
});