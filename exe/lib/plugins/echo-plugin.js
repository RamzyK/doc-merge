"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const fs = require("../tools/fs");
class EchoPlugin {
    async generate(input) {
        const modelAsBase64 = await fs.getFileAsBase64(input.modelFileName);
        const outputData = {
            data: _.cloneDeep(input.data),
            model: modelAsBase64,
        };
        await fs.saveJson(outputData, input.outputFileName);
        const pluginOutput = {
            outputFileName: input.outputFileName,
            contentType: 'application/json',
        };
        return pluginOutput;
    }
}
exports.EchoPlugin = EchoPlugin;
//# sourceMappingURL=echo-plugin.js.map