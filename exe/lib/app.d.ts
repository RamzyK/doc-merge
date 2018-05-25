/// <reference types="node" />
import * as http from 'http';
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
    constructor(_options: IAppOptions);
    start(): Promise<http.Server>;
    stop(): Promise<void>;
    private mergeHandler(request, response, next);
}
