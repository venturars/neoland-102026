import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([".venv/**", "node_modules/**"]),
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        process: "readonly",
        URL: "readonly",
      },
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": "error",
    },
  },
]);
