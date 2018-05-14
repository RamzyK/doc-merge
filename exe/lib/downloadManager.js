"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const fs = require("fs");
let express = require('express');
let app = express();
const appendFile = util.promisify(fs.appendFile);
class DownloadHandler {
    constructor(url, headers, verb) {
        this.url = url;
        this.headers = headers;
        this.verb = verb;
    }
    async downloadFile(input) {
        let destination = this.url;
        app.get('/download', (req, res) => {
            if (input.downloadType.isDirectDownload) {
                res.setHeader('Content-disposition', `attachment; filename=download.${input.type}`);
                res.download(destination, input.outputFileName);
            }
        });
        let port = 8000;
        app.listen(port, () => {
            console.log(`listening on port ${port}`);
        });
        return null;
    }
    async uploadFile() {
        app.post('/', (request, response) => {
            console.log(request.body);
            response.send(request.body);
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