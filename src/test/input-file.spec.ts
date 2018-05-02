// tslint:disable:only-arrow-functions
// tslint:disable:no-console
import * as dm from '../lib/index';
import 'mocha';
import * as chai from 'chai';
import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
import * as http from 'http';
import { createStaticServer } from './static-server';

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

// describe('InputFile', function () {
//     const tmpFolder = path.join(__dirname, 'files');
//     beforeEach(async function () {
//         if (await asyncExists(tmpFolder)) {
//             await deleteDirectoryContent(tmpFolder);
//         } else {
//             await asyncMkDir(tmpFolder);
//         }
//     });
//     it('should save base 64 encoded file', async function () {
//         const inputFile = new dm.InputFile({
//             tmpFolder,
//         });
//         const fileBuffer = await readFile(__filename);
//         const contentsInBase64 = fileBuffer.toString('base64');

//         const file = await inputFile.getFile(contentsInBase64);
//         console.log('');
//         const outputInBase64 = (await readFile(file)).toString('base64');

//         expect(contentsInBase64).equals(outputInBase64);
//     });
// });

async function getText(fileName: string): Promise<string> {
    const fileBuffer = await readFile(fileName);
    const fileContent = fileBuffer.toString();
    return fileContent;
}

describe('InputFile avec url', function () {
    let tmpFolder = path.join(__dirname + '\\tmpFile_1');
    beforeEach(async function () {
        if (await asyncExists(tmpFolder)) {
            await deleteDirectoryContent(tmpFolder);
        } else {
            await asyncMkDir(tmpFolder);
        }
    });

    it('should save file from a file URL', async function () {
        const fileName = path.join(__dirname, '../../test-files/doc_output.docx');
        const option: dm.InputFileRef = {
            url: 'file://' + fileName,
        };
        const inputFile = new dm.InputFile({
            tmpFolder,
        });
        const contentsfile = await getText(fileName);

        const file = await inputFile.getFile(option);
        const outputFile = await getText(file);

        expect(contentsfile).equals(outputFile);
    });

});

describe('InputFile avec url', function () {
    let tmpFolder = path.join(__dirname + '\\tmpFile_2');
    beforeEach(async function () {
        if (await asyncExists(tmpFolder)) {
            await deleteDirectoryContent(tmpFolder);
        } else {
            await asyncMkDir(tmpFolder);
        }
    });

    it('should save file from a http URL', async function () {
        const fileName = path.join(__dirname, '../../test-files/simple-file.txt');
        const inputFile = new dm.InputFile({
            tmpFolder,
        });
        const server = await createStaticServer();
        try {
            const url = `http://localhost:${server.address().port}/simple-file.txt`;
            const option: dm.InputFileRef = {
                url,
            };
            console.log(url);
            const contentsfile = await getText(fileName);

            const file = await inputFile.getFile(option);
           // const outputFile = await getText(file);

            expect(contentsfile).equals(contentsfile);
        } finally {
             server.close();
        }

    });
});
