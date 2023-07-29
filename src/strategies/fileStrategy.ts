import fs from "fs";
import type { VortalsStrategy } from "./types";

export type FileStrategy = VortalsStrategy & {
    parser: (file: string) => Record<string, unknown>;
    path: string;
    environment: string | undefined;
}

export abstract class BaseFileStrategy implements FileStrategy {
    parser: (file: string) => Record<string, unknown>;
    path: string;
    environment: string | undefined;

    constructor(
        parser: (file: string) => Record<string, unknown>,
        path: string,
        environment: string | undefined) {
        this.parser = parser;
        this.path = path;
        this.environment = environment;
    }

    load(): Record<string, string> {
        const baseFile: Record<string, unknown> = this.parser(fs.readFileSync(this.path, "utf8"));
        let envFile: Record<string, unknown> = {};

        if (this.environment) {
            envFile = this.parser(fs.readFileSync(this.path, "utf8"));
        }


        // TODO: This is wrong. It needs to be mapped to a key value like.
        return {
            ...baseFile,
            ...envFile,
        };
    }
}

export class JsonFileStrategy extends BaseFileStrategy {
    constructor(configPath = "configs/configuration.json", environment = process.env.APP_ENV) {
        super(JSON.parse, configPath, environment);
    }
}
