import { CONFIG_DELIMITER } from "./utils";

// TODO: JSDOC

export type VortalsConfigurationGuard<T> = (config: unknown) => config is T;

export interface VortalsStrategy {
    load(): Record<string, unknown>;
}

export interface VortalsConfiguration {
    get<T>(key: string, guard?: VortalsConfigurationGuard<T>): T | undefined;
    addStrategy(...strategies: VortalsStrategy[]): void;
}

// TODO: consider changing this to a Set
const data: Array<Record<string, unknown>> = [];

function hasChildren(configKeys: string[], parentKey: string): boolean {
    return configKeys.some((k) => k.startsWith(parentKey + CONFIG_DELIMITER));
}

function isArray(configKeys: string[], parentKey: string): boolean {
    return configKeys.every((k) => Number.isInteger(+k.substring((parentKey + CONFIG_DELIMITER).length)));
}

function filterProviderByKey(provider: Record<string, unknown>, configKey: string): Record<string, unknown> {
    const filteredObj: Record<string, unknown> = {};

    // TODO: this doesnt work. Ex key1 = a, and key2 = abc. These are two completely different keys.
    for (const key in provider) {
        if (key.startsWith(configKey)) {
            filteredObj[key] = provider[key];
        }
    }

    return filteredObj;
}

function buildConfigurationObject(configKey: string): unknown {
    for (const provider of data) {
        const configs = filterProviderByKey(provider, configKey);
        const filteredKeys = Object.keys(configs);

        if (!filteredKeys) {
            continue;
        }

        if (hasChildren(filteredKeys, configKey)) {
            if (isArray(filteredKeys, configKey)) {
                return Object.values(configs);
            }
            
            // TODO: it's an object
        }

        return configs[configKey];
    }

    return undefined;
}

function get<T>(key: string, guard?: VortalsConfigurationGuard<T>): T | undefined {
    const obj = buildConfigurationObject(key);

    if (obj === undefined) {
        return obj;
    }

    if (guard && !guard(obj)) {
        throw new Error("Invalid configuration");
    }

    return obj as T;
}

function addStrategy(...strategies: VortalsStrategy[]): void {
    for (const s of strategies) {
        data.push(s.load());
    }
}

export const configuration: VortalsConfiguration = {
    get,
    addStrategy,
};
