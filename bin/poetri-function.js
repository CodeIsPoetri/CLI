#!/usr/bin/env node

process.env.NODE_ENV = process.env.NODE_ENV || 'staging';

'use strict';

const program = require('commander');
const { version } = require('../package');

program
    .version(version)
    .description('Function commands for Poetri')
    .command('list', 'list your functions')
    .command('create', `creates a function`)
    .parse(process.argv);
