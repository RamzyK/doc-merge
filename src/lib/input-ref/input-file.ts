// tslint:disable:no-console
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { URL } from 'url';
import * as request from 'request';
// import * as tmp from 'tmp';
import * as uuid from 'uuid';

const write = util.promisify(fs.writeFile);
const close = util.promisify(fs.close);
const read = util.promisify(fs.readFile);
const exist = util.promisify(fs.exists);
const appendFile = util.promisify(fs.appendFile);
const asyncExists = util.promisify(fs.exists);

export type InputFileRef = string | IInputFile;
export interface IInputFile {
    url: string;
    headers?: any;
    verb?: string;
}
export interface IInputFileOptions {
    tmpFolder: string;
}

async function httpRequest(options: request.Options): Promise<[request.Response, any]> {
    return new Promise<[request.Response, any]>((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                resolve([response, body]);
            }
        });
    });
}
export class InputFile {
    private numFile = 0;
    private readonly protocolHandlers: Map<string, (data: IInputFile) => Promise<string>>;
    constructor(private readonly options: IInputFileOptions) {
        this.protocolHandlers = new Map<string, (data: IInputFile) => Promise<string>>();

        const httpHandler = this.getFileFromUrl.bind(this);
        const fileHndler = async (data: IInputFile) => await this.getFileFromFileUrl(data);

        this.protocolHandlers.set('http:', httpHandler);
        this.protocolHandlers.set('https:', httpHandler);
        this.protocolHandlers.set('file:', fileHndler);
    }

    public async getFile(data: InputFileRef): Promise<string> {
        if (typeof data === 'string') {
            return this.getFileFromString(data);
        } else {
            const barUrl = new URL(data.url);
            const handler = this.protocolHandlers.get(barUrl.protocol);
            if (!handler) {
                throw new Error(`Error: protocol unknown: ${data.url}`);
            }
            return await handler(data);
        }
    }
    private async getFileFromUrl(data: IInputFile): Promise<string> {
        const barUrl = new URL(data.url);
        const strURL = barUrl.toString();
        const nameFile = strURL.substring(strURL.lastIndexOf('/') + 1);

        data.verb = data.verb || 'GET';

        const options: request.Options = {
            headers: data.headers,
            uri: barUrl,
            method: data.verb,
        };
        if (data.verb !== 'GET') {
            // todo set request.body
        }
        const [response, body] = await httpRequest(options);
        const tmpPath = await this.saveFile(body, 'temporary__' + nameFile.split('.')[0], '.' + nameFile.split('.')[1]);
        return tmpPath;
    }

    private async getFileFromFileUrl(data: IInputFile): Promise<string> {
        const barUrl = new URL(data.url);
        const strURL = barUrl.toString();
        const nameFile = strURL.substring(strURL.lastIndexOf('/') + 1);

        const content = await read(barUrl);
        return await this.saveFile(content, 'temporary__' + nameFile.split('.')[0], '.' + nameFile.split('.')[1]);
    }

    private async getFileFromString(data: string): Promise<string> {
        const content = new Buffer(data, 'base64');
        this.numFile++;
        return await this.saveFile(content, 'file' + this.numFile, '.txt');
    }

    private async saveFile(content: any, prefix: string, postfix: string): Promise<string> {
        const tempPath = this.options.tmpFolder;
        if (await !exist(tempPath)) {
            throw new Error(`Temporary folder ${tempPath} does not exist!`);
        }
        prefix = prefix || '';
        postfix = postfix || '.tmp';
        const fileName = path.join(tempPath, prefix + postfix);
        await appendFile(fileName, content);
        return fileName;
    }
    // const x = new Promise<[string, number]>((resolve, reject) => {
    //     tmp.file({
    //         mode: 0x644,
    //         prefix,
    //         postfix,
    //     }, (err, p, f) => {
    //         if (err) {
    //             reject(err);
    //             return;
    //         }
    //         return [p, f];
    //     });
    // });
    // const [path, fd] = await x;
    // await write(fd, content);
    // await close(fd);
    // return path;
}
