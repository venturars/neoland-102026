import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([".venv/**"]),
  {
    files: ["**/*.js"],
    rules: {
      "prefer-const": "warn",
      "no-constant-binary-expression": "error",
    },
  },
]);
