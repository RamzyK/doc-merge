import * as dl from './input-ref/input-file';
import { IBody } from './index';
export declare class DownloadHandler implements dl.IOutputFile, dl.IInputFile {
    readonly url: string;
    readonly headers: any;
    readonly verb: string;
    constructor(url: string, headers?: any, verb?: string);
    downloadFile(input: IBody): Promise<string>;
    uploadFile(input: IBody): Promise<string>;
}
