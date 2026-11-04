/* global console */
import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";

const currentFile = fileURLToPath(import.meta.url);
const currentFolder = path.dirname(currentFile);

// The only sentences the person may see. Anything else is hidden.
const KNOWN_MESSAGES = [
  "The name is missing.",
  "The email is not valid.",
  "This email is already used.",
  "No user was found.",
  "There is nothing to update.",
  "The database failed.",
  "The request is not valid.",
];

function success(value) {
  return { ok: true, value };
}

function failure(error) {
  if (KNOWN_MESSAGES.includes(error.message)) {
    return { ok: false, error: error.message };
  }
  // A real bug stays in the terminal. The window only says the database failed.
  console.error(error);
  return { ok: false, error: "The database failed." };
}

// The page is not trusted code, so check the type of every value it sends.
function isWholeNumber(value) {
  return Number.isInteger(value);
}

function isText(value) {
  return typeof value === "string";
}

ipcMain.handle("list-users", async () => {
  try {
    const users = await listUsers();
    return success(users);
  } catch (error) {
    return failure(error);
  }
});

ipcMain.handle("update-user", async (event, input) => {
  const isObject = typeof input === "object" && input !== null;
  if (
    !isObject ||
    !isWholeNumber(input.id) ||
    !isText(input.name) ||
    !isText(input.email)
  ) {
    return failure(new Error("The request is not valid."));
  }
  try {
    const user = await updateUser({
      id: input.id,
      name: input.name,
      email: input.email,
    });
    return success(user);
  } catch (error) {
    return failure(error);
  }
});

ipcMain.handle("delete-user", async (event, input) => {
  const isObject = typeof input === "object" && input !== null;
  if (!isObject || !isWholeNumber(input.id)) {
    return failure(new Error("The request is not valid."));
  }
  try {
    await deleteUser({ id: input.id });
    return success(null);
  } catch (error) {
    return failure(error);
  }
});

function createWindow() {
  const window = new BrowserWindow({
    width: 480,
    height: 640,
    webPreferences: {
      preload: path.join(currentFolder, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  // No new windows and no leaving the page.
  window.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  window.webContents.on("will-navigate", (event) => event.preventDefault());
  window.loadFile(path.join(currentFolder, "index.html"));
}

app.whenReady().then(createWindow);

// Quit when the window closes, also on macOS.
app.on("window-all-closed", () => app.quit());
