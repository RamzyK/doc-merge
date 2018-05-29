"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("../tools/fs");
const docxtemplater = require('docxtemplater');
const jsZip = require('jszip');
class DocGenerator {
    constructor() {
    }
    async generate(input) {
        const output = {
            outputFileName: input.outputFileName,
            contentType: 'docx',
        };
        await this.generateDocx(input.modelFileName, input.data, output.outputFileName);
        return output;
    }
    async generateDocx(modelFileName, data, outputFileName) {
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
exports.DocGenerator = DocGenerator;
//# sourceMappingURL=docGenerator.js.map