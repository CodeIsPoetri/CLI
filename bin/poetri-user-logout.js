#!/usr/bin/env node

'use strict';

const program = require('commander');
const Token = require('../lib/token');

program
    .description('Signs a Poetri user out.')
    .action(main)
    .parse(process.argv);

async function main () {
    Token.delete();

    console.log([
        `You've been successfully signed-out from Poetri.`,
        `We wish to see you soon again.`
    ].join(' '));
}
