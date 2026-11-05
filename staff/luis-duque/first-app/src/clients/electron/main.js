import { app, BrowserWindow } from "electron";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const directory = dirname(fileURLToPath(import.meta.url));

function openWindow() {
  const window = new BrowserWindow({
    width: 560,
    height: 760,
    backgroundColor: "#E4E8EA",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  window.loadFile(join(directory, "index.html"));
}

app.whenReady().then(() => {
  openWindow();
});

app.on("window-all-closed", () => {
  app.quit();
});
