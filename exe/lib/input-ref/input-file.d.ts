export declare type InputFileRef = string | IFile;
export declare enum OutputType {
    download = 0,
    url = 1,
    upload = 2,
}
export interface IOutputMode {
    isDirectDownload: boolean;
    dType: OutputType;
}
export interface IFile {
    url: string;
    headers?: any;
    verb?: string;
}
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
    private getFileFromUrl(data);
    private getFileFromFileUrl(data);
    private getFileFromString(data);
    private saveFile(content, prefix, postfix);
}
