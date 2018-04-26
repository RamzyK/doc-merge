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
const read = util.promisify(fs.readFile);
const exist = util.promisify(fs.exists);
const appendFile = util.promisify(fs.appendFile);
const asyncExists = util.promisify(fs.exists);
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
        this.protocolHandlers = new Map();
        const httpHandler = this.getFileFromUrl.bind(this);
        const fileHndler = async (data) => await this.getFileFromFileUrl(data);
        this.protocolHandlers.set('http:', httpHandler);
        this.protocolHandlers.set('https:', httpHandler);
        this.protocolHandlers.set('file:', fileHndler);
    }
    async getFile(data) {
        if (typeof data === 'string') {
            return this.getFileFromString(data);
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
    async getFileFromUrl(data) {
        const barUrl = new url_1.URL(data.url);
        data.verb = data.verb || 'GET';
        const options = {
            headers: data.headers,
            uri: barUrl,
            method: data.verb,
        };
        if (data.verb !== 'GET') {
        }
        const [response, body] = await httpRequest(options);
        const tmpPath = await this.saveFile(body, 'tmp', 'tmp');
        return tmpPath;
    }
    async getFileFromFileUrl(data) {
        const barUrl = new url_1.URL(data.url);
        const content = await read(barUrl);
        return await this.saveFile(content, 'tmp', 'tmp');
    }
    async getFileFromString(data) {
        const content = new Buffer(data, 'base64');
        return await this.saveFile(content, 'tmp', '');
    }
    async saveFile(content, prefix, postfix) {
        const tempPath = this.options.tmpFolder;
        if (await !exist(tempPath)) {
            throw new Error(`Temporary folder ${tempPath} does not exist!`);
        }
        prefix = prefix || '';
        postfix = postfix || '.tmp';
        const fileName = path.join(tempPath, prefix + uuid.v1() + postfix);
        await appendFile(fileName, content);
        return fileName;
    }
}
exports.InputFile = InputFile;
//# sourceMappingURL=input-file.js.map