import { IPlugin, IPluginResult } from './generator';
import { IFile } from './input-ref/input-file';
import * as gn from './index';
export declare class DocXPlugin implements IPlugin {
    name?: string;
    cpt: number;
    merge(data: string | IFile, input: gn.IBody): Promise<IPluginResult>;
    generateRndmName(compteur: number): string;
    private docXmerge(data, input);
    private docxGenerator(data, input, fileURL);
}
