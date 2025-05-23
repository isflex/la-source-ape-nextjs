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
exports.mergeOptions = exports.DEFAULT_OPTIONS = exports.loadConfig = void 0;
const bundle_require_1 = require("bundle-require");
const joycon_1 = __importDefault(require("joycon"));
const path_1 = __importDefault(require("path"));
const core_1 = require("./core");
const implementations_1 = require("./implementations");
const sass_1 = require("./sass");
const typescript_1 = require("./typescript");
const VALID_CONFIG_FILES = [
    "typed-scss-modules.config.ts",
    "typed-scss-modules.config.js",
];
const joycon = new joycon_1.default();
/**
 * Load a custom config file in the project root directory with any options for this package.
 *
 * This supports config files in the following formats and order:
 *  - Named `config` export: `export const config = {}`
 *  - Default export: `export default {}`
 *  - `module.exports = {}`
 */
const loadConfig = () => __awaiter(void 0, void 0, void 0, function* () {
    const CURRENT_WORKING_DIRECTORY = process.cwd();
    const configPath = yield joycon.resolve(VALID_CONFIG_FILES, CURRENT_WORKING_DIRECTORY, path_1.default.parse(CURRENT_WORKING_DIRECTORY).root);
    if (configPath) {
        try {
            const configModule = yield (0, bundle_require_1.bundleRequire)({
                filepath: configPath,
            });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const config = 
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            configModule.mod.config || configModule.mod.default || configModule.mod;
            return config;
        }
        catch (error) {
            core_1.alerts.error(
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `An error occurred loading the config file "${configPath}":\n${error}`);
            return {};
        }
    }
    return {};
});
exports.loadConfig = loadConfig;
// Default values for all options that need defaults.
exports.DEFAULT_OPTIONS = {
    nameFormat: [sass_1.nameFormatDefault],
    implementation: (0, implementations_1.getDefaultImplementation)(),
    exportType: typescript_1.exportTypeDefault,
    exportTypeName: typescript_1.exportTypeNameDefault,
    exportTypeInterface: typescript_1.exportTypeInterfaceDefault,
    watch: false,
    ignoreInitial: false,
    listDifferent: false,
    ignore: [],
    quoteType: typescript_1.quoteTypeDefault,
    updateStaleOnly: false,
    logLevel: typescript_1.logLevelDefault,
    banner: typescript_1.bannerTypeDefault,
    outputFolder: null,
    allowArbitraryExtensions: false,
};
const removedUndefinedValues = (obj) => {
    for (const key in obj) {
        if (obj[key] === undefined) {
            delete obj[key];
        }
    }
    return obj;
};
/**
 * Given both the CLI and config file options merge into a single options object.
 *
 * When possible, CLI options will override config file options.
 *
 * Some options are only available in the config file. For example, a custom function can't
 * be easily defined via the CLI so some complex options are only available in the config file.
 */
const mergeOptions = (cliOptions, configOptions) => {
    return Object.assign(Object.assign(Object.assign({}, exports.DEFAULT_OPTIONS), configOptions), removedUndefinedValues(cliOptions));
};
exports.mergeOptions = mergeOptions;
