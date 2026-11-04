import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
  {
    ignores: ["node_modules/**", ".venv/**"],
  },
  {
    files: ["**/*.js"],
    plugins: {
      js,
    },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        fetch: "readonly",
        process: "readonly",
      },
    },
  },
  {
    files: ["src/db/server.js"],
    languageOptions: {
      globals: {
        Buffer: "readonly",
        console: "readonly",
      },
    },
  },
  {
    files: ["src/clients/rest/server.js"],
    languageOptions: {
      globals: {
        console: "readonly",
      },
    },
  },
  {
    files: ["src/clients/vscode/extension.js"],
    languageOptions: {
      globals: {
        URL: "readonly",
      },
    },
  },
  {
    files: ["src/clients/vscode/panel.js"],
    languageOptions: {
      globals: {
        acquireVsCodeApi: "readonly",
        document: "readonly",
        window: "readonly",
      },
    },
  },
  {
    files: ["src/clients/browser/app.js"],
    languageOptions: {
      globals: {
        clearTimeout: "readonly",
        document: "readonly",
        setTimeout: "readonly",
      },
    },
  },
]);
