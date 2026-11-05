import { defineConfig } from "eslint/config";
import js from "@eslint/js";
// Permite que ESLint lea los decoradores @ de Nest.
import babelParser from "@babel/eslint-parser";
// Une rutas y saca la carpeta de un fichero.
import { dirname, join } from "node:path";
// Convierte la dirección del módulo en una ruta.
import { fileURLToPath } from "node:url";

// La configuración de Babel, con su ruta completa.
const carpeta = dirname(fileURLToPath(import.meta.url));
const babelConfig = join(carpeta, "babel.config.json");

export default defineConfig([
  {
    // dist/ es lo que genera Babel: no se revisa.
    ignores: [".venv/**", "node_modules/**", "dist/**"],
  },
  {
    // Los ficheros de Nest se leen con Babel por sus decoradores.
    files: ["src/clients/nest/**/*.js"],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: true,
        babelOptions: { configFile: babelConfig },
      },
    },
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
