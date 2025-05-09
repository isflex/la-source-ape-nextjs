"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypeDefinitionPath = void 0;
const path_1 = __importDefault(require("path"));
const CURRENT_WORKING_DIRECTORY = process.cwd();
/**
 * Given a file path to a SCSS file, generate the corresponding type definition
 * file path.
 *
 * @param file the SCSS file path
 */
const getTypeDefinitionPath = (file, options) => {
    let resolvedPath = file;
    if (options.outputFolder) {
        const relativePath = path_1.default.relative(CURRENT_WORKING_DIRECTORY, file);
        resolvedPath = path_1.default.resolve(CURRENT_WORKING_DIRECTORY, options.outputFolder, relativePath);
    }
    if (options.allowArbitraryExtensions) {
        const resolvedDirname = path_1.default.dirname(resolvedPath);
        // Note: `ext` includes a leading period (e.g. '.scss')
        const { name, ext } = path_1.default.parse(resolvedPath);
        // @see https://www.typescriptlang.org/tsconfig/#allowArbitraryExtensions
        return path_1.default.join(resolvedDirname, `${name}.d${ext}.ts`);
    }
    else {
        return `${resolvedPath}.d.ts`;
    }
};
exports.getTypeDefinitionPath = getTypeDefinitionPath;
