import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
  {
    ignores: [".venv/**", "node_modules/**"],
  },
  {
    files: ["**/*.js"],
    plugins: {
      js,
    },
    extends: ["js/recommended"],
  },
]);
