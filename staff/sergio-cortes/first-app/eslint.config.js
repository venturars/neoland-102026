import js from "@eslint/js";

export default [
  {
    ignores: [".venv/**", "node_modules/**", "clients/jupyter/**"],
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
];
