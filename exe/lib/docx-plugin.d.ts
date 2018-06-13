import { IPluginOld, IPluginResult } from './generator';
import { IFile, IBody } from 'doc-merge-intf';
export declare class FilePlugin implements IPluginOld {
    name?: string;
    cpt: number;
    merge(data: string | IFile, input: IBody): Promise<IPluginResult>;
    generateRndmName(fileType: string): string;
    private docXmerge(data, input);
    private docxGenerator(data, input, fileURL);
}
