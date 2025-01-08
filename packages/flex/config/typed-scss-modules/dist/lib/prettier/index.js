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
Object.defineProperty(exports, "__esModule", { value: true });
exports.attemptPrettier = void 0;
const core_1 = require("../core");
const can_resolve_1 = require("./can-resolve");
const isPrettier = (t) => !!t &&
    typeof t === "object" &&
    t !== null &&
    "format" in t &&
    typeof t.format === "function" &&
    "resolveConfig" in t &&
    typeof t.resolveConfig === "function";
/**
 * Try to load prettier and config from project to format input,
 * fall back to input if prettier is not found or failed
 *
 * @param {file} file
 * @param {string} input
 */
const attemptPrettier = (file, input) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, can_resolve_1.canResolvePrettier)()) {
        return input;
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
    const prettier = require("prettier");
    if (!isPrettier(prettier)) {
        // doesn't look like prettier
        return input;
    }
    try {
        const config = yield prettier.resolveConfig(file, {
            editorconfig: true,
        });
        // try to return formatted output
        return prettier.format(input, Object.assign(Object.assign({}, config), { parser: "typescript" }));
    }
    catch (error) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        core_1.alerts.notice(`Tried using prettier, but failed with error: ${error}`);
    }
    // failed to format
    return input;
});
exports.attemptPrettier = attemptPrettier;
