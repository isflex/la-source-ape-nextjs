#!/usr/bin/env node
"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const implementations_1 = require("./implementations");
const main_1 = require("./main");
const sass_1 = require("./sass");
const typescript_1 = require("./typescript");
const _a = yargs_1.default
    .usage("Generate .scss.d.ts from CSS module .scss files.\nUsage: $0 <glob pattern> [options]")
    .example("$0 src", "All .scss files at any level in the src directory")
    .example("$0 src/**/*.scss", "All .scss files at any level in the src directory")
    .example("$0 src/**/*.scss --watch", "Watch all .scss files at any level in the src directory that are added or changed")
    .example("$0 src/**/*.scss --includePaths src/core src/variables", 'Search the "core" and "variables" directory when resolving imports')
    .example("$0 src/**/*.scss --aliases.~name variables", 'Replace all imports for "~name" with "variables"')
    .example("$0 src/**/*.scss --aliasPrefixes.~ ./node_modules/", 'Replace the "~" prefix with "./node_modules/" for all imports beginning with "~"')
    .example("$0 src/**/*.scss --ignore **/secret.scss", 'Ignore any file names "secret.scss"')
    .example("$0 src/**/*.scss --implementation sass", "Use the Dart SASS package")
    .example("$0 src/**/*.scss -e default --quoteType double", "Use double quotes around class name definitions rather than single quotes.")
    .example("$0 src/**/*.scss --logLevel error", "Output only errors")
    .demandCommand(1)
    .option("additionalData", {
    string: true,
    alias: "d",
    describe: "Prepends the SCSS code before each file.",
})
    .option("aliases", {
    coerce: (obj) => obj,
    alias: "a",
    describe: "Alias any import to any other value.",
})
    .option("aliasPrefixes", {
    coerce: (obj) => obj,
    alias: "p",
    describe: "A prefix for any import to rewrite to another value.",
})
    .option("nameFormat", {
    alias: "n",
    array: true,
    string: true,
    choices: sass_1.NAME_FORMATS,
    describe: "The name format that should be used to transform class names.",
})
    .option("implementation", {
    choices: implementations_1.IMPLEMENTATIONS,
    describe: "The SASS package to used to compile. This will default to the sass implementation you have installed.",
})
    .option("exportType", {
    choices: typescript_1.EXPORT_TYPES,
    alias: "e",
    describe: "The type of export used for defining the type definitions.",
})
    .option("exportTypeName", {
    string: true,
    describe: 'Set a custom type name for styles when --exportType is "default."',
})
    .option("exportTypeInterface", {
    string: true,
    describe: 'Set a custom interface name for styles when --exportType is "default."',
})
    .option("watch", {
    boolean: true,
    alias: "w",
    describe: "Watch for added or changed files and (re-)generate the type definitions.",
})
    .option("ignoreInitial", {
    boolean: true,
    describe: "Skips the initial build when passing the watch flag.",
})
    .option("listDifferent", {
    boolean: true,
    alias: "l",
    describe: "List any type definitions that are different than those that would be generated.",
})
    .option("includePaths", {
    array: true,
    string: true,
    alias: "i",
    describe: "Additional paths to include when trying to resolve imports.",
})
    .option("ignore", {
    string: true,
    array: true,
    describe: "Add a pattern or an array of glob patterns to exclude matches.",
})
    .option("outputFolder", {
    string: true,
    alias: "o",
    describe: "Define a (relative) folder to output the generated type definitions. Note this requires adding the output folder to tsconfig.json `rootDirs`.",
})
    .options("quoteType", {
    choices: typescript_1.QUOTE_TYPES,
    alias: "q",
    describe: "Specify the quote type so that generated files adhere to your TypeScript rules.",
})
    .options("updateStaleOnly", {
    boolean: true,
    alias: "u",
    describe: "Overwrite generated files only if the source file has more recent changes.",
})
    .option("logLevel", {
    choices: typescript_1.LOG_LEVELS,
    alias: "L",
    describe: "Verbosity level of console output",
})
    .options("banner", {
    string: true,
    describe: "Inserts text at the top of every output file for documentation purposes.",
})
    .options("allowArbitraryExtensions", {
    boolean: true,
    describe: 'Output filenames that will be compatible with the "arbitrary file extensions" feature that was introduced in TypeScript 5.0.',
})
    .parseSync(), { _: patterns } = _a, rest = __rest(_a, ["_"]);
// eslint-disable-next-line @typescript-eslint/no-floating-promises
(0, main_1.main)(patterns[0], Object.assign({}, rest));
