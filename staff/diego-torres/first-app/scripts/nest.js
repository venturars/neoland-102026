// Lanza Babel como un programa aparte y espera a que termine.
import { spawnSync } from "node:child_process";
// Escribe avisos en la terminal.
import console from "node:console";
// Borra la carpeta de la traducción anterior.
import { rmSync } from "node:fs";
// Saca la carpeta de un fichero y une rutas.
import { dirname, join } from "node:path";
// Permite marcar que el programa ha fallado.
import process from "node:process";
// Convierte rutas en direcciones que entiende import, y al revés.
import { fileURLToPath, pathToFileURL } from "node:url";

// Rutas absolutas de la app, de lo traducido y de Babel.
const app = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(app, "dist");
const babel = join(app, "node_modules", "@babel", "cli", "bin", "babel.js");

// Empieza limpio. Se hace aquí porque rm -rf no existe en Windows.
rmSync(dist, { recursive: true, force: true });

// Node no entiende los decoradores @, así que Babel los traduce.
// Solo traduce lo que usa esta API. Las rutas entre carpetas no cambian.
const traduccion = spawnSync(
  process.execPath,
  [
    babel,
    "src",
    "--out-dir",
    "dist",
    "--config-file",
    "./babel.config.json",
    "--only",
    "src/logic/**,src/queries/**,src/clients/nest/**",
  ],
  { cwd: app, stdio: ["ignore", "ignore", "inherit"] },
);

// Si la traducción falla, se avisa y no se arranca nada.
if (traduccion.status !== 0) {
  console.error("No se ha podido traducir la API de Nest con Babel.");
  process.exit(1);
}

// Arranca la API ya traducida.
const main = join(dist, "clients", "nest", "main.js");
await import(pathToFileURL(main).href);
