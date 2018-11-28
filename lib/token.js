'use strict';

const NetRC = require('netrc-rw');
const { authApi: { endpoint } } = require('./configuration');

exports.get = function () {
    const { password } = NetRC.host(endpoint) || {};
    return password;
};

exports.set = function (username, password) {
    const config = NetRC.hasHost(endpoint)
        ? NetRC.host(endpoint)
        : NetRC.addHost(endpoint);

    config.login = username;
    config.password = password;

    NetRC.write();
};
