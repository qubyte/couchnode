describe('test args', function () {
    var couchbase = require(__dirname + '/../lib/couchbase.js');
    var assert = require('assert');
    
    var config;
    var connection;
    
    try {
        // try to require settings from file
        config = require(__dirname + '/config.json');
    } catch (e) {
        // default settings if the file was not available
        config = {
            hosts : [ "localhost:8091" ],
            bucket : "default"
        };
    }
    
    console.log(config);

    before(function (done) {
        couchbase.connect(config, function afterConnection(err, conn) {
            if (err) {
                return done(err);
            }

            connection = conn;
            done();
        });
    });

    // tests follow

    it('correct get', function () {
        assert.doesNotThrow(function () {
            connection.get('correct get', function () {});
        });
    });
    
    it('correct set', function () {
        assert.doesNotThrow(function () {
            connection.set('correct set', 'someValue', function () {});
        });
    });

    it('falsy values for CAS and exp should not throw', function () {
        assert.doesNotThrow(function() {
            [null, undefined, 0, false].forEach(function (fv) {
                connection.set("has falsy meta", "value", {cas : fv, exp : fv}, function () {});
            });
        });
    });

    it('bad get arguments should throw', function () {
        assert.throws(function() {
            connection.get("needs callback");
        });
    });

    it('bad set arguments should throw', function () {
        assert.throws(function() {
            cb.set("needs callback");
        });
    });
});
