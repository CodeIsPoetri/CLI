'use strict';

const Promisify = require('es-promisify');
const YAML = require('yaml');

const Repository = require('../lib/repository');

const { resolve } = require('path');
const { writeFile: writeFileAsync, readFile: readFileAsync } = require('fs');
const { pathExists, ensureDir } = require('fs-extra');

const readFile = Promisify(readFileAsync);
const writeFile = Promisify(writeFileAsync);

const configFileName = 'poetri.yml';

module.exports = class Project {
    constructor (directory, options = {}, repository) {
        const { id, slug, name, description, functions = {} } = options;
        Object.assign(this,
            { id, description, directory, functions, name, slug });
        if (functions === null) {
            this.functions = {};
        }
    }

    async addDefaultRepo () {
        await this.repository
            .addRemote('poetri', `git@git.poetri.co:${this.slug}`);
    }

    /**
     * Creates a new project in a specified directory
     * @param {String} directory The directory to save the configuration file
     * @param {Project} options The properties to initialize the project
     */
    static async initialize (project) {
        // Makes directory in case it doesn't exist
        await ensureDir(project.directory);

        // Creates new project and writes configuration file
        await Project.write(project);

        // Initializes git repository
        const repository =
            await Repository.initialize(project.directory);
        project.repository = repository;
        await project.addDefaultRepo();

        return project;
    }

    /**
     * Reads a project from a directory
     * @param {String} directory The directory to be read from
     */
    static async read (directory) {
        /*
            Recursively checks if the configuration file name exists.
            In case it couldn't be found, throws an exception that should
            be shown to the user via console or plugin.
        */
        if (await pathExists(resolve(directory, configFileName))) {
            // Reads the file
            const fileData =
                await readFile(resolve(directory, configFileName));

            const data = YAML.parse(fileData.toString());
            return new Project(directory, data);
        } else {
            if (directory === '/') {
                throw new Error([
                    'You are not located inside a Poetri project.',
                    `Make sure you've entered 'cd your_project folder'`,
                    'before.'
                ].join(' '));
            } else {
                return Project.read(resolve(directory, '..'));
            }
        }
    }

    /**
     * Writes a project to a directory
     * @param {Project} project The project to be saved
     */
    static async write (project) {
        const { directory, id, name, slug, description, functions } =
            project;

        // Writes project file as {directory}/project.yml
        const data = YAML
            .stringify({ id, name, slug, description, functions });
        await writeFile(resolve(directory, configFileName), data);
    }
};