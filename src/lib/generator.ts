import { InputFileRef, IFile, IOutputMode } from './input-ref/input-file';

// tslint:disable-next-line:no-empty-interface
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
    // TODO: outputPath => config
    outputPath: string;
    downloadType: IOutputMode;
}

export class Generator {
    private readonly docExtention: Map<string, IPlugin>;
    constructor(private readonly options: IBody) {
        this.docExtention = new Map<string, IPlugin>();
    }

    public async  docMerge(input: IBody): Promise<IPluginResult> {
        const plugIn: IPlugin = this.docExtention.get(input.type);
        if (plugIn) {
            return plugIn.merge(input.modeleRef, input);
        } else {
            throw new Error(`Plugin not registered for ${input.type}`);
        }
    }
    public async registerPlugin(type: string, plugin: IPlugin): Promise<void> {
        this.docExtention.set(type, plugin);
    }
}
