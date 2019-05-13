#!/usr/bin/env node

'use strict';

const program = require('commander');
const poetriProjectCreate = require('./poetri-project-create');
const poetriFunctionCreate = require('./poetri-function-create');

const { resolve } = require('path');

program
    .usage('[options] <path>')
    .description('Initializes a project and creates a new function.')
    .action(main)
    .parse(process.argv);

async function main (path) {
    const resultPath = await poetriProjectCreate(path);
    process.chdir(resolve(process.cwd(), resultPath));
    
    await poetriFunctionCreate({});
}