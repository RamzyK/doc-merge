"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const fs = require("fs");
exports.readFile = util_1.promisify(fs.readFile);
exports.saveFile = util_1.promisify(fs.writeFile);
exports.exists = util_1.promisify(fs.exists);
async function getFileAsBase64(fileName) {
    const fileBuffer = await exports.readFile(fileName);
    const contentsInBase64 = fileBuffer.toString('base64');
    return contentsInBase64;
}
exports.getFileAsBase64 = getFileAsBase64;
async function saveJson(data, fileName) {
    const dataStr = JSON.stringify(data);
    const fileContent = new Buffer(dataStr, 'base64');
    return await exports.saveFile(fileContent, fileName);
}
exports.saveJson = saveJson;
//# sourceMappingURL=fs.js.map