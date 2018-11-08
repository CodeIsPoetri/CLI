'use strict';

const Request = require('request-promise-native');
const { URL, resolve } = require('url');
const { apiEndpoint, apiClientId, apiClientSecret }
    = require('../configuration/settings');

async function processRequest (context, resource, method = 'get', body = {}, query = {}, extras = {}) {
    try {
        const url = new URL(resolve(apiEndpoint, resource));

        for (let key in query) {
            url.searchParams.append(key, query[key]);
        }

        const uri = url.toString();

        const { data } = await Request({
            method,
            uri,
            auth: { bearer },
            json: true,
            body,
            ...extras
        });

        return data;
    } catch (response) {
        const { statusCode, error: errorBody } = response;

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

exports.get = (context, resource, query) => processRequest(context, resource, 'get', undefined, query);
exports.post = (context, resource, body, query) => processRequest(context, resource, 'post', body, query);
exports.put = (context, resource, body, query) => processRequest(context, resource, 'put', body, query);
exports.delete = (context, resource, query) => processRequest(context, resource, 'delete', undefined, query);
