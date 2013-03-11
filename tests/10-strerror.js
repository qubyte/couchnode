describe('test errors', function () {
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

    it('should note crash with invalid error code', function (done) {
        assert.doesNotThrow(function () {
            connection.strError(1000);
        });

        done();
    });

    it('should get the correct error string', function (done) {
        assert.strictEqual(connection.strError(0), 'Success', 'Error strings not being returned correctly');

        done();
    });
});