describe('test prepend and append', function () {
    var assert = require('assert');
    var setup = require(__dirname + '/setup');
    var connection;
    var keysUsed = [];

    function devNull() {}

    before(function (done) {
        setup.connect(function (err, conn) {
            if (err) {
                return done(err);
            }

            connection = conn;

            var appendKey = 'Append';
            var prependKey = 'Prepend';

            connection.append(appendKey, 'will not work', function (err, meta) {
                assert(err, 'key must exist before append will work');
                assert.strictEqual(appendKey, meta.id, 'callback called with wrong key');

                connection.append(prependKey, 'will not work', function (err, meta) {
                    assert(err, 'key must exist before prepend will work');
                    assert.strictEqual(prependKey, meta.id, 'callback called with wrong key');

                    done();
                });
            });
        });
    });

    after(function (done) {
        keysUsed.forEach(function (key) {
            connection.remove(key, devNull);
        });

        done();
    });

    // tests follow

    it('should test append without CAS', function (done) {
        var key = 'metaWithoutCasAppend';
        keysUsed.push(key);

        // Set a key to work with.
        connection.set(key, 'foo', function (err) {
            assert.ifError(err, 'failed to set key');

            // Append to the value of key without meta.
            connection.append(key, 'bar', {}, function (err) {
                assert.ifError(err, 'failed to append');

                // Get the doc back and verify the result.
                connection.get(key, function (err, doc) {
                    assert.ifError(err, 'failed to get');
                    assert.strictEqual(doc, 'foobar', 'append resulted in wrong value');

                    done();
                });
            });
        });
    });

    it('should test prepend without CAS', function (done) {
        var key = 'metaWithoutCasPrepend';
        keysUsed.push(key);

        // Set a key to work with.
        connection.set(key, 'foo', function (err) {
            assert.ifError(err, 'failed to set key');

            // Prepend to the value of key without meta.
            connection.prepend(key, 'bar', {}, function (err) {
                assert.ifError(err, 'failed to append');

                // Get the doc back and verify the result.
                connection.get(key, function (err, doc) {
                    assert.ifError(err, 'failed to get');
                    assert.strictEqual(doc, 'barfoo', 'prepend resulted in wrong value');

                    done();
                });
            });
        });
    });

    it('should test append with CAS', function (done) {
        var key = 'metaWithCasAppend';
        keysUsed.push(key);

        // Set a key to work with.
        connection.set(key, 'foo', function (err, meta) {
            assert.ifError(err, 'failed to set key');

            // Append to the value of key using previous meta.
            connection.append(key, 'bar', meta, function (err) {
                assert.ifError(err, 'failed to append');

                // Get the doc back and verify the result.
                connection.get(key, function (err, doc) {
                    assert.ifError(err, 'failed to get');
                    assert.strictEqual(doc, 'foobar', 'append with CAS resulted in wrong value');

                    done();
                });
            });
        });
    });

    it('should test prepend with CAS', function (done) {
        var key = 'metaWithCasPrepend';
        keysUsed.push(key);

        // Set a key to work with.
        connection.set(key, 'foo', function (err, meta) {
            assert.ifError(err, 'failed to set key');

            // Prepend to the value of key using previous meta.
            connection.prepend(key, 'bar', meta, function (err) {
                assert.ifError(err, 'failed to append');

                // Get the doc back and verify the result.
                connection.get(key, function (err, doc) {
                    assert.ifError(err, 'failed to get');
                    assert.strictEqual(doc, 'barfoo', 'prepend with CAS resulted in wrong value');

                    done();
                });
            });
        });
    });

    it('should test append with wrong CAS', function (done) {
        var key = 'wrongCasAppend';
        keysUsed.push(key);

        // Set a key to work with.
        connection.set(key, 'wrongCas', function (err, wrongMeta) {
            assert.ifError(err, 'failed to set key');

            // Reset the key.
            connection.set(key, 'foo', function (err) {
                assert.ifError(err, 'failed to set key');

                // Attempt to append to the value of key using the first meta.
                connection.append(key, 'bar', wrongMeta, function (err) {
                    assert(err, 'should fail to append');

                    // Get the doc back and verify the result.
                    connection.get(key, function (err, doc) {
                        assert.ifError(err, 'failed to get');
                        assert.strictEqual(doc, 'foo', 'failed append resulted in wrong value');
    
                        done();
                    });
                });
            });
        });
    });

    it('should test prepend with wrong CAS', function (done) {
        var key = 'wrongCasPrepend';
        keysUsed.push(key);

        // Set a key to work with.
        connection.set(key, 'wrongCas', function (err, wrongMeta) {
            assert.ifError(err, 'failed to set key');

            // Reset the key.
            connection.set(key, 'foo', function (err) {
                assert.ifError(err, 'failed to set key');

                // Attempt to prepend to the value of key using the first meta.
                connection.prepend(key, 'bar', wrongMeta, function (err) {
                    assert(err, 'should fail to append');

                    // Get the doc back and verify the result.
                    connection.get(key, function (err, doc) {
                        assert.ifError(err, 'failed to get');
                        assert.strictEqual(doc, 'foo', 'failed prepend resulted in wrong value');
    
                        done();
                    });
                });
            });
        });
    });
});