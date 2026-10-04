"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, "../../.env") });
exports.default = {
    secret: process.env.secret || "default_secret_key",
    NODE_ENV: process.env.NODE_ENV || 'development', // Checks if the environment type (e.g., 'production' or 'development') is set; if not, it uses 'development' as default.
    logDir: 'logs',
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000, // Sets the port for the application; defaults to 3000 if not specified in the environment variables.
    host: process.env.HOST || 'localhost', // Sets the host for the application; defaults to 'localhost' if not specified in the environment variables.
};
//# sourceMappingURL=index.js.map