import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import { isIBody, Generator } from './generator';
import { asyncMiddleware } from './async-handler';
import { EchoPlugin } from './plugins/echo-plugin';

export interface IAppOptions {
    port?: number;
    tmpFolder: string;
}
export class App {

    private _server: http.Server;

    private readonly _generator: Generator;
    public get server() {
        return this._server;
    }
    private express: express.Express;
    public get options(): IAppOptions {
        return this._options;
    }
    constructor(private readonly _options: IAppOptions) {

        this.express = express();
        this.express.use(bodyParser.json({ type: ['application/json', 'application/json-patch+json'] }));
        this.express.use('/merge', asyncMiddleware(this.mergeHandler.bind(this)));

        this._generator = new Generator(_options.tmpFolder);
        this._generator.registerPlugin('echo', new EchoPlugin());
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
    private async mergeHandler(
        request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> {
        const body: any = request.body;
        if (!body || !isIBody(body)) {
            throw new Error('Bad request');
        }
        await this._generator.docMerge(body, response);
    }
}

async function test() {
    const appOptions: IAppOptions = {
        port: 8555,
        tmpFolder: '',
    };

    const app = new App(appOptions);
    await app.start();
    // tslint:disable-next-line:no-console
    console.log('Listening on port ' + app.server.address().port);
}

test();
