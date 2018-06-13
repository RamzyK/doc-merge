import { IPluginOld, IPluginResult, Generator, OutputType } from './generator';
import { InputFile, } from './input-ref/input-file';
// import { DownloadHandler } from './downloadManager';
import * as util from 'util';
import * as fs from 'fs';
import * as url from 'url';
import * as uuid from 'uuid';
// tslint:disable:no-var-requires

const jsZip = require('jszip');
const docxtemplater = require('docxtemplater');
import * as path from 'path';
import { IFile, IBody } from 'doc-merge-intf';

// tslint:disable:no-console

export class FilePlugin implements IPluginOld {
    public name?: string;
    public cpt = 0;
    public async merge(data: string | IFile, input: IBody): Promise<IPluginResult> {
        return await this.docXmerge(data, input);
    }
    public generateRndmName(fileType: string): string {
        return 'file__' + uuid.v4() + fileType;
    }

    private async docXmerge(data: string | IFile, input: IBody): Promise<IPluginResult> {
        const iplugin: IPluginResult = {
            state: '',
        };
        let isDirectDownload = input.outputType === OutputType.download;
        let download;
        if (typeof (data) !== 'string') {
            if (input.type === 'txt') {
                //
            } else if (input.type === 'docx') {
                let iplugArray = (await this.docxGenerator(data, input, data.url)).split(' ');
                //  TODO this.handlerDocxDownload(iplugArray, iplugin, download, input);
                iplugin.state = 'done';
            } else {
                throw new Error('Unhandled type of file');
            }

        } else {
            let inputFile = new InputFile({
                tmpFolder: 'C:\\Users\\raker\\Desktop\\a.txt',            // Path to the base64 coded file
            });
            let pathToFile64 = await inputFile.getFile(data);
            // download = new DownloadHandler(pathToFile64);
            // await download.uploadFile(input);
            iplugin.state = 'done';
        }

        return iplugin;
    }

    private async docxGenerator(data: string | IFile, input: IBody, fileURL: string): Promise<string> {
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
