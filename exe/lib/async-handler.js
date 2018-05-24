"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function asyncMiddleware(asyncHandler) {
    return (req, res, next) => {
        asyncHandler(req, res, next)
            .catch(next);
    };
}
exports.asyncMiddleware = asyncMiddleware;
//# sourceMappingURL=async-handler.js.map