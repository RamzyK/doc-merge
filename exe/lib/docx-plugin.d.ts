import { IPlugin, IPluginResult } from './generator';
import { IFile } from './input-ref/input-file';
import * as gn from './index';
export declare class FilePlugin implements IPlugin {
    name?: string;
    cpt: number;
    merge(data: string | IFile, input: gn.IBody): Promise<IPluginResult>;
    generateRndmName(fileType: string): string;
    private docXmerge(data, input);
    private docxFunc(data, input, dataUrl, iplugin);
    private docxGenerator(data, input, fileURL);
}
