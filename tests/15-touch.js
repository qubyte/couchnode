describe('test touch', function () {
    var assert = require('assert');
    var setup = require('./setup');
    var connection;
    var firstmeta;

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

    it('should invalidate a string after 1 second', function (done) {
        this.timeout(10000);
        var testkey = '15-touch.js';

        connection.set(testkey, 'bar', function (err, meta) {
            assert.ifError(err, 'Failed to store object.');
            assert.equal(testkey, meta.id, 'Callback called with wrong key!');

            firstmeta = meta;

            connection.touch(testkey, 1, function (err) {
                assert.ifError(err, 'Failed to touch object.');

                connection.get(testkey, function (err) {
                    assert.ifError(err, 'Invalidation should happen after 1 second');

                    setTimeout(function () {
                        connection.get(testkey, function (err) {
                            assert.ok(err, 'Key should have been invalidated.');
                            assert.strictEqual(err.message, "No such key", 'Wrong error returned: ' + err);

                            done();
                        });
                    }, 5000);
                });
            });
        });
    });
});
