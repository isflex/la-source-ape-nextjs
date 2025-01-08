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
exports.checkFile = exports.listDifferent = void 0;
const fs_1 = __importDefault(require("fs"));
const sass_1 = require("../sass");
const typescript_1 = require("../typescript");
const alerts_1 = require("./alerts");
const list_files_and_perform_sanity_checks_1 = require("./list-files-and-perform-sanity-checks");
const listDifferent = (pattern, options) => __awaiter(void 0, void 0, void 0, function* () {
    const files = (0, list_files_and_perform_sanity_checks_1.listFilesAndPerformSanityChecks)(pattern, options);
    // Wait for all the files to be checked.
    const validChecks = yield Promise.all(files.map((file) => (0, exports.checkFile)(file, options)));
    if (validChecks.includes(false)) {
        process.exit(1);
    }
});
exports.listDifferent = listDifferent;
const checkFile = (file, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classNames = yield (0, sass_1.fileToClassNames)(file, options);
        const typeDefinition = yield (0, typescript_1.classNamesToTypeDefinitions)(Object.assign({ classNames: classNames, file }, options));
        if (!typeDefinition) {
            // Assume if no type defs are necessary it's fine
            return true;
        }
        const path = (0, typescript_1.getTypeDefinitionPath)(file, options);
        if (!fs_1.default.existsSync(path)) {
            alerts_1.alerts.error(`[INVALID TYPES] Type file needs to be generated for ${file} `);
            return false;
        }
        const content = fs_1.default.readFileSync(path, { encoding: "utf8" });
        if (content !== typeDefinition) {
            alerts_1.alerts.error(`[INVALID TYPES] Check type definitions for ${file}`);
            return false;
        }
        return true;
    }
    catch (error) {
        alerts_1.alerts.error(`An error occurred checking ${file}:\n${JSON.stringify(error)}`);
        return false;
    }
});
exports.checkFile = checkFile;
