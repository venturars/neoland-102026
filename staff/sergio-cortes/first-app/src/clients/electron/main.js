import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { usersGenderCount } from "../../logic/user-gender-count.js";

const filePath = fileURLToPath(import.meta.url);
const folder = path.dirname(filePath);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(folder, "preload.cjs"),
    },
  });
  const page = path.join(folder, "index.html");
  win.loadFile(page);
}

function openIfNone() {
  const windows = BrowserWindow.getAllWindows();

  if (windows.length === 0) {
    createWindow();
  }
}

function quitUnlessMac() {
  if (process.platform !== "darwin") {
    app.quit();
  }
}

function startApp() {
  ipcMain.handle("gender-count", () => usersGenderCount());
  createWindow();
  app.on("activate", openIfNone);
}

const ready = app.whenReady();
ready.then(startApp);
app.on("window-all-closed", quitUnlessMac);
