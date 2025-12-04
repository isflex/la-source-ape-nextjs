/**
 * Converts a CSS source string to a list of exports (class names, keyframes, etc.)
 */
export declare const sourceToClassNames: (source: {
    toString(): string;
}, file: string) => Promise<string[]>;
