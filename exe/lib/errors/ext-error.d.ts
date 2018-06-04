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
export declare class ExtError extends Error {
    static getDefaultMessage(code?: number): string;
    static toErrorData(err: any, noStack?: boolean): IErrorData;
    private static getCode(code?);
    private static getArgs(args);
    readonly code: number;
    readonly target: string;
    readonly innerError: any;
    constructor(code?: number, message?: string, target?: string);
    constructor(innerError: any, code: number, message?: string, target?: string);
    constructor(innerError: any);
}
export interface IErrorConstructorArgs {
    code: number;
    message: string;
    target: string;
    innerError: any;
}
