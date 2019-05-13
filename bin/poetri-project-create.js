#!/usr/bin/env node

'use strict';

const program = require('commander');
const inquirer = require('inquirer');
const Validators = require('../lib/validators');

const { Project: API } = require('../lib/api');
const Project = require('../lib/project');
const Token = require('../lib/token');

const { resolve } = require('path');
const { cwd } = process;

const chalk = require('chalk');
const ascii = require('../lib/ascii');

if (require.main === module) {
    program
        .usage('[options] <path>')
        .description('Creates a new project.')
        .action(main)
        .parse(process.argv);
}

async function main (path) {
    if (typeof path !== 'string') {
        path = undefined;
    }

    const questions = [
        {
            name: 'name',
            message: `Enter the project's display name`,
            validate: Validators.required
        },
        {
            name: 'slug',
            message: 'Enter an identifier for your project',
            default: ({ name }) => path || name
                .toLowerCase()
                .split(' ')
                .join('-'),
            filter: slug => slug
                .toLowerCase()
                .split(' ')
                .join('-'),
            validate: Validators.slug
        },
        {
            name: 'description',
            message: 'Enter the project description (optional)'
        }
    ];

    const { slug, name, description } = await inquirer.prompt(questions);

    try {
        if (path === undefined) {
            path = slug;
        }

        const project = await Project.initialize(
            new Project(resolve(cwd(), slug), { slug, name, description }));

        if (!Token.isLoggedIn()) {
            console.log(chalk`{rgb(140,255,130) ${ascii()}}`);
            console.log([
                `Just don't forget to signup and sync before deploying.`,
                `To do this, try 'poetri sync' or 'poetri project sync'.`
            ].join('\n'));
        } else {
            const { project: { id } = {}, state } = await API.insert(project);

            if (Number(state)) {
                project.id = id;
                await Project.write(project);
            } else {
                console.log([
                    'There was an error trying to register your project in the platform.',
                    'Please contact support to support@poetri.co or Twitter @Poetri_co.'
                ].join(' '));
            }
        }

        return path;
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = main;
