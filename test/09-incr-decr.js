describe('test increment and decrement', function () {
    var assert = require('assert');
    var setup = require(__dirname + '/setup');
    var connection;

    var testKeys = [
        '09-incr-decr.js',
        '09-incr-decr.js2',
        '09-incr-decr.js3',
        '09-incr-decr.js4',
        '09-incr-decr.js5',
        '09-incr-decr.js6'
    ];

    function devNull() {}

    before(function (done) {
        setup.connect(function (err, conn) {
            if (err) {
                return done(err);
            }

            connection = conn;
            
            // Remove keys that we will use. Ignore errors.
            testKeys.forEach(function (key) {
                connection.remove(key, devNull);
            });

            done();
        });
    });

    // tests follow

    it('should increment and decrement a key with no parameter', function (done) {
        var testKey = testKeys[0];

        connection.incr(testKey, function (err, value, meta) {
            assert.strictEqual(value, 0, 'default increment 1st call: expected 0 but got ' + value);

            connection.incr(testKey, function (err, value, meta) {
                assert.strictEqual(value, 1, 'default increment 2nd call: expected 1 but got ' + value);

                connection.incr(testKey, function (err, value, meta) {
                    assert.strictEqual(value, 2, 'default increment 3nd call: expected 2 but got ' + value);

                    connection.decr(testKey, function (err, value, meta) {
                        assert.strictEqual(value, 1, 'default decrement: expected 1 but got ' + value);

                        done();
                    });
                });
            });
        });
    });

    it('should increment and decrement with offset parameter', function (done) {
        var testKey = testKeys[1];

        connection.incr(testKey, { offset : 10 }, function (err, value, meta){
            assert.ifError(err, 'failed to increment');
            assert.equal(value, 0, 'Default increment 1st call with 10: expected 0 but got '+ value);
    
            connection.incr(testKey, { offset : 10 }, function (err, value, meta){
                assert.ifError(err, 'failed to increment');
                assert.equal(value, 10,  'Default increment 2nd call with 10: expected 10 but got '+ value);
    
                connection.incr(testKey, { offset : 5 }, function (err, value, meta){
                    assert.ifError(err, 'failed to increment');
                    assert.equal(value, 15, 'Default increment 3rd call with 5: expected 15 but got '+ value);
    
                    connection.decr(testKey, { offset : 10 }, function (err, value, meta){
                        assert.ifError(err, 'failed to decrement');
                        assert.equal(value, 5, 'Default decrement with 10: expected 5 but got '+ value);
                        
                        done();
                    });
                });
            });
        });
    });

    it('should increment with default value', function (done) {
        var testKey = testKeys[2];

        connection.incr(testKey,  { defaultValue : 100 }, function (err, value, meta){
            assert.ifError(err, 'failed to increment');
            assert.strictEqual(value, 100, 'Default increment test default value: expected 100 but got ' + value);
            
            done();
        });
    });

    it('should decrement with default value', function (done) {
        var testKey = testKeys[3];

        connection.decr(testKey, { defaultValue: 100 }, function (err, value, meta) {
            assert.ifError(err, 'failed to decrement');
            assert.strictEqual(value, 100, 'Default increment test default value: expected 100 but got ' + value);

            connection.decr(testKey, { offset: 90 }, function (err, value, meta) {
                assert.ifError(err, 'failed to decrement');
                assert.strictEqual(value, 10, 'Default decrement test default value: expected 10 but got ' + value);

                done();
            });
        });
    });

    it('should incrememnt with expiry', function (done) {
        var testKey = testKeys[4];

        connection.incr(testKey, { expiry: 5 }, function (err, value, meta) {
            assert.ifError(err, 'failed to increment');
            assert.strictEqual(value, 0, 'Default increment test default value: expected 0 but got ' + value);

            done();
        });
    });

    it('should decrement with expiry', function (done) {
        var testKey = testKeys[5];

        connection.decr(testKey, { defaultValue: 50, expiry: 5 }, function (err, value, meta) {
            assert.ifError(err, 'failed to decrement');
            assert.strictEqual(value, 50, 'Default increment test default value: expected 50 but got ' + value);

            done();
        });
    });
});