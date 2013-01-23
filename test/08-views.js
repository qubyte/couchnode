describe('test views', function () {
    var assert = require('assert');
    var setup = require(__dirname + '/setup');
    var connection;

    var testKey = '08-views.js';
    var designDocKey = 'dev_test-design';
    var designDoc = {
        "views": {
            "testView": {
                "map": "function(doc,meta){emit(meta.id)}"
            }
        }
    };

    before(function (done) {
        setup.connect(function (err, conn) {
            if (err) {
                return done(err);
            }

            connection = conn;

            // Remove design doc if it exists. Deliberately ignore errors.
            connection.deleteDesignDoc(designDocKey, function() {
                done();
            });
        });
    });

    // Remove the design doc after the tests.
    after(function (done) {
        connection.deleteDesignDoc(designDocKey, done);
    });

    // tests follow

    // Set a new key.
    it('should create a view and query it', function (done) {
        connection.set(testKey, 'bar', function (err, meta) {
            assert.ifError(err, 'failed to store object.');
            assert.strictEqual(meta.id, testKey, 'set callback called with wrong key');
    
            connection.get(testKey, function (err, doc, meta) {
                assert.ifError(err, 'failed to get doc');
                assert.strictEqual(meta.id, testKey, 'get callback called with wrong key');
    
                connection.setDesignDoc(designDocKey, designDoc, function (err, meta, data) {
                    assert.ifError(err, 'error creating design doc');
    
                    // now lets find our key in the view. We need to add stale=false in order to
                    // force the view to be generated (since we're trying to look for our key and it
                    // may not be in the view yet due to race conditions..
                    var params = {
                        key : testKey,
                        stale : 'false'
                    };

                    // Wrap this in a timeout to give the view time to work.
                    setTimeout(function () {
                        connection.view(designDocKey, 'testView', params, function (err, code, view) {
                            assert.ifError(err, 'error fetching view');
                            assert.strictEqual(code, 200, 'error fetching view');
        
                            var json = JSON.parse(view);
                            var rows = json.rows;
                            
                            assert.strictEqual(rows.length, 1, 'got wrong number of rows');
                            assert.strictEqual(testKey, rows[0].key, 'got wrong data from row');
        
                            done();
                        });
                    }, 5000);
                });
            });
        });
    });
});
