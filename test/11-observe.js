describe('test observe', function () {
    var assert = require('assert');
    var setup = require(__dirname + '/setup');
    var connection;
    var testKey = '11-observe.js';
    var calledTimes = 0;

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

    it('should observe', function (done) {
        connection.set(testKey, 'bar', function (err, meta) {
            assert.ifError(err, 'failed to store object');
    
            connection.observe(testKey, function (err, meta) {
                assert.ifError(err, 'failed to observe data');
                calledTimes += 1;

                if (calledTimes === 1) {
                    // First callback should not be the terminator.
                    assert(meta, 'invalid observe data');
                    return;
                }

                if (meta) { // If we got here then it was a replica.
                    return;
                }

                done();
            });
        });
    });
});