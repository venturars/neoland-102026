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
  {
    // Las páginas de la web y de Electron usan las variables del navegador.
    files: ["src/clients/web/**/*.js", "src/clients/electron/**/*.js"],
    languageOptions: {
      globals: {
        document: "readonly",
        confirm: "readonly",
      },
    },
  },
  {
    // La ventana de la extensión usa las variables del navegador.
    files: ["src/clients/chrome/popup.js"],
    languageOptions: {
      globals: {
        document: "readonly",
        fetch: "readonly",
      },
    },
  },
  {
    // La vista de VS Code usa el navegador y la API del editor.
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
    files: ["src/queries/**/*.js"],
    languageOptions: {
      globals: {
        fetch: "readonly",
      },
    },
  },
]);
