import { IPlugin, IPluginInput, IPluginOutput } from '../interfaces';
export declare class EchoPlugin implements IPlugin {
    generate(input: IPluginInput): Promise<IPluginOutput>;
}
