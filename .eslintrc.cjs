/**
 * ESLint currently doesn't support module format. Use `.cjs` extension to mark as a common js file.
 */
module.exports = {
  // An environment provides predefined global variables
  env: {
    browser: true,
    es2019: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:lit/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    // Specify the version of ECMAScript syntax you want to use
    ecmaVersion: 2019,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  // ESLint ignores node_modules by default
  ignorePatterns: ["out/", "dist/"],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'error'
  },
};
