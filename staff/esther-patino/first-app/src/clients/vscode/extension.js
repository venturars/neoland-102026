import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as vscode from "vscode";
import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { findUserByEmail } from "../../logic/find-user-by-email.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { findUserByName } from "../../logic/find-user-by-name.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

const NAME_IS_EMPTY = "Name is empty";
const EMAIL_IS_INVALID = "Email is invalid";
const EMAIL_IS_ALREADY_USED = "Email is already used";
const INVALID_ID = "Invalid id";
const USER_NOT_FOUND = "User not found";
const COULD_NOT_CREATE_THE_USER = "Could not create the user";
const COULD_NOT_LIST_THE_USERS = "Could not list the users";
const COULD_NOT_FIND_THE_USER = "Could not find the user";
const COULD_NOT_UPDATE_THE_USER = "Could not update the user";
const COULD_NOT_DELETE_THE_USER = "Could not delete the user";
const OPEN_USERS = "first-app.openUsers";

const directory = path.dirname(fileURLToPath(import.meta.url));

let panel = null;

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
    if (message === INVALID_ID) {
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

function postError(webview, error, fallback) {
  webview.postMessage({
    type: "error",
    message: shownMessage(error, fallback),
  });
}

function panelHtml(webview) {
  const nonce = randomBytes(16).toString("hex");
  const styleUri = webview.asWebviewUri(
    vscode.Uri.file(path.join(directory, "styles.css")),
  );
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.file(path.join(directory, "app.js")),
  );
  const htmlPath = path.join(directory, "index.html");
  const html = readFileSync(htmlPath, "utf8");
  const csp =
    "default-src 'none'; style-src " +
    webview.cspSource +
    "; script-src 'nonce-" +
    nonce +
    "'";

  return html
    .replaceAll("{{CSP}}", csp)
    .replaceAll("{{STYLE}}", String(styleUri))
    .replaceAll("{{SCRIPT}}", String(scriptUri))
    .replaceAll("{{NONCE}}", nonce);
}

async function onListUsers(webview) {
  try {
    const users = await listUsers();
    webview.postMessage({ type: "users", users });
  } catch (error) {
    postError(webview, error, COULD_NOT_LIST_THE_USERS);
  }
}

async function onCreateUser(webview, message) {
  try {
    let name;
    let email;

    if (message !== undefined && message !== null) {
      name = message.name;
      email = message.email;
    }

    await createUser({ name, email });
    webview.postMessage({ type: "created" });
  } catch (error) {
    postError(webview, error, COULD_NOT_CREATE_THE_USER);
  }
}

async function onFindUserById(webview, message) {
  try {
    const user = await findUserById(message.id);
    webview.postMessage({ type: "user", user });
  } catch (error) {
    postError(webview, error, COULD_NOT_FIND_THE_USER);
  }
}

async function onSearchUsers(webview, message) {
  try {
    const criterion = message.criterion;
    const value = message.value;

    if (criterion === "name") {
      const users = await findUserByName(value);
      webview.postMessage({ type: "users", users });
      return;
    }

    if (criterion === "email") {
      const user = await findUserByEmail(value);
      const users = [user];
      webview.postMessage({ type: "users", users });
      return;
    }

    if (criterion === "id") {
      const id = Number(value);
      const user = await findUserById(id);
      const users = [user];
      webview.postMessage({ type: "users", users });
    }
  } catch (error) {
    postError(webview, error, COULD_NOT_FIND_THE_USER);
  }
}

async function onUpdateUser(webview, message) {
  try {
    const changes = {};

    if (message.name !== undefined) {
      changes.name = message.name;
    }
    if (message.email !== undefined) {
      changes.email = message.email;
    }

    const user = await updateUser(message.id, changes);
    webview.postMessage({ type: "saved", user });
  } catch (error) {
    postError(webview, error, COULD_NOT_UPDATE_THE_USER);
  }
}

async function onDeleteUser(webview, message) {
  try {
    await deleteUser(message.id);
    webview.postMessage({ type: "deleted" });
  } catch (error) {
    postError(webview, error, COULD_NOT_DELETE_THE_USER);
  }
}

function receiveMessage(webview, message) {
  if (message === undefined || message === null) {
    return;
  }

  if (message.type === "list-users") {
    onListUsers(webview);
    return;
  }

  if (message.type === "create-user") {
    onCreateUser(webview, message);
    return;
  }

  if (message.type === "find-user-by-id") {
    onFindUserById(webview, message);
    return;
  }

  if (message.type === "search-users") {
    onSearchUsers(webview, message);
    return;
  }

  if (message.type === "update-user") {
    onUpdateUser(webview, message);
    return;
  }

  if (message.type === "delete-user") {
    onDeleteUser(webview, message);
  }
}

function openPanel() {
  if (panel !== null) {
    panel.reveal(vscode.ViewColumn.One);
    return;
  }

  panel = vscode.window.createWebviewPanel(
    "firstAppUsers",
    "Usuarios",
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(directory)],
    },
  );

  panel.webview.onDidReceiveMessage(function (message) {
    receiveMessage(panel.webview, message);
  });
  panel.webview.html = panelHtml(panel.webview);
  panel.onDidDispose(function () {
    panel = null;
  });
}

export function activate(context) {
  const command = vscode.commands.registerCommand(OPEN_USERS, openPanel);
  context.subscriptions.push(command);
  openPanel();
}

export function deactivate() {}
