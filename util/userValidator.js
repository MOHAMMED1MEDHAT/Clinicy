const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
    type: "object",
    properties: {
        name: {
            type: "string",
            // "pattern":"^[A-Z][a-z]*$"
        },
        email: {
            type: "string",
            pattern: ".+@.+..",
        },
        password: {
            type: "string",
            minLength: 5,
        },
        type: {
            type: "string",
        },
        imageUrl: {
            type: "string",
        },
        specialization: {
            type: "string",
        },
        gender: {
            type: "string",
        },
    },
    required: ["name", "email", "password", "gender", "type"],
};

module.exports = ajv.compile(schema);
