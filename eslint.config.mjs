import { ESLint } from "eslint";

export default /** @type {import("eslint").Linter.Config} */ ({
    root: true,
    env: {
        node: true,
        es2022: true,
        jest: true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        project: "./tsconfig.json",
    },
    plugins: ["@typescript-eslint"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "prettier",
    ],
    rules: {
        "no-console": "warn",
        "@typescript-eslint/no-explicit-any": "off",
        '@typescript-eslint/no-empty-object-type': [
            'error',
            {
                allowInterfaces: 'with-single-extends',
            },
        ],
    },
});
