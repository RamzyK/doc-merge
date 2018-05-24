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
        const fileHndler = this.getFileFromFileUrl.bind(this);
        this.protocolHandlers.set('http:', httpHandler);
        this.protocolHandlers.set('https:', httpHandler);
        this.protocolHandlers.set('file:', fileHndler);
    }
    async getFile(data) {
        const key = uuid.v4();
        if (typeof data === 'string') {
            return this.getFileFromString(data, key);
        }
        else {
            const barUrl = new url_1.URL(data.url);
            const handler = this.protocolHandlers.get(barUrl.protocol);
            if (!handler) {
                throw new Error(`Error: protocol unknown: ${data.url}`);
            }
            return await handler(data, key);
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
        const tmpPath = await this.saveFile(body, key);
        return tmpPath;
    }
    async getFileFromFileUrl(data, key) {
        const barUrl = new url_1.URL(data.url);
        const strURL = barUrl.toString();
        const nameFile = strURL.substring(strURL.lastIndexOf('/') + 1);
        const content = await readFile(barUrl);
        return await this.saveFile(content, key);
    }
    async getFileFromString(data, key) {
        let content = await readFile(data);
        console.log('data: ' + data.toString());
        console.log('content: ' + content.toString());
        return await this.saveFile(content, key);
    }
    async saveFile(content, fileName) {
        if (await !exist(this.options.tmpFolder)) {
            throw new Error(`Temporary folder ${this.options.tmpFolder} does not exist!`);
        }
        const fullPath = fileName = path.join(this.options.tmpFolder, fileName);
        await appendFile(fullPath, content);
        return fullPath;
    }
}
exports.InputFile = InputFile;
//# sourceMappingURL=input-file.js.map