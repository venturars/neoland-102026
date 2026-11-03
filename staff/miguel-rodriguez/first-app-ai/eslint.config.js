import js from "@eslint/js";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/.venv/**",
      "**/__pycache__/**",
      "**/.ipynb_checkpoints/**",
    ],
  },
  {
    files: ["**/*.js"],
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
    files: ["src/clients/web/**/*.js"],
    languageOptions: { globals: { document: "readonly", window: "readonly", structuredClone: "readonly" } },
  },
];
