import * as util from 'util';
import * as gn from '../generateur/index';
import * as fs from '../tools/fs';
import * as path from 'path';
import * as url from 'url';
import * as uuid from 'uuid';

// tslint:disable:no-var-requires
const docxtemplater = require('docxtemplater');
const jsZip = require('jszip');

// tslint:disable:no-console
export class DocGenerator implements gn.IPlugin {

    constructor() {
        //
    }
    public async  generate(input: gn.IPluginInput): Promise<gn.IPluginOutput> {
        const output: gn.IPluginOutput = {
            outputFileName: input.outputFileName,
            contentType: 'docx',
        };

        await this.generateDocx(input.modelFileName, input.data, output.outputFileName);
        return output;
    }

    private async generateDocx(modelFileName: string, data: any, outputFileName: string) {
        if (await !fs.exists(modelFileName)) {
            throw new Error("Le fichier modèle n'existe pas");
        }
        const content = await fs.readFile(modelFileName, 'binary');
        const zip = new jsZip(content);
        const doc = new docxtemplater();

        doc.loadZip(zip);
        doc.setData(data);
        doc.render();
        const buf = doc.getZip().generate({ type: 'nodebuffer' });

        await fs.saveFile(outputFileName, buf);
    }
}
