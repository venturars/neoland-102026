// Lanza el editor como un programa aparte.
import { spawn } from "node:child_process";
// Escribe avisos en la terminal.
import console from "node:console";
// Saca la carpeta de un fichero y une rutas.
import { dirname, join } from "node:path";
// Permite marcar que el programa ha fallado.
import process from "node:process";
// Convierte la dirección del módulo en una ruta.
import { fileURLToPath } from "node:url";

// Rutas absolutas de la app y de la extensión.
const app = join(dirname(fileURLToPath(import.meta.url)), "..");
const extension = join(app, "src", "clients", "vscode");

// Abre una ventana de desarrollo con esta extensión.
const comando = `code --extensionDevelopmentPath="${extension}" "${app}"`;
const editor = spawn(comando, { shell: true, stdio: "inherit" });

// Avisa si no se ha podido abrir el editor.
editor.on("close", (codigo) => {
  if (codigo !== 0) {
    console.error("No se ha podido abrir el editor con el comando code.");
    process.exitCode = 1;
  }
});

console.log("Abre la vista Usuarios en la barra lateral del explorador.");
console.log("Recuerda tener el servidor en marcha: pnpm start");
