"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input_file_1 = require("./input-ref/input-file");
const downloadManager_1 = require("./downloadManager");
const util = require("util");
const gn = require("./index");
const fs = require("fs");
const url = require("url");
const uuid = require("uuid");
const jsZip = require('jszip');
const docxtemplater = require('docxtemplater');
class FilePlugin {
    constructor() {
        this.cpt = 0;
    }
    async merge(data, input) {
        return await this.docXmerge(data, input);
    }
    generateRndmName(fileType) {
        return 'file__' + uuid.v4() + fileType;
    }
    async docXmerge(data, input) {
        const iplugin = {
            state: '',
        };
        let isDirectDownload = input.downloadType.isDirectDownload;
        let download;
        if (typeof (data) !== 'string') {
            let iplugArray = (await this.docxGenerator(data, input, data.url)).split(' ');
            iplugin.state = iplugArray[0];
            if (iplugin.state !== 'error') {
                let pathTodocx = iplugArray[1];
                download = new downloadManager_1.DownloadHandler(pathTodocx);
                if (isDirectDownload === true) {
                    await download.downloadFile(input);
                }
                else if (input.downloadType.dType === gn.OutputType.upload) {
                    console.log('&');
                    await download.uploadFile(input);
                }
            }
        }
        else {
            let inputFile = new input_file_1.InputFile({
                tmpFolder: 'C:\\Users\\raker\\Desktop\\',
            });
            download = new downloadManager_1.DownloadHandler('C:\\Users\\raker\\Desktop\\a.txt');
            download.uploadFile(input);
            iplugin.state = 'done';
        }
        return iplugin;
    }
    async docxFunc(data, input, dataUrl, iplugin) {
        let isDirectDownload = input.downloadType.isDirectDownload;
        let download;
        let iplugArray = (await this.docxGenerator(data, input, dataUrl)).split(' ');
        iplugin.state = iplugArray[0];
        if (iplugin.state !== 'error') {
            let pathTodocx = iplugArray[1];
            download = new downloadManager_1.DownloadHandler(pathTodocx);
            if (isDirectDownload === true) {
                await download.downloadFile(input);
            }
            else if (input.downloadType.dType === gn.OutputType.upload) {
                console.log('&');
                await download.uploadFile(input);
            }
        }
        return iplugin;
    }
    async docxGenerator(data, input, fileURL) {
        const read = util.promisify(fs.readFile);
        const write = util.promisify(fs.writeFile);
        let answer;
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
        }
        catch (error) {
            throw new Error('Error while generating docx file!');
        }
    }
}
exports.FilePlugin = FilePlugin;
//# sourceMappingURL=docx-plugin.js.map