"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const util = require("util");
const url_1 = require("url");
const request = require("request");
const uuid = require("uuid");
const write = util.promisify(fs.writeFile);
const close = util.promisify(fs.close);
const readFile = util.promisify(fs.readFile);
const exist = util.promisify(fs.exists);
const appendFile = util.promisify(fs.appendFile);
const asyncExists = util.promisify(fs.exists);
var OutputType;
(function (OutputType) {
    OutputType[OutputType["download"] = 0] = "download";
    OutputType[OutputType["url"] = 1] = "url";
    OutputType[OutputType["upload"] = 2] = "upload";
})(OutputType = exports.OutputType || (exports.OutputType = {}));
async function httpRequest(options) {
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) {
                reject(error);
            }
            else {
                resolve([response, body]);
            }
        });
    });
}
class InputFile {
    constructor(options) {
        this.options = options;
        this.numFile = 0;
        this.protocolHandlers = new Map();
        const httpHandler = this.getFileFromUrl.bind(this);
        const key = uuid.v4();
        const fileHndler = async (data) => await this.getFileFromFileUrl(data, key);
        this.protocolHandlers.set('http:', httpHandler);
        this.protocolHandlers.set('https:', httpHandler);
        this.protocolHandlers.set('file:', fileHndler);
    }
    async getFile(data) {
        if (data === ' ' || data === '') {
            data = this.options.tmpFolder;
        }
        if (typeof data === 'string') {
            const key = uuid.v4();
            return this.getFileFromString(data, key);
        }
        else {
            const barUrl = new url_1.URL(data.url);
            const handler = this.protocolHandlers.get(barUrl.protocol);
            if (!handler) {
                throw new Error(`Error: protocol unknown: ${data.url}`);
            }
            return await handler(data);
        }
    }
    async getFileFromUrl(data, key) {
        const barUrl = new url_1.URL(data.url);
        const strURL = barUrl.toString();
        const nameFile = strURL.substring(strURL.lastIndexOf('/') + 1);
        data.verb = data.verb || 'GET';
        const options = {
            headers: data.headers,
            uri: barUrl,
            method: data.verb,
        };
        if (data.verb !== 'GET') {
        }
        const [response, body] = await httpRequest(options);
        const tmpPath = await this.saveFile(body, 'temporary__' + key, '.' + nameFile.split('.')[1]);
        return tmpPath;
    }
    async getFileFromFileUrl(data, key) {
        const barUrl = new url_1.URL(data.url);
        const strURL = barUrl.toString();
        const nameFile = strURL.substring(strURL.lastIndexOf('/') + 1);
        const content = await readFile(barUrl);
        return await this.saveFile(content, 'temporary__' + key, '.' + nameFile.split('.')[1]);
    }
    async getFileFromString(data, key) {
        let content = await readFile(data);
        console.log('data: ' + data.toString());
        console.log('content: ' + content.toString());
        return await this.saveFile(content, 'file' + key, '.txt');
    }
    async saveFile(content, prefix, postfix) {
        let lastBackSlashPosition = this.options.tmpFolder.lastIndexOf('\\') + 1;
        let completePath = this.options.tmpFolder;
        const tempPath = completePath.substring(0, lastBackSlashPosition);
        if (await !exist(tempPath)) {
            throw new Error(`Temporary folder ${tempPath} does not exist!`);
        }
        prefix = prefix || '';
        postfix = postfix || '.tmp';
        const fileName = path.join(tempPath, prefix + postfix);
        await appendFile(fileName, content);
        return fileName;
    }
}
exports.InputFile = InputFile;
//# sourceMappingURL=input-file.js.map