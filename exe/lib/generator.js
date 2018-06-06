"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input_file_1 = require("./input-ref/input-file");
const path = require("path");
var OutputType;
(function (OutputType) {
    OutputType[OutputType["download"] = 0] = "download";
    OutputType[OutputType["url"] = 1] = "url";
    OutputType[OutputType["upload"] = 2] = "upload";
})(OutputType = exports.OutputType || (exports.OutputType = {}));
function isIBody(body) {
    return body && body.type && body.modeleRef && body.data;
}
exports.isIBody = isIBody;
class Generator {
    constructor(tmpFolder) {
        this._tmpFolder = tmpFolder;
        this.docExtention = new Map();
    }
    async docMerge(input, response) {
        const generateOutput = await this.generate(input);
        switch (input.outputType) {
            case OutputType.download:
                await this.sendFile(response, generateOutput);
                break;
            case OutputType.url:
                await this.sendUrl(response, generateOutput);
                break;
            case OutputType.upload:
                break;
            default:
                console.log('default case');
        }
    }
    async generate(input) {
        const plugIn = this.docExtention.get(input.type);
        if (!plugIn) {
            throw new Error(`Plugin not registered for ${input.type}`);
        }
        const inputFile = new input_file_1.InputFile({ tmpFolder: this._tmpFolder });
        const modelFileName = await inputFile.getFile(input.modeleRef);
        console.log('chemin vers le fichier: ' + modelFileName);
        const outputFileName = path.join(this._tmpFolder);
        console.log('output file name: ' + outputFileName);
        const pluginInput = {
            modelFileName,
            data: input.data,
            outputFileName,
        };
        return await plugIn.generate(pluginInput);
    }
    async registerPlugin(type, plugin) {
        this.docExtention.set(type, plugin);
    }
    async sendFile(response, pluginOutput) {
        response.download(pluginOutput.outputFileName);
    }
    async sendUrl(response, pluginOutput) {
        let repUrl = path.join('http://localhost:8555/download/', pluginOutput.outputFileName);
        console.log(pluginOutput.outputFileName);
        let resp = {
            repUrl,
        };
        response.json(resp);
    }
}
exports.Generator = Generator;
//# sourceMappingURL=generator.js.map