import cluster from 'cluster';

export const isMainCluster =
    process.env.NODE_APP_INSTANCE &&
    Number.parseInt(process.env.NODE_APP_INSTANCE) === 0;
export const isMainProcess = cluster.isPrimary || isMainCluster;

export const isDev = process.env.NODE_ENV === 'dev';

export const isTest = !!process.env.TEST;
export const cwd = process.cwd();

export type BaseType = boolean | number | string | undefined | null;

function formatValue<T extends BaseType = string>(
    key: string,
    defaultValue: T,
    callback?: (value: string) => T
): T {
    const value: string | undefined = process.env[key];

    if (typeof value === 'undefined') return defaultValue;

    if (!callback) return value as unknown as T;

    return callback(value);
}

export function env(key: string, defaultValue: string = '') {
    return formatValue(key, defaultValue);
}

export function envString(key: string, defaultValue: string = '') {
    return formatValue(key, defaultValue);
}

export function envNumber(key: string, defaultValue: number = 0) {
    const callback = value => {
        try {
            return Number(value);
        } catch {
            throw new Error(`${key} environment variable is a not number`);
        }
    };

    return formatValue(key, defaultValue, callback);
}

export function envBoolean(key: string, defaultValue: boolean = false) {
    const callback = value => {
        try {
            return Boolean(JSON.parse(value));
        } catch {
            throw new Error(`${key} environment variable is a not boolean`);
        }
    };

    return formatValue(key, defaultValue, callback);
}

export function envArray<T>(key: string, defaultValue: T[] = []) {
    const callback = value => {
        try {
            return JSON.parse(value);
        } catch {
            throw new Error(`${key} environment variable is a not array`);
        }
    };

    return formatValue(key, defaultValue, callback);
}
