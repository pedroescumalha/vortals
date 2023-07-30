import { VortalsStrategy } from "./strategies/types";

type VortalsConfigurationGuard<T> = (config: unknown) => config is T;

export interface VortalsConfiguration {
    get<T>(key: string, guard: VortalsConfigurationGuard<T>): T | undefined;
    addStrategy(strategy: VortalsStrategy): VortalsConfiguration;
    addStrategies(...strategies: VortalsStrategy[]): VortalsConfiguration;
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

function addStrategy(strategy: VortalsStrategy): VortalsConfiguration {
    data.push(strategy.load());
    return configuration;
}

function addStrategies(...strategies: VortalsStrategy[]): VortalsConfiguration {
    for (const s of strategies) {
        data.push(s.load());
    }

    return configuration;
}

export const configuration: VortalsConfiguration = {
    get,
    addStrategy,
    addStrategies,
};
