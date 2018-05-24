"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generator_1 = require("./generator");
const input_file_1 = require("./input-ref/input-file");
const util = require("util");
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
        let isDirectDownload = input.outputType === generator_1.OutputType.download;
        let download;
        if (typeof (data) !== 'string') {
            if (input.type === 'txt') {
            }
            else if (input.type === 'docx') {
                let iplugArray = (await this.docxGenerator(data, input, data.url)).split(' ');
                iplugin.state = 'done';
            }
            else {
                throw new Error('Unhandled type of file');
            }
        }
        else {
            let inputFile = new input_file_1.InputFile({
                tmpFolder: 'C:\\Users\\raker\\Desktop\\a.txt',
            });
            let pathToFile64 = await inputFile.getFile(data);
            iplugin.state = 'done';
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