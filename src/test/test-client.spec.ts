// tslint:disable:only-arrow-functions
// tslint:disable:no-console

import * as dm from '../lib/index';
import 'mocha';
import * as chai from 'chai';
import * as path from 'path';
import { promisify } from 'util';
import * as fs from 'fs';
import * as request from 'request';
import { ExtError } from '../lib/errors/ext-error';
import { URL } from 'url';

const assert = chai.assert;
const expect = chai.expect;
const exists = promisify(fs.exists);
const asyncMkDir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);

async function deleteDirectoryContent(dirPath: string) {
    try {
        const files = await readdir(dirPath);
        const unlinkPromises = files.map((filename) => unlink(`${dirPath}/${filename}`));
        await Promise.all(unlinkPromises);
    } catch (err) {
        console.log(err);
    }
}

describe('Client test', function () {
    it('test url client', async function () {
        const tmpFolder = path.join(__dirname, '../../src/test/', 'tmp');
        if (! await exists(tmpFolder)) {
            await asyncMkDir(tmpFolder);
        } else {
            await deleteDirectoryContent(tmpFolder);
        }
        const app = new dm.App({
            port: 0,
            tmpFolder,
        });
        const server = await app.start();
        const port = server.address().port;
        const testUrl = `http://localhost:${port}/merge`;

        let body: dm.IBody = {
            data: {},
            modeleRef: { url: testUrl },
            type: 'docx',
            outputType: dm.OutputType.url,
        };

        const responseUrl: any = await new Promise<void>((resolve, reject) => {
            let r = request.post(testUrl,
                {
                    body: JSON.stringify(body),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }, (error, response, responsseBody) => {
                    if (error) {
                        reject(error);
                    } else if (response.statusCode >= 400) {
                        reject(new ExtError(response.statusCode, responsseBody));
                    } else {
                        const { url } = JSON.parse(responsseBody);
                        resolve(url);
                    }
                });
            r.on('error', (error: any) => {
                reject(error);
            });
        });

        let client = new dm.Client(testUrl);
        let clientResponse = client.getUrl(body.type, body.data, body.modeleRef);

        expect(clientResponse).eql(responseUrl);
    });
});
