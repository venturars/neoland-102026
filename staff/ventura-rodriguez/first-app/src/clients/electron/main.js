/* global process */
import { app, BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const filePath = fileURLToPath(import.meta.url);
const folder = path.dirname(filePath);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
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

app.whenReady().then(() => {
  createWindow();
  app.on("activate", openIfNone);
});

app.on("window-all-closed", quitUnlessMac);
