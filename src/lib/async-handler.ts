import { Request, Response, RequestHandler, NextFunction } from 'express';
export type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any> | Promise<void>;

export function asyncMiddleware(asyncHandler: AsyncRequestHandler): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        asyncHandler(req, res, next)
            .catch(next);
    };
}
