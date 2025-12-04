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
exports.sourceToClassNames = void 0;
const postcss_1 = __importDefault(require("postcss"));
const postcss_modules_1 = __importDefault(require("postcss-modules"));
/**
 * Converts a CSS source string to a list of exports (class names, keyframes, etc.)
 */
const sourceToClassNames = (source, file) => __awaiter(void 0, void 0, void 0, function* () {
    let result = {};
    yield (0, postcss_1.default)([
        (0, postcss_modules_1.default)({
            getJSON: (_, json) => {
                result = json;
            },
        }),
    ]).process(source, { from: file });
    return Object.keys(result);
});
exports.sourceToClassNames = sourceToClassNames;
