#!/usr/bin/env node

'use strict';

const program = require('commander');
const inquirer = require('inquirer');
const Validators = require('../lib/validators');
const { Auth } = require('../lib/api');

program
    .description('Signs a Poetri user in.')
    .option('-m --email <email>', 'mail for the user')
    .action(main)
    .parse(process.argv);

async function main ({ email }) {
    const questions = [
        {
            name: 'mail',
            message: 'Enter your mail',
            default: email,
            validate: Validators.mail
        },
        {
            name: 'password',
            message: 'Enter a secure password',
            type: 'password',
            validate: Validators.password
        }
    ];

    const { mail, password } = await inquirer.prompt(questions);

    try {
        await Auth.login(mail, password);
        console.log('Logged in! Start hacking! ;)');
    } catch (error) {
        console.error('There was an error trying to signup. Please try again later:', error.message);
    }
}
