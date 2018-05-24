/// <reference types="express" />
import { Request, Response, RequestHandler, NextFunction } from 'express';
export declare type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any> | Promise<void>;
export declare function asyncMiddleware(asyncHandler: AsyncRequestHandler): RequestHandler;
