import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import { createUser } from "../../logic/create-user.js";
import { listUsers } from "../../logic/list-users.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { usersGenderCount } from "../../logic/users-gender-count.js";

const OPERATIONS = {
  create: createUser,
  list: listUsers,
  find: findUserById,
  update: updateUser,
  delete: deleteUser,
  genderCount: usersGenderCount,
};
let mainWindow;

ipcMain.handle("users:call", async (event, operation, args) => {
  const senderIsWindow = event.sender === mainWindow?.webContents;
  const operationIsAllowed = Object.hasOwn(OPERATIONS, operation);
  const argsAreArray = Array.isArray(args);
  if (!senderIsWindow || !operationIsAllowed || !argsAreArray) {
    return { error: "Unknown operation" };
  }

  try {
    const run = OPERATIONS[operation];
    const data = await run(...args);
    return { data };
  } catch (error) {
    const message = error.message;
    return { error: message };
  }
});

function openWindow() {
  const preloadUrl = new URL("./preload.cjs", import.meta.url);
  const preload = fileURLToPath(preloadUrl);
  mainWindow = new BrowserWindow({
    width: 840,
    height: 760,
    webPreferences: {
      preload,
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
