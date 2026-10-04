"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const logger_1 = __importDefault(require("./util/logger"));
const config_1 = __importDefault(require("./config"));
const httpException_1 = require("./util/exceptions/http/httpException");
const NotFoundError_1 = require("./util/exceptions/http/NotFoundError");
const ConflictError_1 = require("./util/exceptions/http/ConflictError");
const requestLogger_1 = __importDefault(require("./middleware/requestLogger"));
const routes_1 = __importDefault(require("./routes"));
const ValidationError_1 = require("./util/exceptions/http/ValidationError");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
app.use('/', routes_1.default);
app.use(requestLogger_1.default);
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//     if ( err instanceof HttpException) {
//         const httpException = err as HttpException;
//         // Log includes name, status, message, and details
//         logger.error(" %s [%d] \"%s\" %o", httpException.name, httpException.status, httpException.message, httpException.details || {});
//         // Response includes message and details
//         res.status(httpException.status).json({
//             message: httpException.message,
//             details: httpException.details || undefined
//         });
//     } else {
//         logger.error("Unhandled Error: %s", err.message);
//         res.status(500).json({ 
//             message: "Internal Server Error"
//         });
//     }
// })
app.use((req, res) => {
    res.status(404).json({ message: 'Resource not found' });
});
app.use((err, req, res, next) => {
    if (err instanceof NotFoundError_1.NotFoundError) {
        return res.status(404).json({ message: err.message });
    }
    if (err instanceof ConflictError_1.ConflictError) {
        return res.status(409).json({ message: err.message });
    }
    if (err instanceof ValidationError_1.ValidationError) {
        return res.status(400).json({ message: err.message });
    }
    if (err instanceof httpException_1.HttpException) {
        return res.status(err.status).json({
            message: err.message,
            details: err.details,
        });
    }
    logger_1.default.error('Unhandled Error: %s', err.message);
    return next(err);
});
app.listen(config_1.default.port, config_1.default.host, () => {
    logger_1.default.info('Server is running on port %d');
});
//# sourceMappingURL=index.js.map