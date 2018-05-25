"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input_file_1 = require("./input-ref/input-file");
var OutputType;
(function (OutputType) {
    OutputType[OutputType["download"] = 0] = "download";
    OutputType[OutputType["url"] = 1] = "url";
    OutputType[OutputType["upload"] = 2] = "upload";
})(OutputType = exports.OutputType || (exports.OutputType = {}));
function isIBody(data) {
    return data && data.type && data.modeleRef && data.data;
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
                break;
            case OutputType.url:
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
        const pluginInput = {
            data: input.data,
            modelFileName,
            outputFileName: input.outputFileName,
        };
        return await plugIn.generate(pluginInput);
    }
    async registerPlugin(type, plugin) {
        this.docExtention.set(type, plugin);
    }
}
exports.Generator = Generator;
//# sourceMappingURL=generator.js.map