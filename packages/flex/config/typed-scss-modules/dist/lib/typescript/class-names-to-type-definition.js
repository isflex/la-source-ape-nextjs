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
exports.classNamesToTypeDefinitions = exports.bannerTypeDefault = exports.quoteTypeDefault = exports.exportTypeInterfaceDefault = exports.exportTypeNameDefault = exports.exportTypeDefault = exports.QUOTE_TYPES = exports.EXPORT_TYPES = void 0;
const os_1 = __importDefault(require("os"));
const reserved_words_1 = __importDefault(require("reserved-words"));
const core_1 = require("../core");
const prettier_1 = require("../prettier");
exports.EXPORT_TYPES = ["named", "default"];
exports.QUOTE_TYPES = ["single", "double"];
exports.exportTypeDefault = "named";
exports.exportTypeNameDefault = "ClassNames";
exports.exportTypeInterfaceDefault = "Styles";
exports.quoteTypeDefault = "single";
exports.bannerTypeDefault = "";
const classNameToNamedTypeDefinition = (className) => `export declare const ${className}: string;`;
const classNameToType = (className, quoteType) => {
    const quote = quoteType === "single" ? "'" : '"';
    return `  ${quote}${className}${quote}: string;`;
};
const isReservedKeyword = (className) => reserved_words_1.default.check(className, "es5", true) ||
    reserved_words_1.default.check(className, "es6", true);
const isValidName = (className) => {
    if (isReservedKeyword(className)) {
        core_1.alerts.warn(`[SKIPPING] '${className}' is a reserved keyword (consider renaming or using --exportType default).`);
        return false;
    }
    else if (/-/.test(className)) {
        core_1.alerts.warn(`[SKIPPING] '${className}' contains dashes (consider using 'camelCase' or 'dashes' for --nameFormat or using --exportType default).`);
        return false;
    }
    return true;
};
const classNamesToTypeDefinitions = (options) => __awaiter(void 0, void 0, void 0, function* () {
    if (options.classNames.length) {
        const lines = [];
        const { exportTypeName: ClassNames = exports.exportTypeNameDefault, exportTypeInterface: Styles = exports.exportTypeInterfaceDefault, } = options;
        switch (options.exportType) {
            case "default":
                if (options.banner)
                    lines.push(options.banner);
                lines.push(`export type ${Styles} = {`);
                lines.push(...options.classNames.map((className) => classNameToType(className, options.quoteType || exports.quoteTypeDefault)));
                lines.push(`};${os_1.default.EOL}`);
                lines.push(`export type ${ClassNames} = keyof ${Styles};${os_1.default.EOL}`);
                lines.push(`declare const styles: ${Styles};${os_1.default.EOL}`);
                lines.push(`export default styles;`);
                break;
            case "named":
                if (options.banner)
                    lines.push(options.banner);
                lines.push(...options.classNames
                    .filter(isValidName)
                    .map(classNameToNamedTypeDefinition));
                break;
        }
        if (lines.length) {
            const typeDefinition = lines.join(`${os_1.default.EOL}`) + `${os_1.default.EOL}`;
            return yield (0, prettier_1.attemptPrettier)(options.file, typeDefinition);
        }
        else {
            return null;
        }
    }
    else {
        return null;
    }
});
exports.classNamesToTypeDefinitions = classNamesToTypeDefinitions;
