import { InputFileRef, IFile, InputFile } from './input-ref/input-file';
import { IPluginInput, IPlugin, IPluginOutput } from './generateur/index';
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
export interface IBody {
    type: string;
    data: any;
    schema?: string;
    culture?: string;
    modeleRef: InputFileRef;
    outputFileName?: string;
    // TODO: outputPath => config
    outputPath?: string;
    outputType: OutputType;
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

    public async docMerge(input: IBody, response: Express.Response): Promise<void> {
        const generateOutput = await this.generate(input);

        // formater le response

        switch (input.outputType) {
            case OutputType.download:
                break;
            case OutputType.url:
                // return file url
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

        const pluginInput: IPluginInput = {
            modelFileName,
            data: input.data,
            outputFileName: input.outputFileName,
        };

        return await plugIn.generate(pluginInput);  // TODO lundi: Créer class implement IPlugin et ré-implémenter generate dessus

    }
    public async registerPlugin(type: string, plugin: IPlugin): Promise<void> {
        this.docExtention.set(type, plugin);
    }
}
