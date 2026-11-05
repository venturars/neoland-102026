import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";

const pagePath = fileURLToPath(new URL("./index.html", import.meta.url));

function openWindow() {
  const window = new BrowserWindow({
    width: 880,
    height: 720,
    title: "People",
  });
  window.loadFile(pagePath);
}

app.whenReady().then(() => {
  openWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      openWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
