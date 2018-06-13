import { IPluginInput, IPlugin, IPluginOutput } from '../interfaces';
export declare class DocGenerator implements IPlugin {
    constructor();
    generate(input: IPluginInput): Promise<IPluginOutput>;
    private generateDocx(modelFileName, data, outputFileName);
}
