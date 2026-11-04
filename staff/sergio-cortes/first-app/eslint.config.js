import js from "@eslint/js";

export default [
  {
    ignores: [".venv/**", "node_modules/**", "src/clients/jupyter/**"],
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        URL: "readonly",
      },
    },
  },
  {
    files: ["src/clients/http/**/*.js"],
    languageOptions: {
      globals: {
        console: "readonly",
      },
    },
  },
  {
    files: ["src/clients/web/**/*.js"],
    languageOptions: {
      globals: {
        document: "readonly",
        fetch: "readonly",
      },
    },
  },
  {
    files: ["src/clients/electron/main.js"],
    languageOptions: {
      globals: {
        process: "readonly",
      },
    },
  },
  {
    files: ["src/clients/electron/app.js"],
    languageOptions: {
      globals: {
        document: "readonly",
        fetch: "readonly",
      },
    },
  },
  {
    files: ["src/clients/chrome/server.js"],
    languageOptions: {
      globals: {
        console: "readonly",
      },
    },
  },
  {
    files: ["src/clients/chrome/popup.js"],
    languageOptions: {
      globals: {
        document: "readonly",
        fetch: "readonly",
        URLSearchParams: "readonly",
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
];
