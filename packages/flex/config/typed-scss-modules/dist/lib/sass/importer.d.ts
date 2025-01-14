import { Importer as SassImporter } from "sass";
type Importer = SassImporter<'async'>;
export { Importer };
export interface Aliases {
    [index: string]: string;
}
interface AliasImporterOptions {
    aliases: Aliases;
    aliasPrefixes: Aliases;
}
/**
 * Construct a SASS importer to create aliases for imports.
 */
export declare const aliasImporter: ({ aliases, aliasPrefixes }: AliasImporterOptions) => Importer;
export interface SASSImporterOptions {
    aliases?: Aliases;
    aliasPrefixes?: Aliases;
    importer?: Importer | Importer[];
}
/**
 * Construct custom SASS importers based on options.
 *
 *  - Given aliases and alias prefix options, add a custom alias importer.
 *  - Given custom SASS importer(s), append to the list of importers.
 */
export declare const customImporters: ({ aliases, aliasPrefixes, importer, }: SASSImporterOptions) => Importer[];
