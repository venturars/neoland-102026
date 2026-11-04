// Da acceso a la aplicación de Electron y a sus ventanas.
import { app, BrowserWindow } from "electron";
// Saca la carpeta de un fichero y une trozos de una ruta.
import { dirname, join } from "node:path";
// Dice en qué sistema operativo se está ejecutando la app.
import process from "node:process";
// Convierte la dirección de este módulo en una ruta del disco.
import { fileURLToPath } from "node:url";

// La página está junto a este fichero, se lance desde donde se lance.
const carpeta = dirname(fileURLToPath(import.meta.url));
const pagina = join(carpeta, "index.html");

// Abre una ventana y carga en ella la página del cliente.
function abrirVentana() {
  const ventana = new BrowserWindow({ width: 800, height: 700 });
  ventana.loadFile(pagina);
}

// Cuando Electron está listo, abre la primera ventana.
app.whenReady().then(() => {
  abrirVentana();

  // En macOS, al pulsar el icono sin ventanas abiertas, abre una nueva.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      abrirVentana();
    }
  });
});

// Al cerrar todas las ventanas la app termina, salvo en macOS.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
