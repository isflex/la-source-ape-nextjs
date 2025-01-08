"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImplementation = exports.getDefaultImplementation = exports.IMPLEMENTATIONS = void 0;
/**
 * A list of all possible SASS package implementations that can be used to
 * perform the compilation and parsing of the SASS files. The expectation is
 * that they provide a nearly identical API so they can be swapped out but
 * all of the same logic can be reused.
 */
exports.IMPLEMENTATIONS = ["sass-embedded", "sass"];
/**
 * Determine which default implementation to use by checking which packages
 * are actually installed and available to use.
 *
 * @param resolver DO NOT USE - this is unfortunately necessary only for testing.
 */
const getDefaultImplementation = (resolver = require.resolve) => {
    let pkg = "sass";
    try {
        resolver("sass");
    }
    catch (error) {
        try {
            resolver("sass-embedded");
            pkg = "sass-embedded";
        }
        catch (ignoreError) {
            pkg = "sass";
        }
    }
    return pkg;
};
exports.getDefaultImplementation = getDefaultImplementation;
/**
 * Retrieve the desired implementation.
 *
 * @param implementation the desired implementation.
 */
const getImplementation = (implementation) => {
    if (implementation === "sass-embedded") {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return require("sass-embedded");
    }
    else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return require("sass");
    }
};
exports.getImplementation = getImplementation;
