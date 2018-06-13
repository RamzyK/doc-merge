import * as dl from './input-ref/input-file';
import * as util from 'util';
import * as fs from 'fs';
import { IBody } from 'doc-merge-intf';
import * as http from 'http';
// tslint:disable-next-line:no-implicit-dependencies
import * as formidable from 'formidable';
import * as path from 'path';
// tslint:disable:no-console
// tslint:disable:no-var-requires
let express = require('express');
// tslint:disable-next-line:no-implicit-dependencies
let upLoader = require('express-uploader');
let app = express();

const appendFile = util.promisify(fs.appendFile);
const read = util.promisify(fs.readFile);

export class DownloadHandler implements dl.IOutputFile, dl.IInputFile {
    constructor(public readonly url: string, public readonly headers?: any, public readonly verb?: string) {

    }

    public async downloadFile(input: IBody): Promise<string> {
        let destination = this.url;
        app.get('/download', (req: any, res: any) => {

            res.setHeader('Content-disposition', `attachment; filename=download.${input.type}`);
            res.download(destination, input.outputFileName);

        });
        let port = 8000;
        app.listen(port, () => {
            console.log(`lisstening on port ${port}`);
        });
        return null;
    }

    public async uploadFile(input: IBody): Promise<string> {

        app.post('/', async (request: http.ServerRequest, response: http.ServerResponse) => {
            console.log(await request.headers);      // your JSON
            console.log('\n');

            let chemin = this.url;
            let pageHeaders = request.headers;

            if (typeof (input.modeleRef) === 'string') {
                let buffer = await read(chemin);
                let contenu = buffer.toString();
                let body = input.modeleRef.toString();

                response.writeHead(200, {
                    'Content-Length': buffer.length,
                    'Content-Type': 'text/plain',
                    'host': 'localhost:8000',
                    'connection': 'keep-alive',
                });
                response.write(contenu);
                console.log(contenu);

            } else {
                throw new Error('ERROR while posting!');
            }
            response.end();
        });

        let port = 8000;
        app.listen(port, () => {
            console.log(`listening on port ${port}`);
        });
        return null;
    }
}
