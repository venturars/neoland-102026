// Lanza el CLI de Bruno como un programa aparte y espera a que termine.
import { spawnSync } from "node:child_process";
// Escribe avisos en la terminal.
import console from "node:console";
// Saca la carpeta de un fichero y une rutas.
import { dirname, join } from "node:path";
// Lee los argumentos y permite marcar que el programa ha fallado.
import process from "node:process";
// Convierte la dirección del módulo en una ruta.
import { fileURLToPath } from "node:url";

// Qué carpeta de la colección lanza cada argumento.
const CARPETAS = {
  online: "01-sql-online",
  offline: "02-sql-offline",
  ai: "03-ai",
};

// Rutas absolutas de la app, de la colección y del CLI.
const app = join(dirname(fileURLToPath(import.meta.url)), "..");
const coleccion = join(app, "src", "clients", "http", "bruno");
const bru = join(app, "node_modules", "@usebruno", "cli", "bin", "bru.js");

// Sin argumento se lanza la colección con la base en marcha.
const argumento = process.argv[2] ?? "online";
const carpeta = CARPETAS[argumento];

// Con un argumento que no existe, se avisa y no se lanza nada.
if (carpeta === undefined) {
  console.error(`No existe "${argumento}". Usa online, offline o ai.`);
  process.exit(1);
}

// Se lanza con Node porque sh y .bin/bru no sirven igual en Windows.
const ejecucion = spawnSync(process.execPath, [bru, "run", carpeta, "-r"], {
  cwd: coleccion,
  stdio: "inherit",
});

// Termina con el mismo resultado que el CLI. Sin resultado, es un fallo.
process.exit(ejecucion.status ?? 1);
