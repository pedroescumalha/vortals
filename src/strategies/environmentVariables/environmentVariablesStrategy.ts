import type { VortalsStrategy } from "../../vortals";
import { CONFIG_DELIMITER, CONFIG_PREFIX } from "../../utils";

export class EnvironmentVariablesStrategy implements VortalsStrategy {
    private configPrefix = `${CONFIG_PREFIX}${CONFIG_DELIMITER}`;

    private transformKey(key: string): string {
        return key.replace(this.configPrefix, "");
    }

    private isVortalsKey(key: string): boolean {
        return key.startsWith(this.configPrefix);
    }

    public load(): Record<string, unknown> {
        const envVars: Record<string, unknown> = {};

        for (const key in process.env) {
            if (this.isVortalsKey(key)) {
                envVars[this.transformKey(key)] = process.env[key];
            }
        }

        return envVars;
    }
}
