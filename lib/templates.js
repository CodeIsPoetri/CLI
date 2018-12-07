'use strict';

const { HOME } = process.env;
const { resolve } = require('path');
const folderPath = resolve(HOME, '.poetri-templates');

const Unzip = require('unzip');
const ncpAsync = require('ncp');
const rmrfAsync = require('rimraf');

const { file: tmpFileAsync } = require('tmp');

const Promisify = require('es-promisify');
const {
    createReadStream,
    createWriteStream,
    readdir: readdirAsync
} = require('fs');
const {
    ensureDir,
    emptyDir,
    pathExists,
    writeJSON
} = require('fs-extra');

const Request = require('request-promise-native');
const ncp = Promisify(ncpAsync);
const rmrf = Promisify(rmrfAsync);
const readdir = Promisify(readdirAsync);
const tmpFile = Promisify(tmpFileAsync);

const downloadTemplateFile = (uri) => new Promise(async (resolve, reject) => {
    const body = await Request({ uri, encoding: "binary" });
    const [ zipPath,, cleanupCallback ] = await tmpFile({ postfix: '.zip' });

    const writeStream = createWriteStream(zipPath);
    writeStream.write(body, 'binary');
    writeStream.on('finish', () => resolve({ zipPath, cleanupCallback }));
    writeStream.on('error', error => {
        console.error(error);
        reject(error);
    });
    writeStream.end();
});

const unzip = (zipPath, path) => new Promise((resolve, reject) => {
    const unzipStream = createReadStream(zipPath)
        .pipe(Unzip.Extract({ path }));

    unzipStream.on('finish', () => resolve(path));
    unzipStream.on('error', error => reject(error));
});

async function fetchTemplates (force = false) {
    const checkFile = resolve(folderPath, '.update.json');
    const templatesPath = resolve(folderPath, 'templates-master');

    if (await pathExists(checkFile) && !force) {
        return;
    }

    console.log('Downloading templates...');
    const { zipPath, cleanupCallback } =
        await downloadTemplateFile('https://github.com/openfaas/templates/archive/master.zip');

    await unzip(zipPath, folderPath);
    cleanupCallback();

    for (let language of await readdir(resolve(templatesPath, 'template'))) {
        const originFolder = resolve(templatesPath, 'template', language);
        const destFolder = resolve(folderPath, language);

        await ensureDir(destFolder);
        await ncp(originFolder, destFolder);
    }

    await emptyDir(templatesPath);
    await rmrf(templatesPath);
    await writeJSON(checkFile, Date.now());
}

exports.init = async function (force) {
    await ensureDir(folderPath);
    await fetchTemplates(force);
};

exports.listLanguages = async function () {
    await exports.init();
    const files = await readdir(folderPath);
    return files.filter(file => !/\..*/.test(file));
};