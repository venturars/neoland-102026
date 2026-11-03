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
        URL: "readonly",
        Buffer: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
      },
    },
    rules: js.configs.recommended.rules,
  },
  {
    files: ["src/clients/web/**/*.js"],
    languageOptions: {
      globals: {
        document: "readonly",
        window: "readonly",
        structuredClone: "readonly",
      },
    },
  },
];
