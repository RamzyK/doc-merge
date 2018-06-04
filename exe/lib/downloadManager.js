"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const fs = require("fs");
let express = require('express');
let upLoader = require('express-uploader');
let app = express();
const appendFile = util.promisify(fs.appendFile);
const read = util.promisify(fs.readFile);
class DownloadHandler {
    constructor(url, headers, verb) {
        this.url = url;
        this.headers = headers;
        this.verb = verb;
    }
    async downloadFile(input) {
        let destination = this.url;
        app.get('/download', (req, res) => {
            res.setHeader('Content-disposition', `attachment; filename=download.${input.type}`);
            res.download(destination, input.outputFileName);
        });
        let port = 8000;
        app.listen(port, () => {
            console.log(`lisstening on port ${port}`);
        });
        return null;
    }
    async uploadFile(input) {
        app.post('/', async (request, response) => {
            console.log(await request.headers);
            console.log('\n');
            let chemin = this.url;
            let pageHeaders = request.headers;
            if (typeof (input.modeleRef) === 'string') {
                let buffer = await read(chemin);
                let contenu = buffer.toString();
                let body = input.modeleRef.toString();
                response.writeHead(200, {
                    'Content-Length': buffer.length,
                    'Content-Type': 'text/plain',
                    'host': 'localhost:8000',
                    'connection': 'keep-alive',
                });
                response.write(contenu);
                console.log(contenu);
            }
            else {
                throw new Error('ERROR while posting!');
            }
            response.end();
        });
        let port = 8000;
        app.listen(port, () => {
            console.log(`listening on port ${port}`);
        });
        return null;
    }
}
exports.DownloadHandler = DownloadHandler;
//# sourceMappingURL=downloadManager.js.map