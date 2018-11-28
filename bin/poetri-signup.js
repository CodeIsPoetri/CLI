#!/usr/bin/env node

'use strict';

const program = require('commander');
const inquirer = require('inquirer');
const Validators = require('../lib/validators');
const AuthAPI = require('../lib/auth.api');

const { stat: statAsync, readFile: readFileAsync } = require('fs');
const EsPromisify = require('es-promisify');
const stat = EsPromisify(statAsync);
const readFile = EsPromisify(readFileAsync);

program
    .description('Registers a new user on Poetri.')
    .option('-m --email <email>', 'mail for the user')
    .action(main)
    .parse(process.argv);

async function main ({ email }) {
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
            default: email,
            validate: Validators.mail
        },
        {
            name: 'password',
            message: 'Enter a secure password',
            type: 'password',
            validate: Validators.password
        },
        {
            name: 'sshKeyFile',
            message: 'Enter your public SSH key',
            default: '~/.ssh/id_rsa.pub',
            async validate (filename) {
                filename = filename.replace('~', process.env.HOME);
                try {
                    const stats = await stat(filename);
                    return stats.isFile();
                } catch (error) {
                    return `Please use a valid file. There was an error: ${error.message}`;
                }
            },
            filter (filename) {
                return filename.replace('~', process.env.HOME);
            }
        },
        {
            name: 'terms',
            message: 'Do you agree the terms of service\n(available at https://poetri.co/terms)?',
            type: 'confirm',
            default: false
        }
    ];

    const {
        username,
        firstName,
        lastName,
        mail,
        password,
        sshKeyFile,
        terms
    } = await inquirer.prompt(questions);

    if (!terms) {
        console.log([
            `\nYou need to agree to the terms of service in order to`,
            `register in our platform. Please fill up the form again`,
            `to continue.`
        ].join(' '));

        process.exit(1);
    }

    const sshPublicKey = (await readFile(sshKeyFile)).toString();

    try {
        await AuthAPI.register({
            username,
            firstName,
            lastName,
            mail,
            password,
            sshPublicKey
        });
    } catch (error) {
        console.error('There was an error trying to signup. Please try again later:', error.message);
    }
}
