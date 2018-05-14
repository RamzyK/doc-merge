import * as dl from './input-ref/input-file';
import * as util from 'util';
import * as fs from 'fs';
import { IBody } from './index';
import * as http from 'http';
// tslint:disable-next-line:no-implicit-dependencies
import * as formidable from 'formidable';
import * as path from 'path';
// tslint:disable:no-console
// tslint:disable-next-line:no-var-requires
let express = require('express');
let app = express();

const appendFile = util.promisify(fs.appendFile);

export class DownloadHandler implements dl.IOutputFile, dl.IInputFile {
    constructor(public readonly url: string, public readonly headers?: any, public readonly verb?: string) {
        //
    }

    public async downloadFile(input: IBody): Promise<string> {
        let destination = this.url;
        app.get('/download', (req: any, res: any) => {
            if (input.downloadType.isDirectDownload) {
                res.setHeader('Content-disposition', `attachment; filename=download.${input.type}`);
                res.download(destination, input.outputFileName);
            }
        });
        let port = 8000;
        app.listen(port, () => {
            console.log(`listening on port ${port}`);
        });
        return null;
    }

    public async uploadFile(input: IBody): Promise<string> {
        // tslint:disable-next-line:only-arrow-functions
        app.post('/',  (request: any, response: any) => {
            console.log(request.body);      // your JSON
            response.send(request.body);    // echo the result back
        });
        let port = 8000;
        app.listen(port, () => {
            console.log(`listening on port ${port}`);
        });
        return null;
    }
}
