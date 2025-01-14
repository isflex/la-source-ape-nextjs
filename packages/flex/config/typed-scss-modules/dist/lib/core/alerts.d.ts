export declare const LOG_LEVELS: readonly ["verbose", "error", "info", "silent"];
export type LogLevel = (typeof LOG_LEVELS)[number];
export declare const logLevelDefault: LogLevel;
export declare const setAlertsLogLevel: (logLevel: LogLevel) => void;
type CbFunc = (...args: any[]) => void;
type WrappedCbFunc<T extends CbFunc> = (...args: Parameters<T>) => ReturnType<T> | void;
export declare const alerts: {
    error: WrappedCbFunc<(message: string) => void>;
    warn: WrappedCbFunc<(message: string) => void>;
    notice: WrappedCbFunc<(message: string) => void>;
    info: WrappedCbFunc<(message: string) => void>;
    success: WrappedCbFunc<(message: string) => void>;
};
export {};
