describe('test args', function () {
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

    function devNull() {} // Throw it on the ground.

    it('correct get', function () {
        assert.doesNotThrow(function () {
            connection.get('correct get', devNull);
        });
    });
    
    it('correct set', function () {
        assert.doesNotThrow(function () {
            connection.set('correct set', 'someValue', devNull);
        });
    });

    it('falsy values for CAS and exp should not throw', function () {
        assert.doesNotThrow(function() {
            [null, undefined, 0, false].forEach(function (fv) {
                connection.set('has falsy meta', 'value', {cas : fv, exp : fv}, devNull);
            });
        });
    });

    it('bad get arguments should throw', function () {
        assert.throws(function () {
            connection.get('needs callback');
        });
    });

    it('bad set arguments should throw', function () {
        assert.throws(function () {
            cb.set('needs callback');
        });
    });
});
