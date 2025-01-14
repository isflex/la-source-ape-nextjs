"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listFilesAndPerformSanityChecks = listFilesAndPerformSanityChecks;
const glob_1 = __importDefault(require("glob"));
const alerts_1 = require("./alerts");
/**
 * Return the files matching the given pattern and alert the user if only 0 or 1
 * files matched.
 *
 * @param pattern the file pattern to generate type definitions for
 * @param options the CLI options
 */
function listFilesAndPerformSanityChecks(pattern, options) {
    // Find all the files that match the provided pattern.
    const files = glob_1.default.sync(pattern, { ignore: options.ignore });
    if (!files || !files.length) {
        alerts_1.alerts.error("No files found.");
    }
    // This case still works as expected but it's easy to do on accident so
    // provide a (hopefully) helpful warning.
    if (files.length === 1) {
        alerts_1.alerts.warn(`Only 1 file found for ${pattern}. If using a glob pattern (eg: dir/**/*.scss) make sure to wrap in quotes (eg: "dir/**/*.scss").`);
    }
    return files;
}
