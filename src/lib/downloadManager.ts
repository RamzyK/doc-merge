import * as dl from './input-ref/input-file';
import * as util from 'util';
import * as fs from 'fs';
import { IBody } from './index';

// tslint:disable:no-console
// tslint:disable-next-line:no-var-requires
let download = require('download-file');
const appendFile = util.promisify(fs.appendFile);
export class DownloadHandler implements dl.IOutputFile, dl.IInputFile {
    private options = {
        directory: './dwnld_Folder',
        filename: 'cat.gif',
    };
    constructor(public readonly url: string, public readonly headers?: any, public readonly verb?: string) {
        //
    }

    public async downloadFile(autoDowload: boolean, input: IBody): Promise<string> {
        let destination = this.url;

        let express = require('express');
        let app = express();
        if (autoDowload === true) {
            app.get('/download', (req: Request, res: any) => {
                res.setHeader('Content-disposition', `attachment; filename=download.${input.type}`);
                res.download(destination, input.outputFileName);
            });

            let port = 8000;
            app.listen(port, () => {
                console.log(`listening on port ${port}`);
            });
        }
        return null;
    }
}
