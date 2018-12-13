'use strict';

const { post } = require('./request');
const resource = '/project';

module.exports = class ProjectAPI {
    static async insert ({ slug, name, description } = {}) {
        return post(`${resource}/newProject`,
            { slug, name, description });
    }
};
