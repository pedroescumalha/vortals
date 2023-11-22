import fs from "fs";
import type { VortalsStrategy } from "../vortals";
import { CONFIG_DELIMITER } from "../utils";

export type FileStrategy = VortalsStrategy & {
    parser: (file: string) => Record<string, unknown>;
    path: string;
    environment: string | undefined;
}

export abstract class BaseFileStrategy implements FileStrategy {
    constructor(
        readonly parser: (file: string) => Record<string, unknown>,
        readonly path: string,
        readonly environment: string | undefined
    ) {
    }

    load(): Record<string, unknown> {
        const baseFile: Record<string, unknown> = this.parser(fs.readFileSync(this.path, "utf8"));
        let envFile: Record<string, unknown> = {};

        if (this.environment) {
            const file = fs.readFileSync(this.path, "utf8");
            envFile = this.parser(file);
        }

        return {
            ...this.mapToKeyValueObject(baseFile),
            ...this.mapToKeyValueObject(envFile),
        };
    }

    private mapArray(config: unknown[], keyPrefix: string): Record<string, unknown> {
        return config.reduce((acc: Record<string, unknown>, curr: unknown, i) => {
            return { ...acc, [keyPrefix + CONFIG_DELIMITER + i.toString()]: curr };
        }, {});
    }

    private mapToKeyValueObject(config: Record<string, unknown>): Record<string, unknown> {
        let res = {} as Record<string, unknown>;

        const mapToKeyValueObjectDeep = (data: Record<string, unknown> | unknown[], keyPrefix = ""): void => {
            for (const k in data) {
                const value = config[k as keyof typeof data];

                if (Array.isArray(value)) {
                    res = {
                        ...res,
                        ...this.mapArray(
                            value,
                            keyPrefix ? keyPrefix + CONFIG_DELIMITER + k : k 
                        ),
                    };

                    continue;
                }

                if (typeof value === "object" && value !== null) {
                    mapToKeyValueObjectDeep(value as Record<string, unknown>, keyPrefix + CONFIG_DELIMITER + k);
                }

                res[keyPrefix ? keyPrefix + CONFIG_DELIMITER + k : k] = value;
            }
        };

        mapToKeyValueObjectDeep(config);

        return res;
    }
}
