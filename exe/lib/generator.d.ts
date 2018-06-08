/// <reference types="express" />
import { InputFileRef } from './input-ref/input-file';
import { IPlugin, IPluginOutput } from './generateur/index';
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
export interface IBody {
    type: string;
    data: any;
    schema?: string;
    culture?: string;
    modeleRef: InputFileRef;
    outputFileName?: string;
    outputPath?: string;
    outputType: OutputType;
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
    private sendUrl(response, pluginOutput);
}
