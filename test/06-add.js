describe('test add', function () {
    var assert = require('assert');
    var setup = require(__dirname + '/setup');
    var connection;
    var testkey = '06-add.js';

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

    it('should add a key to the store', function (done) {
        connection.add(testkey, 'bar', function(err, meta) {
            assert.ifError(err, 'Can add object at empty key');
            assert.strictEqual(testkey, meta.id, 'Callback called with wrong key!');

            // try to add existing key, should fail
            connection.add(testkey, 'baz', function (err, meta) {
                assert(err, 'Can\'t add object at empty key');

                done();
            });
        });
    });
});