'use strict';

const Request = require('request-promise-native');
const Token = require('../token');
const { URL, resolve } = require('url');
const { api } = require('../configuration');
const { endpoint } = api;

async function processRequest (resource, method = 'get', body = {}, query = {}, extras = {}) {
    try {
        const url = new URL(resolve(endpoint, resource));

        for (let key in query) {
            url.searchParams.append(key, query[key]);
        }

        const uri = url.toString();
        const bearer = Token.get();

        return Request({
            auth: { bearer },
            method,
            uri,
            json: true,
            body,
            ...extras
        });
    } catch (response) {
        const { statusCode, error: errorBody } = response;

        const error = new Error(errorBody);
        error.errno = statusCode;

        throw error;
    }
};

exports.get = (resource, query, extras) => processRequest(resource, 'get', undefined, query, extras);
exports.post = (resource, body, query, extras) => processRequest(resource, 'post', body, query, extras);
exports.put = (resource, body, query, extras) => processRequest(resource, 'put', body, query, extras);
exports.delete = (resource, query, extras) => processRequest(resource, 'delete', undefined, query, extras);
