import { Implementations } from "../implementations";
import { Aliases, SASSImporterOptions } from "./importer";
export { Aliases };
export type ClassName = string;
declare const transformersMap: {
    readonly camel: (className: ClassName) => string;
    readonly dashes: (className: ClassName) => string;
    readonly kebab: (className: ClassName) => string;
    readonly none: (className: ClassName) => string;
    readonly param: (className: ClassName) => string;
    readonly snake: (className: ClassName) => string;
};
type NameFormatWithTransformer = keyof typeof transformersMap;
export declare const NAME_FORMATS: readonly [...("camel" | "dashes" | "kebab" | "none" | "param" | "snake")[], "all"];
export type NameFormat = (typeof NAME_FORMATS)[number];
export interface SASSOptions extends SASSImporterOptions {
    additionalData?: string;
    includePaths?: string[];
    nameFormat?: string | string[];
    implementation: Implementations;
}
export declare const nameFormatDefault: NameFormatWithTransformer;
export declare const fileToClassNames: (file: string, { additionalData, includePaths, nameFormat: rawNameFormat, implementation, aliases, aliasPrefixes, importer, }?: SASSOptions) => Promise<string[]>;
