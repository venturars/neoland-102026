import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import babelParser from "@babel/eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const babelConfigFile = path.join(here, "babel.config.json");

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
        requireConfigFile: true,
        babelOptions: {
          configFile: babelConfigFile,
        },
      },
    },
  },
]);
