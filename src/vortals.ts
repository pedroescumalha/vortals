import { VortalsStrategy } from "./strategies/types";

type VortalsConfigurationGuard<T> = (config: unknown) => config is T;

interface VortalsConfiguration {
    get<T>(key: string, guard: VortalsConfigurationGuard<T>): T | undefined;
    addStrategy(strategy: VortalsStrategy): void;
}

const data: Array<Record<string, unknown>> = [];

function get<T>(key: string, guard?: VortalsConfigurationGuard<T>): T | undefined {
    for (const config of data) {
        // TODO: missing fetching sections
        if (key in config) {
            if (guard && !guard(config[key])) {
                throw new Error("Invalid configuration");
            }

            return config[key] as T;
        }
    }
    
    return undefined;
}

function addStrategy(strategy: VortalsStrategy): void {
    data.push(strategy.load());
}

export const configuration: VortalsConfiguration = {
    get,
    addStrategy,
};
