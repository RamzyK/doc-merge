import * as dl from './input-ref/input-file';
export declare class DownloadHandler implements dl.IOutputFile, dl.IInputFile {
    readonly url: string;
    readonly headers: any;
    readonly verb: string;
    private options;
    constructor(url: string, headers?: any, verb?: string);
    downloadFile(autoDowload: boolean, type: string): Promise<string>;
}
