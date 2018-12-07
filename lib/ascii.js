'use strict';

const { resolve } = require('path');
const { readFileSync } = require('fs');

module.exports = function () {
    const path = resolve(__dirname, '..', 'configuration', 'ascii.txt');
    const file = readFileSync(path);
    return file.toString();
}