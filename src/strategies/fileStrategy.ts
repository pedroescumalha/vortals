import fs from "fs";
import type { VortalsStrategy } from "../vortals";
import { CONFIG_DELIMITER } from "../utils";
import { objectMapper } from "../objectMapper";

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
            ...objectMapper.flat(baseFile, CONFIG_DELIMITER),
            ...objectMapper.flat(envFile, CONFIG_DELIMITER),
        };
    }
}
