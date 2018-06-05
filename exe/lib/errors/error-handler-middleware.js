"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ext_error_1 = require("./ext-error");
const accepts = require("accepts");
class ErrorHandler {
    get handler() {
        if (!this._handler) {
            this._handler = this.handle.bind(this);
        }
        return this._handler;
    }
    constructor(settings) {
        settings = settings || {};
        settings.accepts = settings.accepts || ['json'];
        this.settings = settings;
    }
    handle(err, req, res, next) {
        const errorData = ext_error_1.ExtError.toErrorData(err, !this.settings.stackTrace);
        const acceptsInstance = accepts(req);
        if (!acceptsInstance.type(this.settings.accepts)) {
            next(err);
            return;
        }
        res.setHeader('Content-Type', 'application/json');
        res
            .status(parseInt(errorData.code, 10))
            .send({ error: errorData });
    }
}
exports.ErrorHandler = ErrorHandler;
//# sourceMappingURL=error-handler-middleware.js.map