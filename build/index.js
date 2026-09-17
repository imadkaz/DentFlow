"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const parser_1 = require("./util/parser");
const logger_1 = __importDefault(require("./util/logger"));
const filePath = path_1.default.join(process.cwd(), "data", "cake orders.csv");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const products = yield (0, parser_1.parseCSV)(filePath);
            for (const product of products) {
                logger_1.default.info(product + '\n');
            }
        }
        catch (error) {
            logger_1.default.error(error);
        }
    });
}
main();
//# sourceMappingURL=index.js.map