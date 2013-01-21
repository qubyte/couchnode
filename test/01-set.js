describe('test set', function () {
    var assert = require('assert');
    var setup = require(__dirname + '/setup');
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
            assert(!err, 'Failed to store object.');
            assert.equal(testkey, meta.id, 'Callback called with wrong key!');

            firstmeta = meta;

            done();
        });
    });

    it('should set a string with CAS', function (done) {
        var testkey = '01-set.js';

        connection.set(testkey, 'baz', firstmeta, function(err, meta) {
            assert(!err, 'Failed to set with CAS.');
            assert.equal(testkey, meta.id, 'Callback called with wrong key!');
            assert.notEqual(firstmeta.cas.str, meta.cas.str, 'CAS should change.');

            done();
        });
    });

    it('should error and not write with CAS mismatch', function (done) {
        var testkey = '01-set.js';

        connection.set(testkey, 'bam', firstmeta, function(err, meta) {
            assert(err, 'Should error with cas mismatch.');

            connection.get(testkey, function(err, doc) {
                assert(!err, 'Failed to load object.');
                assert.strictEqual('baz', doc, 'Document changed despite bad cas!');

                done();
            });
        });
    });

    it('should update key without CAS', function (done) {
        var testkey = '01-set.js2';

        connection.set(testkey, {foo : 'bar'}, function (err, meta) {
            assert(!err, 'Failed to store object.');
            assert.deepEqual(testkey, meta.id, 'Callback called with wrong key!');

            connection.set(testkey, {foo : 'baz'}, function(err, meta) {
                assert(!err, 'Failed to set without cas.');
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

        connection.set(testkey, longString, function (err, firstmeta) {
            assert(!err, 'Failed to store long string.');
            
            done();
        });
    });
});
