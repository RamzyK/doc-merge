import { IPlugin, IPluginResult } from './generator';
import { IInputFile } from './input-ref/input-file';
export declare class DocXPlugin implements IPlugin {
    name?: string;
    merge(modele: string, data: string | IInputFile, fileName?: string): Promise<IPluginResult>;
}
