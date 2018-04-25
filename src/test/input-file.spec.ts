// tslint:disable:only-arrow-functions
import * as dm from '../lib/index';
import 'mocha';
import * as chai from 'chai';
import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';

const expect = chai.expect;

const asyncExists = promisify(fs.exists);
const asyncMkDir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);
const readFile = promisify(fs.readFile);

async function deleteDirectoryContent(dirPath: string) {
    try {
        const files = await readdir(dirPath);
        const unlinkPromises = files.map((filename) => unlink(`${dirPath}/${filename}`));
        await Promise.all(unlinkPromises);
    } catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
    }
}

describe('InputFile', function () {
    const tmpFolder = path.join(__dirname, 'files');
    beforeEach(async function () {
        if (await asyncExists(tmpFolder)) {
            await deleteDirectoryContent(tmpFolder);
        } else {
            await asyncMkDir(tmpFolder);
        }
    });
    it('should save base 64 encoded file', async function () {
        const inputFile = new dm.InputFile({
            tmpFolder,
        });
        const fileBuffer = await readFile(__filename);
        const contentsInBase64 = fileBuffer.toString('base64');

        const file = await inputFile.getFile(contentsInBase64);
        const outputInBase64 = (await readFile(file)).toString('base64');

        expect(contentsInBase64).equals(outputInBase64);
    });
});
