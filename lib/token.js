'use strict';

const NetRC = require('netrc-rw');
const { authApi: { endpoint } } = require('./configuration');

exports.isLoggedIn = function () {
    return NetRC.hasHost(endpoint) &&
        NetRC.host(endpoint).login !== undefined;
};

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

exports.delete = function () {
    if (exports.isLoggedIn()) {
        NetRC.host(endpoint).login = undefined;
        NetRC.host(endpoint).password = undefined;

        NetRC.write();
    }
}