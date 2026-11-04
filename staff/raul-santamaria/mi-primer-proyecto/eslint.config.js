import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";

export default defineConfig([
  { ignores: [".venv/**", "node_modules/**"] },
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: globals.node,
    },
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: [
      "src/clients/browser/**/*.js",
      "src/clients/electron/app.js",
      "src/clients/chrome/popup.js",
    ],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["src/clients/vscode/extension.cjs"],
    languageOptions: {
      globals: { ...globals.node, ...globals.commonjs },
      sourceType: "commonjs",
    },
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["src/clients/vscode/panel.js"],
    languageOptions: {
      globals: { ...globals.browser, acquireVsCodeApi: "readonly" },
    },
    plugins: { js },
    extends: ["js/recommended"],
  },
]);
