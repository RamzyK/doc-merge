import * as gn from '../generateur/index';
export declare class DocGenerator implements gn.IPlugin {
    constructor();
    generate(input: gn.IPluginInput): Promise<gn.IPluginOutput>;
    private generateDocx(modelFileName, data, outputFileName);
}
