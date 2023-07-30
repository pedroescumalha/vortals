import type { VortalsStrategy } from "./types";
import { CONFIG_DELIMITER, CONFIG_PREFIX } from "./variables";

export class EnvironmentVariablesStrategy implements VortalsStrategy {
    private configPrefix = `${CONFIG_PREFIX}${CONFIG_DELIMITER}`;

    private transformKey(key: string): string {
        return key.replace(this.configPrefix, "");
    }

    private isVortalsKey(key: string): boolean {
        return key.indexOf(this.configPrefix) === 0;
    }

    public load(): Record<string, unknown> {
        const vortalsEnvVarsKeys = Object.keys(process.env).filter((k) => this.isVortalsKey(k));
        const envVars: Record<string, unknown> = {};

        for (const key of vortalsEnvVarsKeys) {
            envVars[this.transformKey(key)] = process.env[key];
        }

        return envVars;
    }
}
