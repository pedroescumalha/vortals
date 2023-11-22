import { BaseFileStrategy } from "../fileStrategy";

export class JsonFileStrategy extends BaseFileStrategy {
    constructor(configPath = "configs/configuration.json", environment = process.env.APP_ENV) {
        super(JSON.parse, configPath, environment);
    }
}
