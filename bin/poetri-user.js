#!/usr/bin/env node

process.env.NODE_ENV = process.env.NODE_ENV || 'staging';

'use strict';

const program = require('commander');
const { version } = require('../package');

program
    .version(version)
    .description('User commands for Poetri')
    .command('signup', 'registers an user')
    .command('signin', 'logs-in an user')
    .command('logout', 'logs-out an user')
    .parse(process.argv);
