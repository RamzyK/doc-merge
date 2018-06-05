/// <reference types="node" />
/// <reference types="express" />
import * as express from 'express';
import * as http from 'http';
import { Generator } from './generator';
export interface IAppOptions {
    port?: number;
    tmpFolder: string;
}
export declare class App {
    private readonly _options;
    private _server;
    private express;
    private readonly _generator;
    readonly server: http.Server;
    readonly options: IAppOptions;
    readonly generator: Generator;
    constructor(_options: IAppOptions);
    start(): Promise<http.Server>;
    stop(): Promise<void>;
    downloadHandler(request: express.Request, response: express.Response, next: express.NextFunction): Promise<number>;
    private mergeHandler(request, response, next);
}
