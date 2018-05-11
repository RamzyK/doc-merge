import { InputFileRef, IOutputMode } from './input-ref/input-file';
export interface IPluginResult {
    state: string;
}
export interface IPlugin {
    name?: string;
    merge(data: InputFileRef, input: IBody, fileName?: string): Promise<IPluginResult>;
}
export interface IBody {
    type: string;
    data: any;
    schema?: string;
    culture?: string;
    modeleRef: InputFileRef;
    outputFileName: string;
    outputPath: string;
    downloadType: IOutputMode;
}
export declare class Generator {
    private readonly options;
    private readonly docExtention;
    constructor(options: IBody);
    docMerge(input: IBody): Promise<IPluginResult>;
    registerPlugin(type: string, plugin: IPlugin): Promise<void>;
}
