import * as util from 'util';
import * as gn from '../generateur/index';
import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
import * as uuid from 'uuid';

// tslint:disable:no-var-requires
const docxtemplater = require('docxtemplater');
const jsZip = require('jszip');
const write = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const exist = util.promisify(fs.exists);
const appendFile = util.promisify(fs.appendFile);

// tslint:disable:no-console
export class DocGenerator implements gn.IPlugin {

    constructor() {
        //
    }
    public async  generate(input: gn.IPluginInput): Promise<gn.IPluginOutput> {
        const type = input.modelFileName.split('.')[1];         // récupérer le type du fichier
        const outputFile: gn.IPluginOutput = {
            outputFileName: input.outputFileName,
            contentType: type,
        };

        if (type === 'txt') {
            const content = new Buffer(input.modelFileName, 'base64');
            return await this.saveFile(content, input.modelFileName, outputFile);
        } else if (type === 'docx') {
            return await this.generateDocx(input, outputFile);
        } else {
            throw new Error('Error: Type unhandled.');
        }
    }

    private async generateDocx(fileInput: gn.IPluginInput, output: gn.IPluginOutput): Promise<gn.IPluginOutput> {
        const inputFileName = fileInput.modelFileName;
        if (await !exist(inputFileName)) {
            console.log('File does not exist!');
        } else {
            const content = await readFile(inputFileName, 'binary');
            const zip = new jsZip(content);
            const doc = new docxtemplater();

            doc.loadZip(zip);
            doc.setData(fileInput.data);
            doc.render();
            const buf = doc.getZip().generate({ type: 'nodebuffer' });
            output.contentType = 'docx';

            return await this.saveFile(buf, fileInput.modelFileName, output);
        }

    }

    private async saveFile(content: any, fileName: string, outputFile: gn.IPluginOutput): Promise<gn.IPluginOutput> {
        const folderPath = 'C:\\Users\\raker\\Desktop\\docGenerator\\';     // Dossier où stocker les fichiers
        if (await exist(folderPath + fileName)) {
            throw new Error(`File already exist!`);
        }

        const fullPath = path.join(folderPath, outputFile.outputFileName);
        await appendFile(fullPath, content);
        outputFile.outputFileName = fullPath;
        return outputFile;
    }

}
