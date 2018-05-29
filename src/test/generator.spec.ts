// tslint:disable:only-arrow-functions

import * as dm from '../lib/index';
import 'mocha';
import * as chai from 'chai';
import * as path from 'path';
import { promisify } from 'util';
import * as fs from 'fs';

import * as request from 'request';

describe('Generator', function () {
    it('simple output', async function () {
        const tmpFolder = path.join(__dirname, '../../src/test/', 'tmp');
        // TODO creer le repertoire (et le vider)

        // TODO file:// + chemin vers model.docx;
        const modelUrl = 'file://C:/Projects/Phenix/doc-merge/src/test/docx-generator-data/model.docx';
        const app = new dm.App({
            port: 0,
            tmpFolder,
        });

        const server = await app.start();
        try {
            const port = server.address().port;

            const body: dm.IBody = {
                data: {},
                modeleRef: { url: modelUrl },
                type: 'docx',
                outputType: dm.OutputType.download,
            };

            const testUrl = `http://localhost:${port}/merge`;


            const requestResponse = await new Promise<request.Response>((resolve, reject) => {
                request.post(testUrl,
                    {
                        body: JSON.stringify(body),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }, (error: any, response: request.Response, responseBody: any) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(response);
                        }
                    });
            });

            requestResponse.pipe(fs.createWriteStream(path.join(tmpFolder, 'output.docx')));

        } finally {
            await app.stop();
        }
    });
});
