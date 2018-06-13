import { IFile, InputFileRef } from 'doc-merge-intf';
export interface IInputFile extends IFile {
}
export interface IOutputFile extends IFile {
}
export interface IInputFileOptions {
    tmpFolder: string;
}
export declare class InputFile {
    private readonly options;
    private numFile;
    private readonly protocolHandlers;
    constructor(options: IInputFileOptions);
    getFile(data: InputFileRef): Promise<string>;
    private getFileFromUrl(data, key);
    private getFileFromFileUrl(data, key);
    private getFileFromString(data, key);
    private saveFile(content, fileName);
}
