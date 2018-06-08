import { InputFileRef, IBody, OutputType } from './index';
import * as request from 'request';
import { ExtError } from './errors/ext-error';

// tslint:disable:no-console
export class Client {

    constructor(urlService: string) {
        //
    }
    public async getUrl(type: string, data: any, model: InputFileRef): Promise<string> {
        let enumType: OutputType;
        switch (type) {
            case 'download':
                enumType = OutputType.download;
                break;
            case 'url':
                enumType = OutputType.url;
                break;
            case 'upload':
                enumType = OutputType.upload;
                break;
        }
        const body: IBody = {
            data,
            modeleRef: model,
            type: 'docx',
            outputType: enumType,
        };
        const testUrl = '';
        const responseUrl: any = await new Promise<void>((resolve, reject) => {
            let r = request.post(testUrl,
                {
                    body: JSON.stringify(body),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }, (error, response, responsseBody) => {
                    if (error) {
                        reject(error);
                    } else if (response.statusCode >= 400) {
                        reject(new ExtError(response.statusCode, responsseBody));
                    } else {
                        const { url } = JSON.parse(responsseBody);
                        resolve(url);
                    }
                });
            r.on('error', (error: any) => {
                reject(error);
            });
        });
        return testUrl;
    }
}
