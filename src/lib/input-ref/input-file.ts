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
const readFile = util.promisify(fs.readFile);
const exist = util.promisify(fs.exists);
const appendFile = util.promisify(fs.appendFile);
const asyncExists = util.promisify(fs.exists);

export type InputFileRef = string | IFile;

export interface IFile {
    url: string;
    headers?: any;
    verb?: string;
}
// tslint:disable-next-line:no-empty-interface
export interface IInputFile extends IFile {

}
// tslint:disable-next-line:no-empty-interface
export interface IOutputFile extends IFile {

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

type GetFileHandler = (data: IFile, key: string) => Promise<string>;
export class InputFile {
    private numFile = 0;
    private readonly protocolHandlers: Map<string, GetFileHandler>;

    constructor(private readonly options: IInputFileOptions) {
        this.protocolHandlers = new Map<string, (data: IFile, key: string) => Promise<string>>();

        const httpHandler = this.getFileFromUrl.bind(this);
        const fileHndler = this.getFileFromFileUrl.bind(this);

        this.protocolHandlers.set('http:', httpHandler);
        this.protocolHandlers.set('https:', httpHandler);
        this.protocolHandlers.set('file:', fileHndler);
    }

    public async getFile(data: InputFileRef): Promise<string> {
        const key = uuid.v4();
        if (typeof data === 'string') {
            return this.getFileFromString(data, key);
        } else {
            const barUrl = new URL(data.url);
            const handler = this.protocolHandlers.get(barUrl.protocol);
            if (!handler) {
                throw new Error(`Error: protocol unknown: ${data.url}`);
            }
            return await handler(data, key);
        }
    }

    private async getFileFromUrl(data: IFile, key: string): Promise<string> {
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
        const tmpPath = await this.saveFile(body,  key);
        return tmpPath;
    }

    private async getFileFromFileUrl(data: IFile, key: string): Promise<string> {
        const barUrl = new URL(data.url);
        const strURL = barUrl.toString();
        const nameFile = strURL.substring(strURL.lastIndexOf('/') + 1);

        const content = await readFile(barUrl);
        return await this.saveFile(content,  key);
    }
    private async getFileFromString(data: string, key: string): Promise<string> {
        let content = await readFile(data);
        console.log('data: ' + data.toString());
        console.log('content: ' + content.toString());
        return await this.saveFile(content, key);
    }

    private async saveFile(content: any, fileName: string): Promise<string> {

        if (await !exist(this.options.tmpFolder)) {
            throw new Error(`Temporary folder ${this.options.tmpFolder} does not exist!`);
        }

        const fullPath = fileName = path.join(this.options.tmpFolder, fileName);
        await appendFile(fullPath, content);
        return fullPath;
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
