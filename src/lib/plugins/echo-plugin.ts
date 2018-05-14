import { IPlugin, IPluginInput, IPluginOutput } from '../generateur/index';
import * as _ from 'lodash';
import * as fs from '../tools/fs';

export class EchoPlugin implements IPlugin {
    public async generate(input: IPluginInput): Promise<IPluginOutput> {

        const modelAsBase64 = await fs.getFileAsBase64(input.modelFileName);
        const outputData: any = {
            data: _.cloneDeep(input.data),
            model: modelAsBase64,
        };
        await fs.saveJson(outputData, input.outputFileName);
        const pluginOutput = {
            outputFileName: input.outputFileName,
            contentType: 'application/json',
        };
        return pluginOutput;
    }
}
