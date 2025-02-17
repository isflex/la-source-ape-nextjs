"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watch = void 0;
const chokidar_1 = __importDefault(require("chokidar"));
const alerts_1 = require("./alerts");
const list_files_and_perform_sanity_checks_1 = require("./list-files-and-perform-sanity-checks");
const remove_file_1 = require("./remove-file");
const write_file_1 = require("./write-file");
/**
 * Watch a file glob and generate the corresponding types.
 *
 * @param pattern the file pattern to watch for file changes or additions
 * @param options the CLI options
 */
const watch = (pattern, options) => {
    (0, list_files_and_perform_sanity_checks_1.listFilesAndPerformSanityChecks)(pattern, options);
    alerts_1.alerts.success("Watching files...");
    chokidar_1.default
        .watch(pattern, {
        ignoreInitial: options.ignoreInitial,
        ignored: options.ignore,
    })
        .on("change", (path) => {
        alerts_1.alerts.info(`[CHANGED] ${path}`);
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        (0, write_file_1.writeFile)(path, options);
    })
        .on("add", (path) => {
        alerts_1.alerts.info(`[ADDED] ${path}`);
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        (0, write_file_1.writeFile)(path, options);
    })
        .on("unlink", (path) => {
        alerts_1.alerts.info(`[REMOVED] ${path}`);
        (0, remove_file_1.removeSCSSTypeDefinitionFile)(path, options);
    });
};
exports.watch = watch;
