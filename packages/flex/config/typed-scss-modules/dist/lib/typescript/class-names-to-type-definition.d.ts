import { ClassName } from "lib/sass/file-to-class-names";
export type ExportType = "named" | "default";
export declare const EXPORT_TYPES: ExportType[];
export type QuoteType = "single" | "double";
export declare const QUOTE_TYPES: QuoteType[];
export interface TypeDefinitionOptions {
    banner: string;
    classNames: ClassName[];
    file: string;
    exportType: ExportType;
    exportTypeName?: string;
    exportTypeInterface?: string;
    quoteType?: QuoteType;
}
export declare const exportTypeDefault: ExportType;
export declare const exportTypeNameDefault: string;
export declare const exportTypeInterfaceDefault: string;
export declare const quoteTypeDefault: QuoteType;
export declare const bannerTypeDefault: string;
export declare const classNamesToTypeDefinitions: (options: TypeDefinitionOptions) => Promise<string | null>;
