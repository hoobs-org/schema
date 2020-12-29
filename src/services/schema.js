export function prune(input) {
    if (typeof (input) === "object") {
        if (input instanceof Date) {
            return input.toISOString().slice(0, 10);
        } else if (!Array.isArray(input)) {
            let output = {};

            for (const member in input) {
                const value = prune(input[member]);

                if (value !== undefined) output[member] = value;
            }

            if (Object.keys(output).length > 0) return output;
        } else {
            let output = [];

            for (const member of input) {
                const value = prune(member);

                if (value !== undefined) output.push(value);
            }

            if (output.length > 0) return output;
        }
    } else if (input !== undefined && input !== "") {
        return input;
    }
}

export function scaffold(input, callback) {
    if (input.type === "object") {
        let output = {};

        for (const item in input.properties) output[item] = scaffold(input.properties[item], callback);

        return output;
    } else if (input.type === "array") {
        return [scaffold(input.items, callback)];
    } else {
        return callback === undefined ? callback : callback(input);
    }
}

export function merge(first, second) {
    if (typeof (first) === "object" && typeof (second) === "object") {
        if (!Array.isArray(first)) {
            let output = {};

            for (const member in first) output[member] = merge(first[member], second[member]);

            return output
        } else {
            return Array.isArray(second) && second.length > 0 && prune(second[0]) !== undefined ? second : first;
        }
    } else {
        return (second !== undefined) ? second : first;
    }
}

export const draft = {
    $schema: "http://json-schema.org/draft-07/schema#",
    $id: "http://json-schema.org/draft-07/schema#",
    title: "Core schema meta-schema",
    definitions: {
        schemaArray: {
            type: "array",
            minItems: 1,
            items: { $ref: "#" },
        },
        nonNegativeInteger: { type: "integer", minimum: 0 },
        nonNegativeIntegerDefault0: {
            allOf: [ { $ref: "#/definitions/nonNegativeInteger" }, { default: 0 } ],
        },
        simpleTypes: { enum: [ "array", "boolean", "integer", "null", "number", "object", "string" ] },
        stringArray: {
            type: "array",
            items: { type: "string" },
            uniqueItems: true,
            default: [],
        },
    },
    type: [ "object", "boolean" ],
    properties: {
        $id: { type: "string", format: "uri-reference" },
        $schema: { type: "string", format: "uri" },
        $ref: { type: "string", format: "uri-reference" },
        $comment: { type: "string" },
        title: { type: "string" },
        description: { type: "string" },
        default: true,
        readOnly: { type: "boolean", default: false },
        examples: { type: "array", items: true },
        multipleOf: { type: "number", exclusiveMinimum: 0 },
        maximum: { type: "number" },
        exclusiveMaximum: { type: "number" },
        minimum: { type: "number" },
        exclusiveMinimum: { type: "number" },
        maxLength: { $ref: "#/definitions/nonNegativeInteger" },
        minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        pattern: { type: "string", format: "regex" },
        additionalItems: { $ref: "#" },
        items: {
            anyOf: [ { $ref: "#" }, { $ref: "#/definitions/schemaArray" } ],
            default: true,
        },
        maxItems: { $ref: "#/definitions/nonNegativeInteger" },
        minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        uniqueItems: { type: "boolean", default: false },
        contains: { $ref: "#" },
        maxProperties: { $ref: "#/definitions/nonNegativeInteger" },
        minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        required: { $ref: "#/definitions/stringArray" },
        additionalProperties: { $ref: "#" },
        definitions: {
            type: "object",
            additionalProperties: { $ref: "#" },
            default: {},
        },
        properties: {
            type: "object",
            additionalProperties: { $ref: "#" },
            default: {},
        },
        patternProperties: {
            type: "object",
            additionalProperties: { $ref: "#" },
            propertyNames: { format: "regex" },
            default: {},
        },
        dependencies: {
            type: "object",
            additionalProperties: { anyOf: [ { $ref: "#" }, { $ref: "#/definitions/stringArray" } ] },
        },
        propertyNames: { $ref: "#" },
        const: true,
        enum: {
            type: "array",
            items: true,
            minItems: 1,
            uniqueItems: true,
        },
        type: {
            anyOf: [
                { $ref: "#/definitions/simpleTypes" },
                {
                    type: "array",
                    items: { $ref: "#/definitions/simpleTypes" },
                    minItems: 1,
                    uniqueItems: true,
                },
            ],
        },
        format: { type: "string" },
        contentMediaType: { type: "string" },
        contentEncoding: { type: "string" },
        if: { $ref: "#" },
        then: { $ref: "#" },
        else: { $ref: "#" },
        allOf: { $ref: "#/definitions/schemaArray" },
        anyOf: { $ref: "#/definitions/schemaArray" },
        oneOf: { $ref: "#/definitions/schemaArray" },
        not: { $ref: "#" },
    },
    default: true,
};
