import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
  {
    files: ["src/clients/web/*.js"],
    languageOptions: {
      globals: {
        document: "readonly",
        window: "readonly",
        fetch: "readonly",
        Option: "readonly",
      },
    },
  },
  {
    files: ["src/clients/http/*.js", "tests/vanilla-user-client.test.js"],
    languageOptions: {
      globals: {
        console: "readonly",
        URL: "readonly",
        fetch: "readonly",
        process: "readonly",
      },
    },
  },
  {
    ignores: [".venv/**", "node_modules/**"],
  },
  {
    files: ["**/*.js"],
    plugins: {
      js,
    },
    extends: ["js/recommended"],
  },
]);
