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
];
