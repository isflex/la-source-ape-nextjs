/**
 * Try to load prettier and config from project to format input,
 * fall back to input if prettier is not found or failed
 *
 * @param {file} file
 * @param {string} input
 */
export declare const attemptPrettier: (file: string, input: string) => Promise<string>;
