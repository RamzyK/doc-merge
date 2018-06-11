"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const request = require("request");
const ext_error_1 = require("../errors/ext-error");
class Client {
    constructor(urlService) {
        this.urlService = urlService;
    }
    async getUrl(type, data, model) {
        const body = {
            data,
            modeleRef: model,
            type,
            outputType: index_1.OutputType.url,
        };
        const testUrl = this.urlService;
        const responseUrl = await new Promise((resolve, reject) => {
            let r = request.post(testUrl, {
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
            }, (error, response, responsseBody) => {
                if (error) {
                    reject(error);
                }
                else if (response.statusCode >= 400) {
                    reject(new ext_error_1.ExtError(response.statusCode, responsseBody));
                }
                else {
                    const { url } = JSON.parse(responsseBody);
                    resolve(url);
                }
            });
            r.on('error', (error) => {
                reject(error);
            });
        });
        return responseUrl;
    }
}
exports.Client = Client;
//# sourceMappingURL=client.js.map