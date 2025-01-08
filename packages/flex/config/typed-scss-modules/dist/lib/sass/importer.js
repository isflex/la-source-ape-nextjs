"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customImporters = exports.aliasImporter = void 0;
const url_1 = require("url");
/**
 * Construct a SASS importer to create aliases for imports.
 */
const aliasImporter = ({ aliases, aliasPrefixes }) => (url) => {
    if (url in aliases) {
        const file = aliases[url];
        return new URL(file, (0, url_1.pathToFileURL)('node_modules'));
    }
    const prefixMatch = Object.keys(aliasPrefixes).find((prefix) => url.startsWith(prefix));
    if (prefixMatch) {
        return new URL(aliasPrefixes[prefixMatch] + url.substr(prefixMatch.length), (0, url_1.pathToFileURL)('node_modules'));
    }
    return null;
};
exports.aliasImporter = aliasImporter;
/**
 * Construct custom SASS importers based on options.
 *
 *  - Given aliases and alias prefix options, add a custom alias importer.
 *  - Given custom SASS importer(s), append to the list of importers.
 */
const customImporters = ({ aliases = {}, aliasPrefixes = {}, importer, }) => {
    const findFileUrl = [(0, exports.aliasImporter)({ aliases, aliasPrefixes })];
    const importers = [{ findFileUrl }];
    if (typeof importer === "function") {
        importers.push(importer);
    }
    else if (Array.isArray(importer)) {
        importers.push(...importer);
    }
    return importers;
};
exports.customImporters = customImporters;
