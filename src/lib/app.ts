import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import { isIBody, Generator } from './generator';
import { asyncMiddleware } from './async-handler';
import { EchoPlugin } from './plugins/echo-plugin';
import { DocGenerator } from './index';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';

import { IPluginOutput } from './generateur/index';

// tslint:disable:max-line-length
// tslint:disable:no-var-requires
let app = require('express');
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
        this.express.get('/download/:file', asyncMiddleware(this.downloadHandler.bind(this)));
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

    public async downloadHandler(request: express.Request, response: express.Response, next: express.NextFunction): Promise<number> {
        const file: string = request.params.file;
        const pathToFile = path.join(this._options.tmpFolder, 'src\\test\\docx-generator-data', file);
        let resp: number;
        if (!exist(pathToFile)) {
            throw new Error(`Le fichier ${pathToFile} n'existe pas`);
        }
        response.download(pathToFile, file);
        resp = response.statusCode;
        return resp;
    }

    private async mergeHandler(request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> {
        const body: any = request.body;
        if (!body || !isIBody(body)) {
            throw new Error('Bad request');
        }
        await this._generator.docMerge(body, response);
    }
}
