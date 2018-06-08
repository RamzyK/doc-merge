"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input_file_1 = require("./input-ref/input-file");
const path = require("path");
const uuid = require("uuid");
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
    async docMerge(input, request, response) {
        const generateOutput = await this.generate(input);
        switch (input.outputType) {
            case OutputType.download:
                await this.sendFile(response, generateOutput);
                break;
            case OutputType.url:
                let requestUrl = request.url;
                console.log('requestUrl: ' + requestUrl);
                let a = requestUrl.split('/merge');
                let before = a[0];
                console.log('before: ' + before);
                let after = a[1];
                console.log('after: ' + after);
                let urlToSend = before + '/download' + after;
                generateOutput.outputFileName = urlToSend;
                console.log('urlToend: ' + urlToSend);
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
        const outputFileName = path.join(this._tmpFolder, uuid.v4());
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
        let outputFilename = pluginOutput.outputFileName;
        let fileName = outputFilename.split('/', outputFilename.lastIndexOf('/'))[1];
        let type = pluginOutput.contentType;
        let repUrl = path.join('http://localhost:8555/', fileName, type);
        console.log(pluginOutput.outputFileName);
        let resp = {
            repUrl,
        };
        response.json(resp);
    }
}
exports.Generator = Generator;
//# sourceMappingURL=generator.js.map