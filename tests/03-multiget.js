describe('test multiple get', function () {
    var assert = require('assert');
    var setup = require('./setup');
    var connection;

    // Simple asynchronous forEach.
    function forEachSeries(list, func, callback) {
        var listCopy = list.slice(0);

        function doOne(err) {
            if (err) {
                return callback(err);
            }

            if (listCopy.length === 0) {
                return callback();
            }

            var thisElem = listCopy.shift();
            func(thisElem, doOne);
        }

        doOne();
    }

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

    it('should get multiple items with an array of keys', function (done) {
        var keys = ['key0', 'key1', 'key2', 'key3', 'key4', 'key5', 'key6', 'key7', 'key8', 'key9'];

        var getCounter = 0;

        function singleGetCallback(err, doc) {
            assert.ifError(err, 'Single get error.');
            assert(doc, 'A document should be retrieved.');

            getCounter += 1;
        }

        function multiGetCallback(err, docs, metas) {
            assert.ifError(err, 'Multiget error.');
            assert(Array.isArray(docs), 'Docs should be an array');
            assert.strictEqual(docs.length, 10, '10 docs should have been retrieved.');
            assert.strictEqual(metas.length, docs.length, 'The same number of docs and metas should have been retrieved.');
            assert.strictEqual(getCounter, 10, 'Single get callback should have been called 10 times before the mutliple get callback.');

            var expected = keys.map(function () {
                return 'value';
            });

            assert.deepEqual(docs, expected, 'All elements of docs should be \'value\'.');

            done();
        }

        function setOne(key, callback) {
            connection.set(key, 'value', callback);
        }

        function afterSets(err) {
            assert.ifError(err, 'Setting multiple keys failed.');

            connection.get(keys, singleGetCallback, multiGetCallback);
        }

        forEachSeries(keys, setOne, afterSets);
    });

    it('should get multiple items with an array of keys', function (done) {
        var keys = [
            { key: 'key0', hashkey: 'hashkey0' },
            { key: 'key1', hashkey: 'hashkey1' },
            { key: 'key2', hashkey: 'hashkey2' },
            { key: 'key3', hashkey: 'hashkey3' },
            { key: 'key4', hashkey: 'hashkey4' },
            { key: 'key5', hashkey: 'hashkey5' },
            { key: 'key6', hashkey: 'hashkey6' },
            { key: 'key7', hashkey: 'hashkey7' },
            { key: 'key8', hashkey: 'hashkey8' },
            { key: 'key9', hashkey: 'hashkey9' }
        ];

        var getCounter = 0;

        function singleGetCallback(err, doc) {
            assert.ifError(err, 'Single get error.');
            assert(doc, 'A document should be retrieved.');

            getCounter += 1;
        }

        function multiGetCallback(err, docs, metas) {
            assert.ifError(err, 'Multiget error.');
            assert(Array.isArray(docs), 'Docs should be an array');
            assert.strictEqual(docs.length, 10, '10 docs should have been retrieved.');
            assert.strictEqual(metas.length, docs.length, 'The same number of docs and metas should have been retrieved.');
            assert.strictEqual(getCounter, 10, 'Single get callback should have been called 10 times before the mutliple get callback.');

            var expected = keys.map(function (key) {
                return key.key + ':value';
            });

            assert.deepEqual(docs, expected, 'got unexpected value');

            done();
        }

        function setOne(key, callback) {
            connection.set(key, key.key + ':value', callback);
        }

        function afterSets(err) {
            assert.ifError(err, 'Setting multiple keys failed.');

            connection.get(keys, singleGetCallback, multiGetCallback);
        }

        forEachSeries(keys, setOne, afterSets);
    });

});