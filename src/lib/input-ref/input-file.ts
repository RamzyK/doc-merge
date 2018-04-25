// tslint:disable:no-console
import * as ip from 'C:\\projets\\doc-merge\\src\\lib\\index';
import * as fs from 'fs';
import * as util from 'util';
import { request } from 'http';
export type InputFileRef = string | IInputFile;
export interface IInputFile {
    url: string;
    headers: any;
    verb: string;
}

export interface IInputFileOptions {
    tmpFolder: string;
}
export class InputFile {
    constructor(private readonly options: IInputFileOptions) {
    }

    public async getFile(data: InputFileRef): Promise<string> {
        let path = this.options.tmpFolder;

        let write = util.promisify(fs.writeFile);
        let read = util.promisify(fs.readFile);
        let exist = util.promisify(fs.exists);
        let create = fs.appendFile;
        const asyncExists = util.promisify(fs.exists);

        let returnFile: string = '';

        if (typeof data === 'string') {
            if (await !exist(path)) {
                console.log('Path to the file does not exist!');
            } else {
                if (await !exist(path + '\\file.txt')) {
                    console.log('No such file in directory!');

                } else {
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
        } else {
            let bodyParser = require('body-parser');
            let express = require('express');
            let router = express.Router();
            let app = express();

            app.use(bodyParser.json());

            const { URL } = require('url');
            const http = require('http');
            const https = require('https');

            const myURL = new URL(data.url);

            if (myURL.protocole() === 'http') {
                console.log('http protocole');
                if (data.verb === 'GET') {
                    request(data, (error: any, response: any, body: string) => {
                    });
                }

            } else if (myURL.protocole() === 'https') {
                console.log('https protocole');
            } else {
                console.log('Other protocole');
            }

        }

        return path;
    }
}
