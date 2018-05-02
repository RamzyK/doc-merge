import { InputFileRef, IInputFile } from './input-ref/input-file';
export interface IPluginResult {
}
export interface IPlugin {
    name?: string;
    merge(modele: string, data: InputFileRef, fileName?: string): Promise<IPluginResult>;
}
export interface IBody {
    type: string;
    data: IInputFile;
    schema?: string;
    culture?: string;
    file: InputFileRef;
    fileName: string;
    path: string;
}
export declare class Generator {
    private readonly options;
    private readonly docExtention;
    constructor(options: IBody);
    docMerge(input: IBody): Promise<IPluginResult>;
    registerPlugin(type: string, plugin: IPlugin): Promise<void>;
    private plugCall(modele, plugin);
}
