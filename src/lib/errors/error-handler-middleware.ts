import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { ExtError } from './ext-error';
import * as accepts from 'accepts';
export interface IErrorHandlerOptions {
    stackTrace?: boolean;
    accepts?: string[];
}
export class ErrorHandler {
    public readonly settings: IErrorHandlerOptions;
    public get handler(): ErrorRequestHandler {
        if (!this._handler) {
            this._handler = this.handle.bind(this);
        }
        return this._handler;
    }
    private _handler: ErrorRequestHandler;

    constructor(settings?: IErrorHandlerOptions) {
        settings = settings || {};
        settings.accepts = settings.accepts || ['json'];
        this.settings = settings;
    }

    private handle(err: any, req: Request, res: Response, next: NextFunction) {
        const errorData = ExtError.toErrorData(err, !this.settings.stackTrace);

        const acceptsInstance = accepts(req);
        if (!acceptsInstance.type(this.settings.accepts)) {
            next(err);
            return;
        }
        res.setHeader('Content-Type', 'application/json');
        res
            .status(parseInt(errorData.code, 10))
            .send({error: errorData});
    }
}
