#!/usr/bin/env node

'use strict';

const program = require('commander');
const slugGenerate = require('project-name-generator');
const inquirer = require('inquirer');
const Validators = require('../lib/validators');

const Project = require('../lib/project');
const Templates = require('../lib/templates');
const Token = require('../lib/token');
const { Function: API } = require('../lib/api');

const { resolve } = require('path');
const { cwd } = process;

program
    .usage('[options] <path>')
    .description('Creates a new function.')
    .option('-l --language <language>', 'The language to use in the project')
    .option('-n --name <name>', 'The function name')
    .option('-n --description <description>', 'The function description', undefined)
    .action(main)
    .parse(process.argv);

async function main (path, options) {
    if (typeof path !== 'string') {
        options = path;
        path = undefined;
    }

    const {
        language: languageOption = '',
        slug: slugOption =
            path || slugGenerate().dashed,
        name: nameOption,
        description: descriptionOption
    } = options;

    const languageList =
        await Templates.listLanguages();

    const questions = [
        {
            name: 'language',
            type: 'list',
            message: 'Select the language to use',
            default: languageList.findIndex(language => language === languageOption) !== -1
                ? languageList.findIndex(language => language === languageOption)
                : 0,
            choices: languageList
        },
        {
            name: 'slug',
            message: 'Enter an identifier for your function',
            default: slugOption,
            validate: Validators.slug
        },
        {
            name: 'name',
            message: 'Enter the function name',
            ...typeof nameOption === 'function'
                ? nameOption() !== undefined
                    ? { default: nameOption() }
                    : { }
                : { default: nameOption },
            validate: Validators.required
        },
        {
            name: 'description',
            message: 'Enter the function description (optional)',
            ...typeof descriptionOption === 'function'
                ? descriptionOption() !== undefined
                    ? { default: descriptionOption() }
                    : { }
                : { default: descriptionOption }
        }
    ];

    try {
        const project = await Project.read(cwd());
        const { language, slug, name, description } =
            await inquirer.prompt(questions);

        project.functions[slug] = { language, name, description };
        await Templates.copy(language, resolve(project.directory, slug));
        await Project.write(project);

        if (!Token.isLoggedIn()) {
            console.log([
                `Your function ${slug} was successfully created.`
                `However, you haven't logged-in on Poetri.`,
                `You'll probably need to log in and run 'poetri sync' before`,
                'deploying your functions to the platform.'
            ].join(' '));
        } else {
            const { status } = await API.insert(project, {
                slug,
                ...project.functions[slug]
            });

            if (Number(status)) {
                await Project.write(project);
            } else {
                console.log([
                    'There was an error trying to register your function in the platform.',
                    'Please contact support to support@poetri.co or Twitter @Poetri_co.'
                ].join(' '));
            }
        }
    } catch (error) {
        console.error(error.message);
    }

}
