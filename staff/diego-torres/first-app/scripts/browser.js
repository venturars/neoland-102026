// Abre la web de src/clients/web como fichero local en Google Chrome.
// No la sirve nadie: el servidor (pnpm start) solo atiende los datos.

import { spawn } from "node:child_process";
import console from "node:console";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";

const app = join(dirname(fileURLToPath(import.meta.url)), "..");
const pagina = pathToFileURL(join(app, "src", "clients", "web", "index.html"));

// Un perfil aparte: así el permiso de abajo solo vale para esta ventana,
// y Chrome no la junta con el que ya tengas abierto.
const perfil = join(tmpdir(), "first-app-chrome");

function rutasDeChrome() {
  if (process.platform === "win32") {
    return [
      join(
        process.env.ProgramFiles ?? "",
        "Google",
        "Chrome",
        "Application",
        "chrome.exe",
      ),
      join(
        process.env["ProgramFiles(x86)"] ?? "",
        "Google",
        "Chrome",
        "Application",
        "chrome.exe",
      ),
      join(
        process.env.LOCALAPPDATA ?? "",
        "Google",
        "Chrome",
        "Application",
        "chrome.exe",
      ),
    ];
  }
  if (process.platform === "darwin") {
    return ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"];
  }
  return ["/usr/bin/google-chrome", "/usr/bin/google-chrome-stable"];
}

const chrome = rutasDeChrome().find((ruta) => existsSync(ruta));

if (!chrome) {
  console.error(
    "No se ha encontrado Google Chrome. Instálalo y vuelve a intentarlo.",
  );
  process.exit(1);
}

// --allow-file-access-from-files deja que la página cargue los módulos
// de src/logic y src/queries desde el disco.
const navegador = spawn(
  chrome,
  [`--user-data-dir=${perfil}`, "--allow-file-access-from-files", pagina.href],
  { detached: true, stdio: "ignore" },
);
navegador.unref();

console.log(`Abriendo ${pagina.href}`);
console.log(
  "Recuerda tener el servidor en marcha en otra terminal: pnpm start",
);
