import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";

export default defineConfig([
  { ignores: [".venv/**", "node_modules/**", "src/clients/nest/.run/**"] },
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: globals.node,
    },
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    ignores: [
      "src/clients/nest/app.module.js",
      "src/clients/nest/logic-exception.filter.js",
      "src/clients/nest/users.controller.js",
      "src/clients/nest/users.service.js",
    ],
  },
  {
    files: ["src/clients/nest/**/*.js"],
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
