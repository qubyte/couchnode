describe('test set', function () {
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

    it('should store a string', function (done) {
        var testkey = '01-set.js';

        connection.set(testkey, 'bar', function (err, meta) {
            assert.ifError(err, 'Failed to store object.');
            assert.equal(testkey, meta.id, 'Callback called with wrong key!');

            firstmeta = meta;

            done();
        });
    });

    it('should set a string with CAS', function (done) {
        var testkey = '01-set.js';

        connection.set(testkey, 'baz', firstmeta, function (err, meta) {
            assert.ifError(err, 'Failed to set with CAS.');
            assert.equal(testkey, meta.id, 'Callback called with wrong key!');
            assert.notEqual(firstmeta.cas.str, meta.cas.str, 'CAS should change.');

            done();
        });
    });

    it('should error and not write with CAS mismatch', function (done) {
        var testkey = '01-set.js';

        connection.set(testkey, 'bam', firstmeta, function (err) {
            assert(err, 'Should error with cas mismatch.');

            connection.get(testkey, function (err, doc) {
                assert.ifError(err, 'Failed to load object.');
                assert.strictEqual('baz', doc, 'Document changed despite bad cas!');

                done();
            });
        });
    });

    it('should update key without CAS', function (done) {
        var testkey = '01-set.js2';

        connection.set(testkey, {foo : 'bar'}, function (err, meta) {
            assert.ifError(err, 'Failed to store object.');
            assert.deepEqual(testkey, meta.id, 'Callback called with wrong key!');

            connection.set(testkey, {foo : 'baz'}, function (err, meta) {
                assert.ifError(err, 'Failed to set without cas.');
                assert.deepEqual(testkey, meta.id, 'Callback called with wrong key!');

                done();
            });
        });
    });

    it('should set a very long string', function (done) {
        var testkey = '01-set-big.js';
        var longString = '';

        for (var i = 0; i < 8192; i++) {
            longString += '012345678\n';
        }

        connection.set(testkey, longString, function (err) {
            done(err);
        });
    });

    it('should set a key with a different hash key', function (done) {
        var testKey = { key : "01-hashkey-key.js", hashkey : "01-hashkey-hashkey.js" };

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
