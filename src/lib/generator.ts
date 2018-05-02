import { InputFileRef, IInputFile } from './input-ref/input-file';

// tslint:disable-next-line:no-empty-interface
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

export class Generator {
    private readonly docExtention: Map<string, IPlugin>;
    constructor(private readonly options: IBody) {
        this.docExtention = new Map<string, IPlugin>();
        // todo: Add process for each extention extention
    }

    public async  docMerge(input: IBody): Promise<IPluginResult> {
        const plugIn: IPlugin = this.docExtention.get(input.type);
        let docPath = typeof(input.file) === 'string' ? input.path : input.file.url;
        if (plugIn) {
            return plugIn.merge(docPath, input.data);
        } else {
            throw new Error(`Plugin not registered for ${input.type}`);
        }
    }
    public async registerPlugin(type: string, plugin: IPlugin): Promise<void> {
        this.docExtention.set(type, plugin);
    }

    private plugCall(modele: InputFileRef, plugin: IPlugin): void {
        if (typeof (this.options.file) === 'string') {
            plugin.merge(this.options.file.toString(), this.options.data, this.options.fileName);
        } else {
            plugin.merge(this.options.file.url, this.options.data, this.options.fileName);
        }
    }
}
