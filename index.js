'use strict';

var _       = require('underscore');
var methods = ['get'];
var request = require('request').defaults({json: true});
var url     = require('url');

methods.forEach(function (method) {
    PingPongNickname.prototype[method] = function (path, opts, cb) {
        if (typeof opts === 'function') {
            cb = opts;
            opts = {};
        }

        opts = _.defaults(opts, this.reqDefaults);

        opts.uri = url.format({
            protocol: this.protocol,
            hostname: this.host,
            port: this.port,
            pathname: path
        });

        delete opts.url;

        return send(method, opts, cb);
    };
});

function send (method, opts, cb) {
    return request[method](opts, function (error, response, body) {
        if (error) {
            return cb(error);
        }

        cb(null, response, body);
    });
}

function PingPongNickname(options, reqDefaults) {
    options = options || {};

    this.protocol = options.protocol || 'https';
    this.host     = options.host;
    this.port     = options.port;
    this.reqDefaults = reqDefaults || {};

    if (this.host === undefined) {
        throw new Error('PingPongNickname must be initialized with a host');
    }
}

PingPongNickname.prototype.nickname = function (cb) {
    this.get('/', cb);
};

module.exports = PingPongNickname;
