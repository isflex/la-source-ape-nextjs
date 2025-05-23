import { CLIOptions, ConfigOptions } from "./core";
/**
 * Load a custom config file in the project root directory with any options for this package.
 *
 * This supports config files in the following formats and order:
 *  - Named `config` export: `export const config = {}`
 *  - Default export: `export default {}`
 *  - `module.exports = {}`
 */
export declare const loadConfig: () => Promise<Record<string, never> | ConfigOptions>;
export declare const DEFAULT_OPTIONS: CLIOptions;
/**
 * Given both the CLI and config file options merge into a single options object.
 *
 * When possible, CLI options will override config file options.
 *
 * Some options are only available in the config file. For example, a custom function can't
 * be easily defined via the CLI so some complex options are only available in the config file.
 */
export declare const mergeOptions: (cliOptions: Partial<CLIOptions>, configOptions: Partial<ConfigOptions>) => ConfigOptions;
