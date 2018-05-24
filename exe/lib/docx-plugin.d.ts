import { IPluginOld, IPluginResult } from './generator';
import { IFile } from './input-ref/input-file';
import * as gn from './index';
export declare class FilePlugin implements IPluginOld {
    name?: string;
    cpt: number;
    merge(data: string | IFile, input: gn.IBody): Promise<IPluginResult>;
    generateRndmName(fileType: string): string;
    private docXmerge(data, input);
    private docxGenerator(data, input, fileURL);
}
