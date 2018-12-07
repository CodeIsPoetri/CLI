#!/usr/bin/env node

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

'use strict';

const program = require('commander');
const { version } = require('../package');

program
    .version(version)
    .description('Project commands for Poetri')
    .command('list', 'list your projects')
    .command('create', `creates a project. If not logged-in, you'll need to link your project later`)
    .parse(process.argv);
