"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeSCSSTypeDefinitionFile = void 0;
const fs_1 = __importDefault(require("fs"));
const typescript_1 = require("../typescript");
const alerts_1 = require("./alerts");
/**
 * Given a single file remove the file
 *
 * @param file any file to remove
 */
const removeFile = (file) => {
    try {
        if (fs_1.default.existsSync(file)) {
            fs_1.default.unlinkSync(file);
            alerts_1.alerts.success(`[REMOVED] ${file}`);
        }
    }
    catch (error) {
        alerts_1.alerts.error(`An error occurred removing ${file}:\n${JSON.stringify(error)}`);
    }
};
/**
 * Given a single file remove the generated types if they exist
 *
 * @param file the SCSS file to generate types for
 */
const removeSCSSTypeDefinitionFile = (file, options) => {
    const path = (0, typescript_1.getTypeDefinitionPath)(file, options);
    removeFile(path);
};
exports.removeSCSSTypeDefinitionFile = removeSCSSTypeDefinitionFile;
