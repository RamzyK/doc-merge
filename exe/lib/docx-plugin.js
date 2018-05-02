"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input_file_1 = require("./input-ref/input-file");
class DocXPlugin {
    async merge(modele, data, fileName) {
        let extension = modele.substr(modele.lastIndexOf('/') + 1).split('.');
        let tmpFolder = modele;
        const ipFile = new input_file_1.InputFile({
            tmpFolder,
        });
        if (extension[1] === 'docx') {
            ipFile.getFile(data);
        }
        else if (extension[1] === 'pdf') {
        }
        else {
            console.log('Other type of document!');
        }
        return null;
    }
}
exports.DocXPlugin = DocXPlugin;
//# sourceMappingURL=docx-plugin.js.map