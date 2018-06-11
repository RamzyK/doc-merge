import { InputFileRef } from '../index';
export declare class Client {
    private urlService;
    constructor(urlService: string);
    getUrl(type: string, data: any, model: InputFileRef): Promise<any>;
}
