import { IPlugin, IPluginResult, Generator } from './generator';
import { IFile, InputFile, } from './input-ref/input-file';
import { DownloadHandler } from './downloadManager';
import * as util from 'util';
import * as gn from './index';
import * as fs from 'fs';
import * as url from 'url';
import * as uuid from 'uuid';
// tslint:disable:no-var-requires

const jsZip = require('jszip');
const docxtemplater = require('docxtemplater');
import * as path from 'path';

// tslint:disable:no-console

export class FilePlugin implements IPlugin {
    public name?: string;
    public cpt = 0;
    // tslint:disable-next-line:max-line-length
    public async merge(data: string | IFile, input: gn.IBody): Promise<IPluginResult> {
        return await this.docXmerge(data, input);
    }
    public generateRndmName(fileType: string): string {
        return 'file__' + uuid.v4() + fileType;
    }

    // tslint:disable-next-line:max-line-length
    private async docXmerge(data: string | IFile, input: gn.IBody): Promise<IPluginResult> {
        const iplugin: gn.IPluginResult = {
            state: '',
        };
        let isDirectDownload = input.downloadType.isDirectDownload;
        let download;

        if (typeof (data) !== 'string') {
            let iplugArray = (await this.docxGenerator(data, input, data.url)).split(' ');
            iplugin.state = iplugArray[0];               // 'done' or error thrown

            if (iplugin.state !== 'error') {
                let pathTodocx = iplugArray[1];         // Path to the generated docx file
                download = new DownloadHandler(pathTodocx);
                if (isDirectDownload === true) {
                    await download.downloadFile(input);
                } else if (input.downloadType.dType === gn.OutputType.upload) {
                    console.log('&');
                    await download.uploadFile(input);
                }
            }

        } else {
            let inputFile = new InputFile({
                tmpFolder: '',            // Path to the base64 coded file
            });
            let pathToFile64 = await inputFile.getFile(data);
            download = new DownloadHandler(pathToFile64);
            download.downloadFile(input);
        }

        return iplugin;
    }

    private async docxGenerator(data: string | IFile, input: gn.IBody, fileURL: string): Promise<string> {
        const read = util.promisify(fs.readFile);
        const write = util.promisify(fs.writeFile);
        let answer: string;

        try {
            const content = await read(new url.URL(fileURL), 'binary');
            const zip = new jsZip(content);
            let pathToDocx = input.outputPath + '/' + input.outputFileName;
            const doc = new docxtemplater();

            doc.loadZip(zip);
            doc.setData(input.data);
            doc.render();

            const buf = doc.getZip().generate({ type: 'nodebuffer' });
            if (input.outputFileName === '' || input.outputFileName === undefined) {
                input.outputFileName = this.generateRndmName(input.type);

                console.log(`File named: ${input.outputFileName}!`);
            }
            await write(pathToDocx, buf);

            return 'done ' + pathToDocx;
        } catch (error) {
            throw new Error('Error while generating docx file!');
        }
    }

}
