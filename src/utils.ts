export const CONFIG_PREFIX = "VORTALS";
export const CONFIG_DELIMITER = "__";

export function isRecord(obj: unknown): obj is Record<string, unknown> {
    return typeof obj === "object" && !Array.isArray(obj) && obj !== null;
}

export function isArray(obj: unknown): obj is unknown[] {
    return Array.isArray(obj);
}
