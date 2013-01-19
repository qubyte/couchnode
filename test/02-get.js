describe('test set', function () {
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

    it('should get correct string after reset', function (done) {
        var testkey = "01-set.js";

        connection.set(testkey, "{bar}", function (err, meta) {
            assert(!err, "Failed to store object");
            assert.equal(testkey1, meta.id, "Callback called with wrong key!");

            connection.get(testkey, function (err, doc, meta) {
                assert(!err, "Failed to get object");
                assert.strictEqual(testkey1, meta.id, "Callback called with wrong key!");
                assert.strictEqual("{bar}", doc, "Callback called with wrong value!");

                connection.set(testkey, "bam", meta, function (err, meta) {
                    assert(!err, "Failed to set with cas");
                    assert.strictEqual(testkey1, meta.id, "Callback called with wrong key!");

                    connection.get(testkey, function (err, doc, meta) {
                        assert(!err, "Failed to get object");
                        assert.strictEqual("bam", doc, "Callback called with wrong value!");

                        done();
                    });
                });
            });
        });
    });

    it('should get an object', function (done) {
        var testkey = "01-set.js2";
        var testObject = {foo : "bar"};

        connection.set(testkey, testObject, function (err, meta) {
            assert(!err, "Failed to store object");
            assert.strictEqual(testkey2, meta.id, "Callback called with wrong key!");

            connection.get(testkey, function (err, doc, meta) {
                assert(!err, "Failed to get object");
                assert.strictEqual(testkey2, meta.id, "Callback called with wrong key!");
                assert.deepEqual(testObject, doc, "JSON values should be converted back to objects");

                done();
            });
        });
    });

    it('should get an array', function (done) {
        var testkey = "02-get.js3";
        var testArray = [1, "2", true];

        connection.set(testkey, testArray, function (err, meta) {
            assert(!err, "Failed to store object");
            assert.strictEqual(testkey, meta.id, "Callback called with wrong key!");

            connection.get(testkey, function (err, doc, meta) {
                assert(!err, "Failed to get object");
                assert.strictEqual(testkey, meta.id, "Callback called with wrong key!");
                assert.deepEqual(testArray, doc, "JSON values should be converted back to objects");
                assert(Array.isArray(doc), 'Recovered document should be an array.');

                done();
            });
        });
    });

    it('should get an array with unicode member', function (done) {
        var testkey = "get-test-4";
        var testObject = ['☆'];

        cb.set(testkey, testObject, function (err, meta) {
            assert(!err, "Failed to store object");
            assert.strictEqual(testkey, meta.id, "Callback called with wrong key!");

            cb.get(testkey, function (err, doc, meta) {
                assert(!err, "Failed to get object");
                assert.strictEqual(testkey, meta.id, "Callback called with wrong key!");
                assert.deepEqual(testObject, doc, "JSON values should be converted back to objects");
                assert(Array.isArray(doc), "Recovered document should be an array");
                
                done();
            });
        });
    });

    it('should get a string with unicode member', function (done) {
        var testkey = "get-test-5";
        var testString = '☆';

        cb.set(testkey, testString, function (err, meta) {
            assert(!err, "Failed to store object");
            assert.strictEqual(testkey, meta.id, "Callback called with wrong key!");

            cb.get(testkey, function (err, doc, meta) {
                assert(!err, "Failed to get object");
                assert.strictEqual(testkey, meta.id, "Callback called with wrong key!");
                assert.strictEqual(testString, doc, "Unicode characters should round trip.");

                done();
            });
        });
    });
});