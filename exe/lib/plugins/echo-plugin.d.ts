import { IPlugin, IPluginInput, IPluginOutput } from '../generateur/index';
export declare class EchoPlugin implements IPlugin {
    generate(input: IPluginInput): Promise<IPluginOutput>;
}
