import { InputFileRef, IFile, IBody } from 'doc-merge-intf';
import { IPluginInput, IPlugin, IPluginOutput } from './interfaces';
import * as path from 'path';
import * as express from 'express';
import * as uuid from 'uuid';
import {Url} from 'url';
import { InputFile } from './input-ref/input-file';
// tslint:disable:max-line-length
// tslint:disable-next-line:no-empty-interface
export interface IPluginResult {
    state: string;
}
export interface IPluginOld {
    name?: string;
    merge(data: InputFileRef, input?: IBody, fileName?: string): Promise<IPluginResult>;
}
export enum OutputType {
    download,
    url,
    upload,
}
export function isIBody(body: any): body is IBody {
    // TODO test data.modelRef is IInputFile
    return body && body.type && body.modeleRef && body.data;
}
// tslint:disable:no-console
export class Generator {
    private readonly _tmpFolder: string;
    private readonly docExtention: Map<string, IPlugin>;
    constructor(tmpFolder: string) {
        this._tmpFolder = tmpFolder;
        this.docExtention = new Map<string, IPlugin>();
    }

    public async docMerge(input: IBody, request: express.Request, response: express.Response): Promise<void> {
        const generateOutput = await this.generate(input);

        // formater le response

        switch (input.outputType) {
            case OutputType.download:
                await this.sendFile(response, generateOutput);
                break;
            case OutputType.url:
                let requestUrl = request.baseUrl;
                let fileName = path.basename(generateOutput.outputFileName);
                const url = requestUrl + `/../download/${fileName}`;
                await this.sendUrl(response, url.toString());
                break;
            case OutputType.upload:
                // upload file
                break;
            default:
                console.log('default case');
        }
    }
    public async generate(input: IBody): Promise<IPluginOutput> {
        const plugIn: IPlugin = this.docExtention.get(input.type);
        if (!plugIn) {
            throw new Error(`Plugin not registered for ${input.type}`);
        }
        // Transformer input => IPluginInput
        const inputFile = new InputFile({ tmpFolder: this._tmpFolder });
        const modelFileName = await inputFile.getFile(input.modeleRef);
        const outputFileName = path.join(this._tmpFolder, uuid.v4());
        const pluginInput: IPluginInput = {
            modelFileName,
            data: input.data,
            outputFileName,
        };

        return await plugIn.generate(pluginInput);

    }
    public async registerPlugin(type: string, plugin: IPlugin): Promise<void> {
        this.docExtention.set(type, plugin);
    }
    private async sendFile(response: express.Response, pluginOutput: IPluginOutput) {
        response.download(pluginOutput.outputFileName);
    }

    private async sendUrl(response: express.Response, url: string) {
        let resp: any = {
            url,
        };
        response.json(resp);
    }

}
