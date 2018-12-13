'use strict';

const NetRC = require('netrc-rw');
const { authApi: { endpoint } } = require('./configuration');

exports.isLoggedIn = function () {
    return NetRC.hasHost(endpoint) &&
        NetRC.host(endpoint).login !== undefined;
};

exports.get = function () {
    const { password } = NetRC.host(endpoint) || {};
    const [ accessToken ] = password.split(':');
    return accessToken;
};

exports.getRefresh = function () {
    const { password } = NetRC.host(endpoint) || {};
    const [, refreshToken ] = password.split(':');
    return refreshToken;
};

exports.set = function (username, accessToken, refreshToken) {
    const config = NetRC.hasHost(endpoint)
        ? NetRC.host(endpoint)
        : NetRC.addHost(endpoint);

    config.login = username;
    config.password = `${accessToken}:${refreshToken}`;

    NetRC.write();
};

exports.delete = function () {
    if (exports.isLoggedIn()) {
        NetRC.host(endpoint).login = undefined;
        NetRC.host(endpoint).password = undefined;

        NetRC.write();
    }
}