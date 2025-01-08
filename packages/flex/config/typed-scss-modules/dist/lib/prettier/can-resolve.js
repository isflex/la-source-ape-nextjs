"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canResolvePrettier = canResolvePrettier;
// this is only extracted to a module to mock in testing as require.resolve can't be mocked.
// https://github.com/facebook/jest/issues/9543
function canResolvePrettier() {
    try {
        require.resolve("prettier");
        return true;
    }
    catch (_error) {
        // cannot resolve prettier
        return false;
    }
}
