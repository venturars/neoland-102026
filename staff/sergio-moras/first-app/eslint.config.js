import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
  {
    files: ["**/*.js"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        URL: "readonly",
        fetch: "readonly",
        AbortSignal: "readonly",
        console: "readonly",
      },
    },
  },
  {
    files: [
      "src/clients/browser/**/*.js",
      "src/clients/electron/**/*.js",
      "src/clients/chrome/extension/**/*.js",
    ],
    languageOptions: {
      globals: {
        document: "readonly",
      },
    },
  },
  {
    files: ["src/clients/vscode/panel.js"],
    languageOptions: {
      globals: {
        document: "readonly",
        window: "readonly",
        acquireVsCodeApi: "readonly",
      },
    },
  },
]);
