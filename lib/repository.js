'use strict';

const OS = require('os');
const { Config, Remote, Repository, Signature } = require('nodegit');

async function getAuthor () {
    const config = await Config.openDefault();

    const hostname = OS.hostname();
    const { username: osUsername } = OS.userInfo();

    let username;
    try {
        username = await config.getStringBuf('user.name');
    } catch (error) {
        username = osUsername;
    }

    let mail;
    try {
        mail = await config.getStringBuf('user.mail');
    } catch (error) {
        mail = `${osUsername}@${hostname}`;
    }

    return Signature.create(
            username, mail,
            Date.now(), 0);
}

module.exports = class GitRepository {
    constructor (repository) {
        this.repository = repository;
    }

    async addRemote (name, url) {
        await Remote
            .create(this.repository, name, url);
    }

    static async initialize (directory) {
        // git init
        const repository = await Repository.init(directory, 0);
        const index = await repository.refreshIndex();

        // git add .
        await index.addAll('.');
        await index.write();
        const oid = await index.writeTree();

        // git commit -m "Initial commit"
        const author = await getAuthor();
        await repository.createCommit(
            "HEAD", author, author, "Initial commit", oid, []);

        return new GitRepository(repository);
    }

    static async discover (directory) {
        return Repository
            .open(await Repository.discover(directory, 1));
    }
};