import babelParser from "@babel/eslint-parser";
import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
  {
    ignores: ["node_modules/**", ".venv/**", "dist/**"],
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
    files: ["src/clients/electron/main.js"],
    languageOptions: {
      globals: {
        URL: "readonly",
      },
    },
  },
  {
    files: ["src/clients/electron/app.js"],
    languageOptions: {
      globals: {
        FormData: "readonly",
        document: "readonly",
      },
    },
  },
  {
    files: ["src/clients/nest/**/*.js"],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          configFile: "./babel.config.json",
        },
      },
      globals: {
        console: "readonly",
        URL: "readonly",
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
