import fs from "fs";
import type { VortalsStrategy } from "./types";
import { CONFIG_DELIMITER } from "../utils";

export type FileStrategy = VortalsStrategy & {
    parser: (file: string) => Record<string, unknown>;
    path: string;
    environment: string | undefined;
}

export abstract class BaseFileStrategy implements FileStrategy {
    parser: (file: string) => Record<string, unknown>;
    path: string;
    environment: string | undefined;

    private mapToKeyValueObject(config: Record<string, unknown>): Record<string, unknown> {
        const res = {} as Record<string, unknown>;

        const mapToKeyValueObjectDeep = (data: Record<string, unknown> | unknown[], keyPrefix = ""): void => {
            for (const k in data) {
                const value = config[k as keyof typeof data];

                if (Array.isArray(value)) {
                    mapToKeyValueObjectDeep(value, keyPrefix + CONFIG_DELIMITER + k);
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

    constructor(
        parser: (file: string) => Record<string, unknown>,
        path: string,
        environment: string | undefined) {
        this.parser = parser;
        this.path = path;
        this.environment = environment;
    }

    load(): Record<string, unknown> {
        const baseFile: Record<string, unknown> = this.parser(fs.readFileSync(this.path, "utf8"));
        let envFile: Record<string, unknown> = {};

        if (this.environment) {
            envFile = this.parser(fs.readFileSync(this.path, "utf8"));
        }

        return {
            ...this.mapToKeyValueObject(baseFile),
            ...this.mapToKeyValueObject(envFile),
        };
    }
}

export class JsonFileStrategy extends BaseFileStrategy {
    constructor(configPath = "configs/configuration.json", environment = process.env.APP_ENV) {
        super(JSON.parse, configPath, environment);
    }
}
