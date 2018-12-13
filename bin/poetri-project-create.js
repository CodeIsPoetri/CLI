#!/usr/bin/env node

'use strict';

const program = require('commander');
const slugGenerate = require('project-name-generator');
const inquirer = require('inquirer');
const Validators = require('../lib/validators');

const { Auth, Project: API } = require('../lib/api');
const Project = require('../lib/project');
const Token = require('../lib/token');

const { resolve } = require('path');
const { cwd } = process;

const chalk = require('chalk');
const ascii = require('../lib/ascii');

program
    .usage('[options] <path>')
    .description('Creates a new project.')
    .option('-s --slug')
    .action(main)
    .parse(process.argv);

async function main (path, options) {
    if (typeof path !== 'string') {
        options = path;
        path = undefined;
    }

    const {
        slug: defaultSlug =
            path || slugGenerate({ number: true, words: 4 }).dashed
    } = options;
    const questions = [
        {
            name: 'slug',
            message: 'Enter an identifier for your project',
            default: defaultSlug,
            validate: Validators.slug
        },
        {
            name: 'name',
            message: 'Enter the project name',
            validate: Validators.required
        },
        {
            name: 'description',
            message: 'Enter the project description (optional)'
        }
    ];

    const { slug, name, description } = await inquirer.prompt(questions);

    try {
        const project = await Project.initialize(
            new Project(resolve(cwd(), slug), { slug, name, description }));

        if (!Token.isLoggedIn()) {
            console.log(chalk`{rgb(140,255,130) ${ascii()}}`);
            console.log([
                `Just don't forget to signup and sync before deploying.`,
                `To do this, try 'poetri sync' or 'poetri project sync'.`
            ].join('\n'));
        } else {
            const { project: { id } } = await API.insert(project);
            project.id = id;
            await Project.write(project);

            // TODO: Remove after this is present on API
            const { username: owner } = await Auth.me();
            await Auth.message('project:afterInsert', { slug, owner });
        }
    } catch (error) {
        console.error(error.message);
    }
}