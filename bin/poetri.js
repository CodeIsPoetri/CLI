#!/usr/bin/env node

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

'use strict';

const program = require('commander');
const { version } = require('../package');

program
    .version(version)
    .command('signup', 'registers an user')
    .command('login', 'logs-in an user')
    .command('init', 'creates a new project')
    .parse(process.argv);
