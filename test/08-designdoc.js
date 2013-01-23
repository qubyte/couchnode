describe('test design doc', function () {
    var assert = require('assert');
    var setup = require(__dirname + '/setup');
    var connection;
    
    var docName = 'dev_ddoc-test';
    var designDoc = {
        'views': {
            'test-view': {
                'map': 'function(doc,meta){emit(meta.id)}'
            }
        }
    };

    before(function (done) {
        setup.connect(function (err, conn) {
            if (err) {
                return done(err);
            }

            connection = conn;

            // Remove any existing design doc. Deliberately ignore error if it did not exist.
            connection.deleteDesignDoc(docName, function () {
                done();
            });
        });
    });

    // tests follow
    
    it('should write and retrieve and delete a new design doc', function (done) {
        connection.setDesignDoc(docName, designDoc, function (err, code, data) {
            assert.ifError(err, 'error creating design document');
            assert.strictEqual(code, 201, 'error creating design document');
    
            // Get the design doc back.
            connection.getDesignDoc(docName, function (err, code, data) {
                assert.ifError(err, 'error getting design document: ' + err);
                assert.strictEqual(code, 200, 'error getting design document');
                assert.deepEqual(JSON.parse(data), designDoc, 'design doc retrieved was not the same as that set');

                // Delete the design document and check for success.
                connection.deleteDesignDoc(docName, function (err, code, data) {
                    assert.ifError(err, 'Failed deleting design document');

                    done();
                });
            });
        });
    });
});
