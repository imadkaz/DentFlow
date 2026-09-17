"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
require("winston-daily-rotate-file");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../config"));
const isDev = config_1.default.NODE_ENV === 'development';
const logDir = config_1.default.logDir;
// Ensure log directory exists
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir);
}
// Define log formats
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.splat(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json());
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({ format: 'HH:mm:ss' }), winston_1.default.format.splat(), winston_1.default.format.printf(({ timestamp, level, message, stack }) => {
    return stack
        ? `[${timestamp}] ${level}: ${message}\n${stack}`
        : `[${timestamp}] ${level}: ${message}`;
}));
// Create Winston logger instance
const logger = winston_1.default.createLogger({
    level: isDev ? 'debug' : 'info',
    format: logFormat,
    transports: [
        new winston_1.default.transports.Console({
            format: consoleFormat,
            level: isDev ? 'debug' : 'info',
        }),
        new winston_1.default.transports.DailyRotateFile({
            filename: path_1.default.join(logDir, 'info-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: 'info',
        }),
        new winston_1.default.transports.DailyRotateFile({
            filename: path_1.default.join(logDir, 'errors-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '30d',
            level: 'error',
        }),
    ],
});
exports.default = logger;
//# sourceMappingURL=logger.js.map