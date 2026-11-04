/* global process */
import { app, BrowserWindow } from "electron";

// The page comes from the database program, which must already be running.
// Only 127.0.0.1 is used, never another host.
const PAGE_URL = "http://127.0.0.1:3000/electron/index.html";

function createWindow() {
  const window = new BrowserWindow({ width: 800, height: 600 });
  window.loadURL(PAGE_URL);
}

app.whenReady().then(() => {
  createWindow();

  // On macOS, clicking the icon with no window open opens one again.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows close, except on macOS.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
