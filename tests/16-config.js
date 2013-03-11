describe('test config', function () {
    var assert = require('assert');
    var couchbase = require('../lib/couchbase.js');
    var warn = console.warn;

    var hosts = ['localhost:8091'];
    var bucket = 'default';
    var password = 'password';
    var user = 'Administrator';

    before(function (done) {
        // Load a config if one exists, and overwrite default values.
        try {
            var config = require(__dirname + '/config.json');
            hosts = config.hosts;
            bucket = config.bucket;
            password = config.password;
            user = config.user;
        } catch (e) {}

        // Silence the warnings.
        console.warn = function () {};
        done();
    });

    after(function (done) {
        // Restore console.warn.
        console.warn = warn;
        done();
    });

    // Create a fresh config object to play with in each test.
    function freshConfig() {
        var conf = {};
        var keys = Object.keys(config);

        for (var i = 0; i < keys.length; i++) {
            conf[keys[i]] = config[keys[i]];
        }

        return conf;
    }

    it('should handle config.username', function (done) {
        // Make a config object with username instead of user.
        var conf = { username: user, password: password, bucket: bucket, hosts: hosts };

        couchbase.connect(conf, function (err) {
            assert.strictEqual(conf.user, user);
            done(err);
        });
    });

    it('should handle config.pass', function (done) {
        // Make a config object with pass instead of password.
        var conf = { user: user, pass: password, bucket: bucket, hosts: hosts };

        couchbase.connect(conf, function (err) {
            assert.strictEqual(conf.password, password);
            done(err);
        });
    });

    it('should handle config.passw', function (done) {
        // Make a config object with passw instead of password.
        var conf = { user: user, passw: password, bucket: bucket, hosts: hosts };

        couchbase.connect(conf, function (err) {
            assert.strictEqual(conf.password, password);
            done(err);
        });
    });

    it('should handle config.passwd', function (done) {
        // Make a config object with passwd instead of password.
        var conf = { user: user, passwd: password, bucket: bucket, hosts: hosts };

        couchbase.connect(conf, function (err) {
            assert.strictEqual(conf.password, password);
            done(err);
        });
    });

    it('should handle config.host', function (done) {
        // Make a config object with host instead of hosts.
        var conf = { user: user, password: password, bucket: bucket, host: hosts[0] };

        couchbase.connect(conf, function (err) {
            assert.strictEqual(conf.hosts[0], hosts[0]);
            done(err);
        });
    });

    it('should handle config.hostname', function (done) {
        // Make a config object with hostname instead of hosts.
        var conf = { user: user, password: password, bucket: bucket, hostname: hosts[0] };

        couchbase.connect(conf, function (err) {
            assert.strictEqual(conf.hosts[0], hosts[0]);
            done(err);
        });
    });
});





