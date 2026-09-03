import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import logger from './util/logger';

import config from './config';
import { HttpException } from './util/exceptions/http/httpException';
import { NotFoundError } from './util/exceptions/http/NotFoundError';
import { ConflictError } from './util/exceptions/http/ConflictError';
import requestLogger from './middleware/requestLogger';
import routes from './routes';


const app = express();

app.use(helmet());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/', routes);

app.use(requestLogger);

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


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof NotFoundError) {
        return res.status(404).json({ message: err.message });
    }
    if (err instanceof ConflictError) {
        return res.status(409).json({ message: err.message });
    }
    if (err instanceof HttpException) {
        return res.status(err.status).json({
            message: err.message,
            details: err.details,
        });
    }

    logger.error('Unhandled Error: %s', err.message);
    return res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(config.port,config.host, () => {
    logger.info('Server is running on port %d', config.port);
});