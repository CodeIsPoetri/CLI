#!/usr/bin/env node

process.env.NODE_ENV = process.env.NODE_ENV || 'staging';

'use strict';

const program = require('commander');
const { version } = require('../package');

program
    .version(version)
    .command('signup', 'register yourself')
    .command('login', 'log-in into Poetri network')
    .command('logout', 'log-out of Poetri network')
    .command('init', 'creates a new project')
    .command('project', 'manage your projects')
    .command('function', 'manage your functions')
    .command('user', 'manage your user info')
    .parse(process.argv);
