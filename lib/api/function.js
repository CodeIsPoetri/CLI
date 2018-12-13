'use strict';

const { post } = require('./request');
const resource = '/function';

module.exports = class FunctionAPI {
    static async insert ({ id: idproject } = {}, { slug, name, language, description, version } = {}) {
        return post(`${resource}/create`,
            { idproject, slug, name, idlanguage: language, description, documentation: description, version });
    }
};
