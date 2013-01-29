describe('test endure', function () {
    var assert = require('assert');
    var setup = require(__dirname + '/setup');
    var connection;
    var testKey = '12-endure.js';
    var endureOpts = {
        persisted: 1,
        replicated: 0
    };

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

    it('should endure', function (done) {
		connection.set(testKey, 'bar', function (err) {
            assert.ifError(err, 'failed to store object');

            connection.endure(testKey, endureOpts, function (err, meta) {
                assert.ifError(err, 'failed to complete endure');
                assert(meta);

                done();
            });
        });
    });
});