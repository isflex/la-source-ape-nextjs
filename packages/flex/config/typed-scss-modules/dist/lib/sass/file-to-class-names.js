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
exports.fileToClassNames = exports.nameFormatDefault = exports.NAME_FORMATS = void 0;
const change_case_1 = require("change-case");
const fs_1 = __importDefault(require("fs"));
const implementations_1 = require("../implementations");
const importer_1 = require("./importer");
const source_to_class_names_1 = require("./source-to-class-names");
const transformersMap = {
    camel: (className) => (0, change_case_1.camelCase)(className, { transform: change_case_1.camelCaseTransformMerge }),
    dashes: (className) => /-/.test(className) ? (0, change_case_1.camelCase)(className) : className,
    kebab: (className) => transformersMap.param(className),
    none: (className) => className,
    param: (className) => (0, change_case_1.paramCase)(className),
    snake: (className) => (0, change_case_1.snakeCase)(className),
};
const NAME_FORMATS_WITH_TRANSFORMER = Object.keys(transformersMap);
exports.NAME_FORMATS = [...NAME_FORMATS_WITH_TRANSFORMER, "all"];
exports.nameFormatDefault = "camel";
const fileToClassNames = (file_1, ...args_1) => __awaiter(void 0, [file_1, ...args_1], void 0, function* (file, { additionalData, includePaths = [], nameFormat: rawNameFormat, implementation, aliases, aliasPrefixes, importer, } = {}) {
    const { compile } = (0, implementations_1.getImplementation)(implementation);
    const nameFormat = (typeof rawNameFormat === "string" ? [rawNameFormat] : rawNameFormat);
    const nameFormats = nameFormat
        ? nameFormat.includes("all")
            ? NAME_FORMATS_WITH_TRANSFORMER
            : nameFormat
        : [exports.nameFormatDefault];
    const data = fs_1.default.readFileSync(file).toString();
    const result = compile(file, {
        data: additionalData ? `${additionalData}\n${data}` : data,
        loadPaths: includePaths,
        importer: (0, importer_1.customImporters)({ aliases, aliasPrefixes, importer }),
    });
    const classNames = yield (0, source_to_class_names_1.sourceToClassNames)(result.css, file);
    const transformers = nameFormats.map((item) => transformersMap[item]);
    const transformedClassNames = new Set([]);
    classNames.forEach((className) => {
        transformers.forEach((transformer) => {
            transformedClassNames.add(transformer(className));
        });
    });
    return Array.from(transformedClassNames).sort((a, b) => a.localeCompare(b));
});
exports.fileToClassNames = fileToClassNames;
