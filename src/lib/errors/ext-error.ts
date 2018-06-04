import * as http from 'http';

export interface IErrorConstructorArgs {
    code: number;
    message: string;

    target: string;
    innerError: any;
}

export interface IErrorData {
    code: string;
    message: string;
    innerError?: any;
}
export class ExtError extends Error {
    public static getDefaultMessage(code?: number) {
        code = code || 500;
        return http.STATUS_CODES[code];
    }
    public static toErrorData(err: any, noStack?: boolean): IErrorData {
        if (err instanceof ExtError) {
            const data: IErrorData = {
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
        } else if (err instanceof Error) {
            const data: IErrorData = {
                code: '500',
                message: err.message || ExtError.getDefaultMessage(),
            };
            if (!noStack) {
                data.innerError = {
                    trace: err.stack,
                };
            }
            return data;
        } else {
            err = err || ExtError.getDefaultMessage();
            const data: IErrorData = {
                code: '500',
                message: err.toString(),
            };
            return data;
        }
    }

    private static getCode(code?: number): number {
        code = code || 500;
        return ExtError.getDefaultMessage(code) ? code : 500;
    }
    private static getArgs(args: any[]): IErrorConstructorArgs {
        const result: IErrorConstructorArgs = {
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
                        } else {
                            result.code = ExtError.getCode(result.code);
                        }
                        break;
                    case 'string':
                        if (result.code) {
                            if (stringProps.length) {
                                const prop = stringProps.shift();
                                (result as any)[prop] = p;
                            }
                        } else {
                            result.innerError = p;
                        }
                        break;
                    case 'object':
                        if (p instanceof Error) {
                            result.innerError = p;
                            if (!result.code) {
                                const errorCode = typeof ((p as any).code) === 'number' ? (p as any).code : 0;
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
    public readonly code: number;
    public readonly target: string;
    public readonly innerError: any;

    constructor(code?: number, message?: string, target?: string);
    // tslint:disable-next-line:unified-signatures
    constructor(innerError: any, code: number, message?: string, target?: string);
    constructor(innerError: any);
    constructor(...args: any[]) {
        const info = ExtError.getArgs(args);
        super(info.message);
        this.code = info.code;
        this.innerError = info.innerError;
        this.target = info.target;
    }
}

export interface IErrorConstructorArgs {
    code: number;
    message: string;
    target: string;
    innerError: any;
}
