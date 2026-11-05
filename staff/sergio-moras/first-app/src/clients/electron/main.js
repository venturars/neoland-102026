// Proceso principal del cliente de escritorio: abre la ventana y carga index.html desde el disco.
// La página no tiene acceso a Node: llama a logic/ como el cliente de navegador.

import { app, BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const WIDTH = 900;
const HEIGHT = 650;

// index.html está junto a este fichero, se lance desde donde se lance.
const thisFile = fileURLToPath(import.meta.url);
const folder = path.dirname(thisFile);
const pagePath = path.join(folder, "index.html");

// La página no puede ir a otra dirección.
function blockNavigation(event) {
  event.preventDefault();
}

// La página no puede abrir ventanas nuevas.
function denyNewWindow() {
  return { action: "deny" };
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: WIDTH,
    height: HEIGHT,
    title: "first-app",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });
  mainWindow.webContents.on("will-navigate", blockNavigation);
  mainWindow.webContents.setWindowOpenHandler(denyNewWindow);
  mainWindow.loadFile(pagePath);
}

function quit() {
  app.quit();
}

app.whenReady().then(createWindow);
app.on("window-all-closed", quit);
