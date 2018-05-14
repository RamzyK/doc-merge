import { IPluginInput } from './plugin-input';
import { IPluginOutput } from './plugin-output';
export interface IPlugin {
    generate(input: IPluginInput): Promise<IPluginOutput>;
}
