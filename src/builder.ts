/* eslint-disable no-use-before-define */
import { EnvironmentVariablesStrategy } from "./strategies/environmentVariablesStrategy";
import { JsonFileStrategy } from "./strategies/fileStrategy";
import { type VortalsStrategy } from "./strategies/types";
import { configuration, type VortalsConfiguration } from "./vortals";

interface VortalsConfigurationBuilder {
    addEnvironmentVariables(): VortalsConfigurationBuilder;
    addJsonFiles(): VortalsConfigurationBuilder;
    add(strategy: VortalsStrategy): VortalsConfigurationBuilder;
    build(): VortalsConfiguration;
}

const strategies: VortalsStrategy[] = [];

function addEnvironmentVariables(): VortalsConfigurationBuilder {
    strategies.push(new EnvironmentVariablesStrategy());
    return vortalsConfigurationBuilder;
}

// TODO: missing arguments for configuring the strategy
function addJsonFiles(configPath = "configs/configuration.json", environment = process.env.APP_ENV): VortalsConfigurationBuilder {
    strategies.push(new JsonFileStrategy(configPath, environment));
    return vortalsConfigurationBuilder;
}

function add(strategy: VortalsStrategy): VortalsConfigurationBuilder {
    strategies.push(strategy);
    return vortalsConfigurationBuilder;
}

function build(): VortalsConfiguration {
    configuration.addStrategies(...strategies);
    return configuration;
}

export const vortalsConfigurationBuilder: VortalsConfigurationBuilder = {
    addEnvironmentVariables,
    addJsonFiles,
    add,
    build,
};
