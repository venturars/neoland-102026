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
];
