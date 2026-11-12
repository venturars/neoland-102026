import { app, BrowserWindow, dialog, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  countUsersAction,
  createUserAction,
  deleteUserAction,
  findUserAction,
  listUsersAction,
  updateUserAction,
} from "./user-actions.js";

// The main process is the only part of this client that reaches logic/.
// The page cannot make network requests: it asks here through preload.cjs.

const fileUrl = import.meta.url;
const filePath = fileURLToPath(fileUrl);
const folder = path.dirname(filePath);

// The buttons of the delete dialog, in the order they are shown.
const CANCEL_BUTTON = 0;
const DELETE_BUTTON = 1;

function createWindow() {
  // Build the paths from this file, not from the working directory,
  // so the client opens the same way from any folder.
  const preload = path.join(folder, "preload.cjs");
  const page = path.join(folder, "index.html");

  // These three values are already the defaults. They are written here
  // because they are the reason the page cannot use Node.
  const window = new BrowserWindow({
    width: 960,
    height: 640,
    minWidth: 760,
    minHeight: 480,
    title: "First App",
    webPreferences: {
      preload,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  window.loadFile(page);
}

async function confirmAndDeleteUser(event, id) {
  // The confirmation lives here and not in the page, so nothing in the page
  // can delete a user without going through the dialog.
  const window = BrowserWindow.fromWebContents(event.sender);
  const answer = await dialog.showMessageBox(window, {
    type: "warning",
    buttons: ["Cancelar", "Eliminar"],
    defaultId: CANCEL_BUTTON,
    cancelId: CANCEL_BUTTON,
    message: "¿Eliminar este usuario?",
    detail: "Esta acción no se puede deshacer.",
  });

  if (answer.response !== DELETE_BUTTON) {
    return { cancelled: true };
  }

  return deleteUserAction(id);
}

// Each channel is one action of the window. The first argument of a handler
// is the event, so the values sent by the page come after it.
ipcMain.handle("users:list", () => listUsersAction());
ipcMain.handle("users:count", () => countUsersAction());
ipcMain.handle("users:find", (event, id) => findUserAction(id));
ipcMain.handle("users:create", (event, name, email) =>
  createUserAction(name, email),
);
ipcMain.handle("users:update", (event, id, changes) =>
  updateUserAction(id, changes),
);
ipcMain.handle("users:delete", confirmAndDeleteUser);

// With a single window there is nothing left to show after closing it,
// so the application ends on every system, also on macOS.
app.on("window-all-closed", () => {
  app.quit();
});

// Do not wait with a top-level await: Electron loads this module before it
// is ready, and the ready event would never arrive while the module waits.
app.whenReady().then(createWindow);
