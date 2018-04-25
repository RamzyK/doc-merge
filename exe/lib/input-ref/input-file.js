"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const util = require("util");
class InputFile {
    constructor(options) {
        this.options = options;
    }
    async getFile(data) {
        let path = this.options.tmpFolder;
        let write = util.promisify(fs.writeFile);
        let read = util.promisify(fs.readFile);
        let exist = util.promisify(fs.exists);
        let create = fs.appendFile;
        const asyncExists = util.promisify(fs.exists);
        let returnFile = '';
        if (typeof data === 'string') {
            if (await !exist(path)) {
                console.log('Path to the file does not exist!');
            }
            else {
                if (await !exist(path + '\\file.txt')) {
                    console.log('No such file in directory!');
                }
                else {
                    let base64 = exports;
                    let uncoded = new Buffer(data.toString() || '', 'base64').toString('utf8');
                    fs.appendFile(path + '\\file.txt', uncoded, (err) => {
                        if (err) {
                            throw err;
                        }
                    });
                    path = path + '\\file.txt';
                }
            }
        }
        else {
            console.log('Not working on yet!');
        }
        return path;
    }
}
exports.InputFile = InputFile;
//# sourceMappingURL=input-file.js.map