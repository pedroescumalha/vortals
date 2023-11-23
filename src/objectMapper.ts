function flat(target: Record<string, unknown>, delimiter: string): Record<string, unknown> {
    const res: Record<string, unknown> = {};

    function flatRecursively(object: Record<string, unknown> | unknown[], prevKey = ""): void {
        Object.entries(object).forEach(([key, value]) => {
            const isBuffer = Buffer.isBuffer(value);
            const isObject = typeof value === "object" && value !== null;

            const newKey = prevKey ? prevKey + delimiter + key : key;

            if (!isBuffer && isObject && Object.keys(value).length) {
                return flatRecursively(value as Record<string, unknown>, newKey);
            }

            res[newKey] = value;
        });
    }

    flatRecursively(target);

    return res;
}

export const objectMapper = {
    flat,
};
