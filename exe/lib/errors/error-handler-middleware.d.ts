/// <reference types="express" />
import { ErrorRequestHandler } from 'express';
export interface IErrorHandlerOptions {
    stackTrace?: boolean;
    accepts?: string[];
}
export declare class ErrorHandler {
    readonly settings: IErrorHandlerOptions;
    readonly handler: ErrorRequestHandler;
    private _handler;
    constructor(settings?: IErrorHandlerOptions);
    private handle(err, req, res, next);
}
