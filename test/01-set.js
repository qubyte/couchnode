describe('test set', function () {
    var couchbase = require(__dirname + '/../lib/couchbase.js');
    var assert = require('assert');
    
    var config;
    var connection;
    var firstmeta;

    var testkey = "01-set.js";
    var testkey2 = "01-set.js2";
    
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

    it('should store a string', function (done) {
        connection.set(testkey, "bar", function (err, meta) {
            assert(!err, "Failed to store object");
            assert.equal(testkey, meta.id, "Callback called with wrong key!");

            firstmeta = meta;

            done();
        });
    });

    it('should set a string with CAS', function (done) {
        connection.set(testkey, "baz", firstmeta, function(err, meta) {
            assert(!err, "Failed to set with cas");
            assert.equal(testkey, meta.id, "Callback called with wrong key!")
            assert.notEqual(firstmeta.cas.str, meta.cas.str, "cas should change");

            done();
        });
    });

    it('should error and not write with CAS mismatch', function (done) {
        connection.set(testkey, "bam", firstmeta, function(err, meta) {
            assert(err, "Should error with cas mismatch");

            connection.get(testkey, function(err, doc) {
                assert(!err, "Failed to load object");
                assert.strictEqual("baz", doc, "Document changed despite bad cas!")

                done();
            });
        });
    });

    it('should update key without CAS', function (done) {
        connection.set(testkey2, {foo : "bar"}, function (err, meta) {
            assert(!err, "Failed to store object");
            assert.deepEqual(testkey2, meta.id, "Callback called with wrong key!");

            connection.set(testkey2, {foo : "baz"}, function(err, meta) {
                assert(!err, "Failed to set without cas");
                assert.deepEqual(testkey2, meta.id, "Callback called with wrong key!");

                done();
            })
        });
    })
});
