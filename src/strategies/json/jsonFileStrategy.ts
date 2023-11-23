import { isRecord } from "../../utils";
import { BaseFileStrategy } from "../fileStrategy";

export class JsonFileStrategy extends BaseFileStrategy {
    constructor(configPath = "configs/configuration.json", environment = process.env.APP_ENV) {
        const parser = (file: string): Record<string, unknown> => {
            const obj = JSON.parse(file);

            if (!isRecord(obj)) {
                throw new Error(`Invalid configuration file: ${configPath}.`);
            }

            return obj;
        };

        super(parser, configPath, environment);
    }
}
