#!/usr/bin/env node

'use strict';

const program = require('commander');
const inquirer = require('inquirer');
const Validators = require('../lib/validators');

program
    .description('Registers a new user on Poetri.')
    .option('-m --mail <mail>', 'mail for the user')
    .action(main)
    .parse(process.argv);

async function main ({ mail }) {
    const questions = [
        {
            name: 'username',
            message: 'Enter your nickname',
            async validate (input) {
                return Validators.required(input);
            }
        },
        {
            name: 'firstName',
            message: 'Enter your first name',
            validate: Validators.required
        },
        {
            name: 'lastName',
            message: 'Enter your last name',
            validate: Validators.required
        },
        {
            name: 'mail',
            message: 'Enter your mail',
            default: mail,
            validate: Validators.mail
        },
        {
            name: 'password',
            message: 'Enter a secure password',
            type: 'password',
            validate: Validators.password
        },
        {
            name: 'terms',
            message: 'Do you agree the terms of service\n(available at https://poetri.co/terms)?',
            type: 'confirm',
            default: false
        }
    ];

    const answers = await inquirer.prompt(questions);

    if (!answers.terms) {
        console.log([
            `\nYou need to agree to the terms of service in order to`,
            `register in our platform. Please fill up the form again`,
            `to continue.`
        ].join(' '));

        process.exit(1);
    }
}
