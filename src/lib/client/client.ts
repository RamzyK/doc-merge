import { InputFileRef, IBody, OutputType } from '../../../../doc-merge-intf/src/lib/index';
import * as request from 'request';
import { ExtError } from '../../../../doc-merge-client/src/lib/errors/ext-error';

// tslint:disable:no-console
export class Client {
    private urlService: string;
    constructor(urlService: string) {
        this.urlService = urlService;
    }
    public async getUrl(type: string, data: any, model: InputFileRef): Promise<any> {
        const body: IBody = {
            data,
            modeleRef: model,
            type,
            outputType: OutputType.url,
        };
        const mergeUrl = this.urlService + '/merge';
        const responseUrl: any = await new Promise<void>((resolve, reject) => {
            let r = request.post(mergeUrl,
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

        return this.urlService + responseUrl;
    }
}
