import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import babelParser from "@babel/eslint-parser";

export default defineConfig([
  {
    ignores: [".venv/**", "node_modules/**", "dist/**"],
  },
  {
    files: ["**/*.js"],
    plugins: {
      js,
    },
    extends: ["js/recommended"],
  },
  {
    // Babel reads the "@" of the Nest decorators, so ESLint can read them too.
    files: ["src/clients/nest/**/*.js"],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          plugins: [
            ["@babel/plugin-proposal-decorators", { version: "legacy" }],
          ],
        },
      },
    },
  },
]);
