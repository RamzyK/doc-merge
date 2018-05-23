// tslint:disable:only-arrow-functions
// tslint:disable:no-console
import * as dm from '../lib/index';
import * as dl from '../lib/input-ref/input-file';
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
        console.log('');
        const outputInBase64 = (await readFile(file)).toString('base64');

        expect(contentsInBase64).equals(outputInBase64);
    });
});

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
            const outputFile = await getText(file);

            expect(contentsfile).equals(outputFile);
        } finally {
            server.close();
        }

    });
});

describe('Generate a docx document', function () {
    it('should generate a .docx file', async function () {
        const docxPath = 'C:/Users/raker/Desktop/docxGenerator';            // Chemin vers le dossier de depôt
        const fileData: dm.IFile = {
            url: 'file://C:/Users/raker/Desktop/Document.docx',             // Chemin vers le document model
            headers: {
                'Allow': 'POST',
                'ContentLength': 0,
                'Content-Type': 'text/html; charset=UTF-8',
            },
            verb: 'GET',
        };

        const options = {
            last_name: 'Kermad',
            first_name: 'Ramzy',
            phone: '06-06-06-06-06',
            description: 'Stage dev Javascript/ Typescript',
        };

        const autoDownload: dm.IOutputMode = {
            isDirectDownload: false,
            dType: dm.OutputType.upload,
        };

        const docOption: dm.IBody = {
            type: 'txt',
            data: options,
            modeleRef: ' ',
            outputFileName: 'newDoc.txt',
            outputPath: docxPath,
            downloadType: autoDownload,
        };

        const generator = new dm.Generator(docOption);
        // generator.registerPlugin('docx', new dm.FilePlugin());
        generator.registerPlugin('txt', new dm.FilePlugin());

        if (await asyncExists(docxPath)) {
            await deleteDirectoryContent(docxPath);
        } else {
            await asyncMkDir(docxPath);
        }

        const generated = await generator.docMerge(docOption);
        expect(generated.state).equals('done');
    });
});
