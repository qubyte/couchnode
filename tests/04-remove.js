describe('test remove', function () {
    var assert = require('assert');
    var setup = require('./setup');
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

    it('should remove a key from the store', function (done) {
        var testkey = '04-remove.js';

        connection.set(testkey, 'bar', function (err, meta) {
            assert.ifError(err, 'Failed to store object.');
            assert.strictEqual(testkey, meta.id, 'Get callback called with wrong key!');

            var cas = meta.cas;

            connection.remove(testkey, function (err, meta) {
                assert.ifError(err, 'Failed to remove object.');
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