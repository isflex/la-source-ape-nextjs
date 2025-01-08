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
exports.writeFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sass_1 = require("../sass");
const typescript_1 = require("../typescript");
const alerts_1 = require("./alerts");
const remove_file_1 = require("./remove-file");
/**
 * Given a single file generate the proper types.
 *
 * @param file the SCSS file to generate types for
 * @param options the CLI options
 */
const writeFile = (file, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classNames = yield (0, sass_1.fileToClassNames)(file, options);
        const typeDefinition = yield (0, typescript_1.classNamesToTypeDefinitions)(Object.assign({ classNames,
            file }, options));
        const typesPath = (0, typescript_1.getTypeDefinitionPath)(file, options);
        const typesExist = fs_1.default.existsSync(typesPath);
        // Avoid outputting empty type definition files.
        // If the file exists and the type definition is now empty, remove the file.
        if (!typeDefinition) {
            if (typesExist) {
                (0, remove_file_1.removeSCSSTypeDefinitionFile)(file, options);
            }
            else {
                alerts_1.alerts.notice(`[NO GENERATED TYPES] ${file}`);
            }
            return;
        }
        // Avoid re-writing the file if it hasn't changed.
        // First by checking the file modification time, then
        // by comparing the file contents.
        if (options.updateStaleOnly && typesExist) {
            const fileModified = fs_1.default.statSync(file).mtime;
            const typeDefinitionModified = fs_1.default.statSync(typesPath).mtime;
            if (fileModified < typeDefinitionModified) {
                return;
            }
            const existingTypeDefinition = fs_1.default.readFileSync(typesPath, "utf8");
            if (existingTypeDefinition === typeDefinition) {
                return;
            }
        }
        // Files can be written to arbitrary directories and need to
        // be nested to match the project structure so it's possible
        // there are multiple directories that need to be created.
        const dirname = path_1.default.dirname(typesPath);
        if (!fs_1.default.existsSync(dirname)) {
            fs_1.default.mkdirSync(dirname, { recursive: true });
        }
        fs_1.default.writeFileSync(typesPath, typeDefinition);
        alerts_1.alerts.success(`[GENERATED TYPES] ${typesPath}`);
    }
    catch (error) {
        const { message, file, line, column } = error;
        const location = file ? ` (${file}[${line}:${column}])` : "";
        alerts_1.alerts.error(`${message}${location}`);
    }
});
exports.writeFile = writeFile;
