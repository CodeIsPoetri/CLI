#!/usr/bin/env node

'use strict';

const program = require('commander');
const { version } = require('../package');

program
    .version(version)
    .command('init', 'creates a new project')
    .command('signup', 'registers an user')
    .command('signin', 'logs-in an user')
    .parse(process.argv);
