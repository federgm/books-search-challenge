/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    testEnvironment: "node",
    transform: {
        "^.+.tsx?$": ["ts-jest", { tsconfig: "tsconfig.json" }],
    },
    moduleNameMapper: {
        "src/(.*)": "<rootDir>/src/$1",
        "test/(.*)": "<rootDir>/test/$1",
    },
    modulePaths: [
        "<rootDir>/src",
        "<rootDir>/test",
    ],
};
