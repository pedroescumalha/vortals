import { afterEach, beforeEach, describe, it } from "node:test";
import { EnvironmentVariablesStrategy } from "./environmentVariablesStrategy";
import assert from "node:assert";

describe(EnvironmentVariablesStrategy.name, () => {
    const originalEnv = process.env;

    beforeEach(() => {
        process.env = {
            ...originalEnv,
            VORTALS__data1: "data1",
            data2: "data2",
        };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it("imports ands maps data correctly", () => {
        const strategy = new EnvironmentVariablesStrategy();

        const data = strategy.load();

        assert.equal(data.data1, process.env.VORTALS__data1);
    });

    it("ignores data that isn't prefixed", () => {
        const strategy = new EnvironmentVariablesStrategy();

        const data = strategy.load();

        assert.equal({}.propertyIsEnumerable.call(data, "data2"), false);
    });
});
