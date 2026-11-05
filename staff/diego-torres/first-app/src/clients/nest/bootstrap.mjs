// Crea carpetas y guarda ficheros.
import { mkdirSync, writeFileSync } from "node:fs";
// Une trozos de una ruta y saca la carpeta de un fichero.
import { dirname, join } from "node:path";
// Convierte rutas de fichero en direcciones que entiende import.
import { fileURLToPath, pathToFileURL } from "node:url";
// Traduce los decoradores @ a JavaScript que Node entiende.
import { transformFile } from "@swc/core";

// Los ficheros que hay que traducir.
const FICHEROS = [
  "users.service.js",
  "users.controller.js",
  "logic-exception.filter.js",
  "app.module.js",
  "main.js",
];

// Las opciones de la traducción.
const OPCIONES = {
  swcrc: false,
  jsc: {
    parser: { syntax: "ecmascript", decorators: true },
    transform: { legacyDecorator: true },
    target: "es2022",
  },
  module: { type: "es6" },
};

// La carpeta de este fichero y la carpeta de lo traducido.
const carpeta = dirname(fileURLToPath(import.meta.url));
const carpetaRun = join(carpeta, ".run");
mkdirSync(carpetaRun, { recursive: true });

// Traduce cada fichero y lo guarda en .run/.
for (const fichero of FICHEROS) {
  const { code } = await transformFile(join(carpeta, fichero), OPCIONES);

  // .run/ está un nivel más abajo, así que la lógica queda más lejos.
  const codigo = code.replaceAll("../../logic/", "../../../logic/");
  writeFileSync(join(carpetaRun, fichero), codigo);
}

// Arranca la API ya traducida.
await import(pathToFileURL(join(carpetaRun, "main.js")).href);
