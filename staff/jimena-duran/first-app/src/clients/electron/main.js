/* global process, URL */
import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";

const PAGE_URL = new URL("./index.html", import.meta.url);
const PAGE_PATH = fileURLToPath(PAGE_URL);

function openWindow() {
  const window = new BrowserWindow({ width: 800, height: 600 });
  window.loadFile(PAGE_PATH);
}

app.whenReady().then(() => {
  openWindow();
  app.on("activate", () => {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length === 0) {
      openWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
