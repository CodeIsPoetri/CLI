'use strict';

const Request = require('request-promise-native');
const Token = require('../token');
const { URL, resolve } = require('url');
const { authApi } = require('../configuration');
const { endpoint, clientId, clientSecret } = authApi;

async function processRequest (resource, method = 'get', body, query = {}, extras = {}) {
    try {
        const url = new URL(resolve(endpoint, resource));

        for (let key in query) {
            url.searchParams.append(key, query[key]);
        }

        const uri = url.toString();

        return Request({
            method,
            uri,
            json: true,
            ...body !== undefined ? { body } : {},
            ...extras
        });
    } catch (response) {
        const { statusCode, error: errorBody } = response;
        console.error(body, response);

        let message, code;
        if (typeof errorBody === 'string') {
            message = code = errorBody;
        } else {
            const { error } = errorBody;
            message = error !== undefined && error.message !== undefined
                ? error.message
                : response.message.replace('Error: ', '');
            code = error !== undefined && error.code !== undefined
                ? error.code
                : response.code;
        }

        const error = new Error(message);
        error.code = code;
        error.errno = statusCode;

        throw error;
    }
};

exports.get = (resource, query, extras) => processRequest(resource, 'get', undefined, query, extras)
    .then(response => response.data);
exports.post = (resource, body, query, extras) => processRequest(resource, 'post', body, query, extras)
    .then(response => response.data);
exports.put = (resource, body, query, extras) => processRequest(resource, 'put', body, query, extras)
    .then(response => response.data);
exports.delete = (resource, query, extras) => processRequest(resource, 'delete', undefined, query, extras)
    .then(response => response.data);

exports.register = (user) => exports.post('/users', user, undefined, {
    auth: { user: clientId, pass: clientSecret, sendImmediately: true }
});

exports.login = async function (username, password) {
    const { access_token: accessToken } = await processRequest('/auth/token', 'post', undefined, undefined, {
        form: {
            grant_type: 'password',
            client_id: clientId,
            client_secret: clientSecret,
            username,
            password
        }
    });

    Token.set(username, accessToken);
};

exports.message = async function (id, data) {
    const bearer = await Token.get();
    return exports.post('/topics', { id, data }, undefined, {
        auth: { bearer, sendImmediately: true }
    });
};

exports.me = async function () {
    const bearer = await Token.get();
    return exports.get('/users/me', undefined, undefined, {
        auth: { bearer, sendImmediately: true }
    });
};