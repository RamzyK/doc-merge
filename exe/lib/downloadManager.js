"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const fs = require("fs");
let download = require('download-file');
const appendFile = util.promisify(fs.appendFile);
class DownloadHandler {
    constructor(url, headers, verb) {
        this.url = url;
        this.headers = headers;
        this.verb = verb;
        this.options = {
            directory: './dwnld_Folder',
            filename: 'cat.gif',
        };
    }
    async downloadFile(autoDowload, type) {
        let destination = this.url;
        let express = require('express');
        let app = express();
        app.get('/download', (req, res) => {
            res.setHeader('Content-disposition', `attachment; filename=download.${type}`);
            res.download(destination, 'a.docx');
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