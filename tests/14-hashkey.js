describe('test args', function () {
    var assert = require('assert');
    var setup = require('./setup');
    var connection;
    var testKey = { key: "14-key.js", hashkey: "14-hashkey.js" };

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

    it('should set and get a key with a different hash key', function (done) {
        connection.set(testKey, 'bar', function (err, meta) {
            assert.ifError(err, 'failed to store object');
            assert.strictEqual(testKey.key, meta.id, 'callback with wrong key');

            connection.get(testKey, function (err, doc, meta) {
                assert.strictEqual(testKey.key, meta.id, 'callback called with wrong key');
                assert.strictEqual('bar', doc, 'callback called with wrong value');

                done();
            });
        });
    });
});