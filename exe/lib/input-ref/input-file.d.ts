export declare type InputFileRef = string | IInputFile;
export interface IInputFile {
    url: string;
    headers?: any;
    verb?: string;
}
export interface IInputFileOptions {
    tmpFolder: string;
}
export declare class InputFile {
    private readonly options;
    private readonly protocolHandlers;
    constructor(options: IInputFileOptions);
    getFile(data: InputFileRef): Promise<string>;
    private getFileFromUrl(data);
    private getFileFromFileUrl(data);
    private getFileFromString(data);
    private saveFile(content, prefix, postfix);
}
