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
exports.main = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const slash_1 = __importDefault(require("slash"));
const core_1 = require("./core");
const load_1 = require("./load");
const main = (pattern, cliOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const configOptions = yield (0, load_1.loadConfig)();
    const options = (0, load_1.mergeOptions)(cliOptions, configOptions);
    (0, core_1.setAlertsLogLevel)(options.logLevel);
    // When the provided pattern is a directory construct the proper glob to find
    // all .scss files within that directory. Also, add the directory to the
    // included paths so any imported with a path relative to the root of the
    // project still works as expected without adding many include paths.
    if (fs_1.default.existsSync(pattern) && fs_1.default.lstatSync(pattern).isDirectory()) {
        if (Array.isArray(options.includePaths)) {
            options.includePaths.push(pattern);
        }
        else {
            options.includePaths = [pattern];
        }
        // When the pattern provide is a directory, assume all .scss files within.
        pattern = (0, slash_1.default)(path_1.default.resolve(pattern, "**/*.scss"));
    }
    if (options.listDifferent) {
        yield (0, core_1.listDifferent)(pattern, options);
        return;
    }
    if (options.watch) {
        (0, core_1.watch)(pattern, options);
    }
    else {
        yield (0, core_1.generate)(pattern, options);
    }
});
exports.main = main;
