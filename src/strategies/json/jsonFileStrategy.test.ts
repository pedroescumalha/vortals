import fs from "fs";
import { beforeEach, describe, it, mock } from "node:test";
import { JsonFileStrategy } from "./jsonFileStrategy";
import assert from "node:assert";

describe(JsonFileStrategy.name, () => {
    beforeEach(() => {
        mock.restoreAll();
    });

    it("throws if file does not exist", () => {
        const strategy = new JsonFileStrategy("blaebealfaelfaefla.json");
        assert.throws(() => {
            strategy.load();
        });
    });

    it("throws if file is not a json", () => {
        mock.method(fs, "readFileSync", () => "");
        const strategy = new JsonFileStrategy();

        assert.throws(() => {
            strategy.load();
        });
    });

    it("imports primitives correctly", () => {
        const file = { data1: "", data2: 0, data3: false };
        mock.method(fs, "readFileSync", () => JSON.stringify(file));

        const strategy = new JsonFileStrategy();

        const data = strategy.load();

        assert.deepEqual(data, file);
    });

    it("imports arrays correctly", () => {
        const file = { data1: ["data1", "data2", "data3"] };

        const expectedValue = {
            "data1__0": file.data1[0],
            "data1__1": file.data1[1],
            "data1__2": file.data1[2],
        };

        mock.method(fs, "readFileSync", () => JSON.stringify(file));

        const strategy = new JsonFileStrategy();

        const data = strategy.load();

        assert.deepEqual(data, expectedValue);
    });

    it("throws if file is an array", () => {
        const file = [ { b: true } ];
        mock.method(fs, "readFileSync", () => JSON.stringify(file));

        const fileStrategy = new JsonFileStrategy();

        assert.throws(() => {
            fileStrategy.load();
        });
    });

    it("imports objects correctly", () => {
        const file = { 
            data1: true,
            data2: {
                data3: true,
                data4: {
                    data5: true,
                },
            },
        };

        const expectedValue = {
            "data1": file.data1,
            "data2__data3": file.data2.data3,
            "data2__data4__data5": true,
        };

        mock.method(fs, "readFileSync", () => JSON.stringify(file));

        const strategy = new JsonFileStrategy();

        const data = strategy.load();

        assert.deepEqual(data, expectedValue);
    });
});
