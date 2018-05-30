import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import { isIBody, Generator } from './generator';
import { asyncMiddleware } from './async-handler';
import { EchoPlugin } from './plugins/echo-plugin';
import { DocGenerator } from './index';
import * as fs from 'fs';
import * as util from 'util';
import { IPluginOutput } from './generateur/index';

// tslint:disable:max-line-length

const exist = util.promisify(fs.exists);
export interface IAppOptions {
    port?: number;
    tmpFolder: string;
}
export class App {

    private _server: http.Server;
    private express: express.Express;
    private readonly _generator: Generator;
    public get server() {
        return this._server;
    }
    public get options(): IAppOptions {
        return this._options;
    }
    public get generator(): Generator {
        return this._generator;
    }
    constructor(private readonly _options: IAppOptions) {
        this.express = express();
        this.express.use(bodyParser.json({ type: ['application/json', 'application/json-patch+json'] }));
        this.express.use('/merge', asyncMiddleware(this.mergeHandler.bind(this)));
        this.express.use('/download', asyncMiddleware(this.downloadHandler.bind(this)));
        this._generator = new Generator(_options.tmpFolder);
        this._generator.registerPlugin('echo', new EchoPlugin());
        this._generator.registerPlugin('docx', new DocGenerator());
    }

    public async start(): Promise<http.Server> {
        if (this._server) {
            return this._server;
        }
        return new Promise<http.Server>(
            (resolve, reject) => {
                this._server = http.createServer(this.express);
                this._server.listen(this.options.port || 0, () => {
                    resolve(this._server);
                });
            }
        );
    }

    public async stop(): Promise<void> {
        if (!this._server) {
            return;
        }
        return new Promise<void>((resolve, reject) => {
            this._server.close(() => {
                this._server = null;
                resolve();
            });
        });
    }

    private async mergeHandler(request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> {
        const body: any = request.body;
        if (!body || !isIBody(body)) {
            throw new Error('Bad request');
        }
        await this._generator.docMerge(body, response);
    }

    private async downloadHandler(request: express.Request, response: express.Response, next: express.NextFunction): Promise<string> {
        let app = require('express');
        let pathToFile: string;
        app.get('/download/:fileName', async (rqst: express.Request, resp: express.Response, nxt: express.NextFunction): Promise<IPluginOutput> => {
            pathToFile = rqst.params.fileName;
            if (!exist(pathToFile)) {
                throw new Error(`Le fichier ${pathToFile} n'existe pas`);
            }
            let downloadedFile: IPluginOutput = {
                outputFileName: pathToFile,
                contentType: 'docx',
            };
            resp.download(pathToFile);
            return await downloadedFile;
        });
        return pathToFile;
    }
}
