describe('test add', function () {
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

    it('should add a key to the store', function (done) {
        var testkey = '06-add.js';

        // The test key may or may not exist. If not then we ignore the error.
        connection.remove(testkey, function(){

            connection.add(testkey, 'bar', function(err, meta) {
                assert(!err, 'Can add object at empty key');
                assert.strictEqual(testkey, meta.id, 'Callback called with wrong key!');

                // try to add existing key, should fail
                connection.add(testkey, 'baz', function (err, meta) {
                    assert(err, 'Can\'t add object at empty key');

                    done();
                });
            });
        });
    });
});