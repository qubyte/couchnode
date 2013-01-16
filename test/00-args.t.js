
    

describe('test args', function () {
    var couchbase = require(__dirname + '/../lib/couchbase.js');
    var assert = require('assert');
    
    var config;
    var connection;
    
    try {
        // try to require settings from file
        config = require(__dirname + '/config.json');
    } catch (e) {
        // default settings
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

    
    it('correct get', function () {
        assert.doesNotThrow(function() {
            connection.get('key1', function () {});
        });
    });
    
});




/*


setup.plan(7);

setup(function(err, cb) {
    assert(!err, "setup failure");

    cb.on("error", function (message) {
        console.log("ERROR: [" + message + "]");
        process.exit(1);
    });

    // things that should work
    assert.doesNotThrow(function() {
        cb.get("has callback", setup.end);
    });

    assert.doesNotThrow(function() {
        cb.set("has callback", "value", setup.end);
    });

    assert.doesNotThrow(function() {
        // falsy values for CAS and exp
        [null, undefined, 0, false].forEach(function(fv) {
            cb.set("has falsy meta", "value", {cas : fv, exp : fv}, setup.end);
        });
    });

    // things that should error
    assert.throws(function() {
        cb.get("needs callback");
    });

    assert.throws(function() {
        cb.set("needs callback");
    });

    setup.end();
});

*/
