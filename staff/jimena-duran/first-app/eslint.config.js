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
    files: ["src/clients/nest/**/*.js"],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        babelOptions: {
          configFile: "./babel.config.json",
        },
      },
    },
  },
]);
