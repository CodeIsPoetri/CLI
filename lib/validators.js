'use strict';

const passwordStrengthTest = require('owasp-password-strength-test');

module.exports = class Validators {
    static async required (input) {
        return input !== '' || 'This field is required';
    }

    static async mail (input) {
        const mailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}/;

        return mailRegex.test(input) || [
            `It seems your email isn't correctly written.`,
            `Please check and try again to continue.`
        ].join(' ');
    }

    static async slug (input) {
        const regex = /[A-Za-z0-9-]+/;

        return regex.test(input) || [
            `It seems this id isn't correctly written.`,
            `Please check and try again to continue.`
        ].join(' ');
    }

    static async password (input) {
        const strengthResults =
            await passwordStrengthTest.test(input);

        return strengthResults.strong || [
            'There are some errors regarding to password strength:'
        ].concat(strengthResults.errors.map(
            (message, index) => `\n  ${index + 1}) ${message}`
        )).join(' ');
    }
};
