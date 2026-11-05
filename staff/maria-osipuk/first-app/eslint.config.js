import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([".venv/**", "node_modules/**"]),
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        process: "readonly",
        URL: "readonly",
      },
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": "error",
    },
  },
  {
    // The queries send their SQL to the data server with fetch.
    files: ["src/queries/**/*.js"],
    languageOptions: {
      globals: {
        fetch: "readonly",
      },
    },
  },
  {
    // The web page uses the DOM. It reaches the data through src/logic/.
    files: ["src/clients/web/**/*.js"],
    languageOptions: {
      globals: {
        document: "readonly",
        window: "readonly",
      },
    },
  },
  {
    // The Electron page uses the DOM. It reaches the data through window.users.
    files: ["src/clients/electron/app.js"],
    languageOptions: {
      globals: {
        document: "readonly",
        window: "readonly",
      },
    },
  },
  {
    // The extension uses the DOM. It reaches the data through its own API.
    files: ["src/clients/chrome/popup.js"],
    languageOptions: {
      globals: {
        document: "readonly",
        fetch: "readonly",
      },
    },
  },
  {
    // A sandboxed preload runs as CommonJS, so it uses require and not import.
    files: ["src/clients/electron/preload.cjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        require: "readonly",
      },
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": "error",
    },
  },
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      globals: {
        fetch: "readonly",
      },
    },
  },
]);
