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

export enum OutputType {
    download,
    url,
    upload,
}
export interface IOutputMode {
    isDirectDownload: boolean;
    dType: OutputType;

}
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

export class InputFile {
    private numFile = 0;
    private readonly protocolHandlers: Map<string, (data: IFile) => Promise<string>>;

    constructor(private readonly options: IInputFileOptions) {
        this.protocolHandlers = new Map<string, (data: IFile) => Promise<string>>();

        const httpHandler = this.getFileFromUrl.bind(this);
        const key = uuid.v4();
        const fileHndler = async (data: IFile) => await this.getFileFromFileUrl(data, key);

        this.protocolHandlers.set('http:', httpHandler);
        this.protocolHandlers.set('https:', httpHandler);
        this.protocolHandlers.set('file:', fileHndler);
    }

    public async getFile(data: InputFileRef): Promise<string> {
        if (data === ' ' || data === '') {
            data = this.options.tmpFolder;
        }
        if (typeof data === 'string') {
            const key = uuid.v4();
            return this.getFileFromString(data, key);
        } else {
            const barUrl = new URL(data.url);
            const handler = this.protocolHandlers.get(barUrl.protocol);
            if (!handler) {
                throw new Error(`Error: protocol unknown: ${data.url}`);
            }
            return await handler(data);
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
        const tmpPath = await this.saveFile(body, 'temporary__' + key, '.' + nameFile.split('.')[1]);
        return tmpPath;
    }

    private async getFileFromFileUrl(data: IFile, key: string): Promise<string> {
        const barUrl = new URL(data.url);
        const strURL = barUrl.toString();
        const nameFile = strURL.substring(strURL.lastIndexOf('/') + 1);

        const content = await readFile(barUrl);
        return await this.saveFile(content, 'temporary__' + key, '.' + nameFile.split('.')[1]);
    }
    private async getFileFromString(data: string, key: string): Promise<string> {
        let content = await readFile(data);
        console.log('data: ' + data.toString());
        console.log('content: ' + content.toString());
        return await this.saveFile(content, 'file' + key, '.txt');
    }

    private async saveFile(content: any, prefix: string, postfix: string): Promise<string> {
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
