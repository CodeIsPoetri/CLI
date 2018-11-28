'use strict'

const { NODE_ENV } = process.env;
module.exports = require('../configuration/settings.json')[NODE_ENV];