"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
class ExtError extends Error {
    static getDefaultMessage(code) {
        code = code || 500;
        return http.STATUS_CODES[code];
    }
    static toErrorData(err, noStack) {
        if (err instanceof ExtError) {
            const data = {
                code: err.code + '',
                message: err.message,
            };
            if (!noStack) {
                data.innerError = {
                    trace: err.stack,
                };
            }
            if (err.innerError) {
                data.innerError = data.innerError || {};
                data.innerError.innerError = ExtError.toErrorData(err.innerError, noStack);
            }
            return data;
        }
        else if (err instanceof Error) {
            const data = {
                code: '500',
                message: err.message || ExtError.getDefaultMessage(),
            };
            if (!noStack) {
                data.innerError = {
                    trace: err.stack,
                };
            }
            return data;
        }
        else {
            err = err || ExtError.getDefaultMessage();
            const data = {
                code: '500',
                message: err.toString(),
            };
            return data;
        }
    }
    static getCode(code) {
        code = code || 500;
        return ExtError.getDefaultMessage(code) ? code : 500;
    }
    static getArgs(args) {
        const result = {
            code: undefined,
            message: undefined,
            target: undefined,
            innerError: undefined,
        };
        if (args) {
            const stringProps = ['message', 'target', 'innerError'];
            while (args.length) {
                let p = args.shift();
                switch (typeof p) {
                    case 'number':
                        if (p) {
                            result.code = p;
                        }
                        else {
                            result.code = ExtError.getCode(result.code);
                        }
                        break;
                    case 'string':
                        if (result.code) {
                            if (stringProps.length) {
                                const prop = stringProps.shift();
                                result[prop] = p;
                            }
                        }
                        else {
                            result.innerError = p;
                        }
                        break;
                    case 'object':
                        if (p instanceof Error) {
                            result.innerError = p;
                            if (!result.code) {
                                const errorCode = typeof (p.code) === 'number' ? p.code : 0;
                                result.code = ExtError.getCode(errorCode);
                            }
                        }
                }
            }
        }
        result.code = ExtError.getCode(result.code);
        result.message = result.message || ExtError.getDefaultMessage(result.code);
        return result;
    }
    constructor(...args) {
        const info = ExtError.getArgs(args);
        super(info.message);
        this.code = info.code;
        this.innerError = info.innerError;
        this.target = info.target;
    }
}
exports.ExtError = ExtError;
//# sourceMappingURL=ext-error.js.map