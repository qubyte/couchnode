describe('test set', function () {
    var couchbase = require(__dirname + '/../lib/couchbase.js');
    var assert = require('assert');
    
    var config;
    var connection;

    var testkey1 = "01-set.js";
    var testkey2 = "01-set.js2";
    var testkey3 = "02-get.js3";
    
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
        connection.set(testkey1, "{bar}", function (err, meta) {
            assert(!err, "Failed to store object");
            assert.equal(testkey1, meta.id, "Callback called with wrong key!");

            connection.get(testkey1, function (err, doc, meta) {
                assert.strictEqual(testkey1, meta.id, "Callback called with wrong key!");
                assert.strictEqual("{bar}", doc, "Callback called with wrong value!");

                connection.set(testkey1, "bam", meta, function (err, meta) {
                    assert(!err, "Failed to set with cas");
                    assert.strictEqual(testkey1, meta.id, "Callback called with wrong key!");

                    connection.get(testkey1, function (err, doc, meta) {
                        assert(!err, "Failed to get");
                        assert.strictEqual("bam", doc, "Callback called with wrong value!");

                        done();
                    });
                });
            });
        });
    });

    it('should get an object', function (done) {
        var testObject = {foo : "bar"};

        connection.set(testkey2, testObject, function (err, meta) {
            assert(!err, "Failed to store object");
            assert.strictEqual(testkey2, meta.id, "Callback called with wrong key!");

            connection.get(testkey2, function (err, doc, meta) {
                assert.strictEqual(testkey2, meta.id, "Callback called with wrong key!");
                assert.deepEqual(testObject, doc, "JSON values should be converted back to objects");

                done();
            });
        });
    });

    it('should get an array', function (done) {
        var testArray = [1, "2", true];

        connection.set(testkey3, testArray, function (err, meta) {
            assert(!err, "Failed to store object");
            assert.equal(testkey3, meta.id, "Callback called with wrong key!");

            connection.get(testkey3, function (err, doc, meta) {
                assert.strictEqual(testkey3, meta.id, "Callback called with wrong key!");
                assert.deepEqual(testArray, doc, "JSON values should be converted back to objects");
                assert(Array.isArray(doc), 'Recovered document should be an array.');

                done();
            });
        });
    });
});