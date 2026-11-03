import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
  { ignores: [".venv/**", "node_modules/**"] },
  { files: ["**/*.js"], plugins: { js }, extends: ["js/recommended"] },
  {
    files: ["clients/web/**/*.js"],
    languageOptions: {
      globals: {
        console: "readonly",
        document: "readonly",
        fetch: "readonly",
        indexedDB: "readonly",
        initSqlJs: "readonly",
        URL: "readonly",
        window: "readonly",
      },
    },
  },
]);
