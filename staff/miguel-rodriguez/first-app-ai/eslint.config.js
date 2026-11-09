import js from "@eslint/js";
import babelParser from "@babel/eslint-parser";

export default [
  {
    files: ["src/clients/nest/**/*.js"],
    languageOptions: { parser: babelParser },
  },
  {
    files: ["src/clients/electron/main.js"],
    languageOptions: { globals: { URL: "readonly" } },
  },
  {
    ignores: [
      "dist/**",
      "**/node_modules/**",
      "**/.venv/**",
      "**/__pycache__/**",
      "**/.ipynb_checkpoints/**",
    ],
  },
  {
    files: ["**/*.js", "tools/**/*.mjs", "tests/git-workflow.test.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
    rules: js.configs.recommended.rules,
  },
  {
    files: ["src/db/server.js", "tests/**/*.js"],
    languageOptions: { globals: { URL: "readonly" } },
  },
  {
    files: ["src/queries/users.js", "tests/**/*.js"],
    languageOptions: { globals: { fetch: "readonly" } },
  },
  {
    files: ["src/logic/users-gender-count.js"],
    languageOptions: {
      globals: { fetch: "readonly", AbortSignal: "readonly" },
    },
  },
  {
    files: ["src/clients/vscode/**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        Buffer: "readonly",
        __dirname: "readonly",
        require: "readonly",
        module: "readonly",
        console: "readonly",
      },
    },
    rules: js.configs.recommended.rules,
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
  {
    files: [
      "src/clients/web/**/*.js",
      "src/clients/electron/app.js",
      "src/clients/chrome/popup.js",
    ],
    languageOptions: {
      globals: { document: "readonly", window: "readonly", fetch: "readonly" },
    },
  },
];
