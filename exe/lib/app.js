"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const generator_1 = require("./generator");
const async_handler_1 = require("./async-handler");
const echo_plugin_1 = require("./plugins/echo-plugin");
const index_1 = require("./index");
class App {
    constructor(_options) {
        this._options = _options;
        this.express = express();
        this.express.use(bodyParser.json({ type: ['application/json', 'application/json-patch+json'] }));
        this.express.use('/merge', async_handler_1.asyncMiddleware(this.mergeHandler.bind(this)));
        this._generator = new generator_1.Generator(_options.tmpFolder);
        this._generator.registerPlugin('echo', new echo_plugin_1.EchoPlugin());
        this._generator.registerPlugin('docx', new index_1.DocGenerator());
    }
    get server() {
        return this._server;
    }
    get options() {
        return this._options;
    }
    get generator() {
        return this._generator;
    }
    async start() {
        if (this._server) {
            return this._server;
        }
        return new Promise((resolve, reject) => {
            this._server = http.createServer(this.express);
            this._server.listen(this.options.port || 0, () => {
                resolve(this._server);
            });
        });
    }
    async stop() {
        if (!this._server) {
            return;
        }
        return new Promise((resolve, reject) => {
            this._server.close(() => {
                this._server = null;
                resolve();
            });
        });
    }
    async mergeHandler(request, response, next) {
        const body = request.body;
        if (!body || !generator_1.isIBody(body)) {
            throw new Error('Bad request');
        }
        await this._generator.docMerge(body, response);
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map