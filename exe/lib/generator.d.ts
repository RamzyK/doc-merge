/// <reference types="express" />
import { InputFileRef, IBody } from 'doc-merge-intf';
import { IPlugin, IPluginOutput } from './interfaces';
import * as express from 'express';
export interface IPluginResult {
    state: string;
}
export interface IPluginOld {
    name?: string;
    merge(data: InputFileRef, input?: IBody, fileName?: string): Promise<IPluginResult>;
}
export declare enum OutputType {
    download = 0,
    url = 1,
    upload = 2,
}
export declare function isIBody(body: any): body is IBody;
export declare class Generator {
    private readonly _tmpFolder;
    private readonly docExtention;
    constructor(tmpFolder: string);
    docMerge(input: IBody, request: express.Request, response: express.Response): Promise<void>;
    generate(input: IBody): Promise<IPluginOutput>;
    registerPlugin(type: string, plugin: IPlugin): Promise<void>;
    private sendFile(response, pluginOutput);
    private sendUrl(response, url);
}
