import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
let mainWindow;

function openWindow() {
  mainWindow = new BrowserWindow({
    width: 840,
    height: 760,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  mainWindow.webContents.on("will-navigate", (event) => {
    event.preventDefault();
  });
  const pageUrl = new URL("./index.html", import.meta.url);
  const page = fileURLToPath(pageUrl);
  mainWindow.loadFile(page);
}

app.whenReady().then(() => {
  openWindow();
  app.on("activate", () => {
    const windows = BrowserWindow.getAllWindows();
    const hasNoWindows = windows.length === 0;
    if (hasNoWindows) {
      openWindow();
    }
  });
});

app.on("window-all-closed", () => {
  const isMac = process.platform === "darwin";
  if (!isMac) {
    app.quit();
  }
});
