import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
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
  {
    files: ["scripts/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
  },
  {
    files: ["src/clients/electron/main.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        process: "readonly",
      },
    },
  },
  {
    files: ["src/clients/electron/app.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        document: "readonly",
        fetch: "readonly",
      },
    },
  },
]);
