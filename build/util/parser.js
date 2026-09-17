"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCSV = void 0;
// src/utils/parser.ts
const fs_1 = __importDefault(require("fs"));
const logger_1 = __importDefault(require("./logger"));
const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = []; // Store parsed CSV rows as arrays
        const readStream = fs_1.default.createReadStream(filePath, { encoding: 'utf-8' }); // Create a readable stream for the file
        readStream.on('data', (chunk) => {
            // Process data chunks from the file
            const lines = chunk.split('\n').filter(line => line.trim() !== ''); // Split data into lines and remove empty lines
            lines.forEach((line) => {
                const columns = line.split(',').map(value => value.trim().replace(/^"(.*)"$/, '$1'));
                // Split line into columns, trim spaces, and remove quotes
                results.push(columns); // Add parsed row to results
            });
        });
        readStream.on('end', () => {
            resolve(results); // Resolve the promise with parsed data when done
        });
        readStream.on('error', (error) => {
            logger_1.default.error("Error while reading the stream of file %s, $o", filePath, error);
            reject(error); // Reject the promise if an error occurs
        });
    });
};
exports.parseCSV = parseCSV;
//# sourceMappingURL=parser.js.map