import path from "node:path";
import { fileURLToPath } from "node:url";
import { app, BrowserWindow, ipcMain } from "electron";
import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

const NAME_IS_EMPTY = "Name is empty";
const EMAIL_IS_INVALID = "Email is invalid";
const EMAIL_IS_ALREADY_USED = "Email is already used";
const USER_NOT_FOUND = "User not found";
const COULD_NOT_CREATE_THE_USER = "Could not create the user";
const COULD_NOT_LIST_THE_USERS = "Could not list the users";
const COULD_NOT_FIND_THE_USER = "Could not find the user";
const COULD_NOT_UPDATE_THE_USER = "Could not update the user";
const COULD_NOT_DELETE_THE_USER = "Could not delete the user";
const CREATE_USER = "create-user";
const LIST_USERS = "list-users";
const FIND_USER_BY_ID = "find-user-by-id";
const UPDATE_USER = "update-user";
const DELETE_USER = "delete-user";

const directory = path.dirname(fileURLToPath(import.meta.url));

function shownMessage(error, fallback) {
  if (error instanceof Error) {
    const message = error.message;
    if (message === NAME_IS_EMPTY) {
      return message;
    }
    if (message === EMAIL_IS_INVALID) {
      return message;
    }
    if (message === EMAIL_IS_ALREADY_USED) {
      return message;
    }
    if (message === USER_NOT_FOUND) {
      return message;
    }
    if (message === COULD_NOT_CREATE_THE_USER) {
      return message;
    }
    if (message === COULD_NOT_LIST_THE_USERS) {
      return message;
    }
    if (message === COULD_NOT_FIND_THE_USER) {
      return message;
    }
    if (message === COULD_NOT_UPDATE_THE_USER) {
      return message;
    }
    if (message === COULD_NOT_DELETE_THE_USER) {
      return message;
    }
  }

  return fallback;
}

function openWindow() {
  const window = new BrowserWindow({
    width: 420,
    height: 720,
    webPreferences: {
      preload: path.join(directory, "preload.js"),
    },
  });

  window.loadFile(path.join(directory, "index.html"));
}

app.whenReady().then(function () {
  ipcMain.handle(CREATE_USER, async (event, input) => {
    try {
      let name;
      let email;

      if (input !== undefined && input !== null) {
        name = input.name;
        email = input.email;
      }

      const user = await createUser({ name, email });
      return user;
    } catch (error) {
      throw new Error(shownMessage(error, COULD_NOT_CREATE_THE_USER));
    }
  });

  ipcMain.handle(LIST_USERS, async () => {
    try {
      const users = await listUsers();
      return users;
    } catch (error) {
      throw new Error(shownMessage(error, COULD_NOT_LIST_THE_USERS));
    }
  });

  ipcMain.handle(FIND_USER_BY_ID, async (event, id) => {
    try {
      const user = await findUserById(id);
      return user;
    } catch (error) {
      throw new Error(shownMessage(error, COULD_NOT_FIND_THE_USER));
    }
  });

  ipcMain.handle(UPDATE_USER, async (event, id, changes) => {
    try {
      const user = await updateUser(id, changes);
      return user;
    } catch (error) {
      throw new Error(shownMessage(error, COULD_NOT_UPDATE_THE_USER));
    }
  });

  ipcMain.handle(DELETE_USER, async (event, id) => {
    try {
      await deleteUser(id);
    } catch (error) {
      throw new Error(shownMessage(error, COULD_NOT_DELETE_THE_USER));
    }
  });

  openWindow();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) {
    openWindow();
  }
});
