import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import * as vscode from "vscode";
import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { findUserByEmail } from "../../logic/find-user-by-email.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { findUserByName } from "../../logic/find-user-by-name.js";
import { ValidationError } from "../../logic/errors.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";
import { usersGenderCount } from "../../logic/user-gender-count.js";

const OPEN_USERS = "firstApp.openUsers";
const PANEL_TYPE = "firstAppUsers";

let extensionUri = null;
let panel = null;

function parseUserId(rawId) {
  const hasOnlyDigits = /^[1-9][0-9]*$/.test(rawId);

  if (!hasOnlyDigits) {
    throw new ValidationError("Id is invalid");
  }

  const id = Number(rawId);

  if (!Number.isSafeInteger(id)) {
    throw new ValidationError("Id is invalid");
  }

  return id;
}

function postReply(webview, request, payload) {
  const reply = { request };
  const keys = Object.keys(payload);

  for (const key of keys) {
    reply[key] = payload[key];
  }

  webview.postMessage(reply);
}

function postError(webview, request, error) {
  if (error instanceof Error) {
    postReply(webview, request, { error: error.message });
    return;
  }

  postReply(webview, request, { error: "Internal error" });
}

async function handleList(webview, message) {
  const request = message.request;

  try {
    const users = await listUsers();
    postReply(webview, request, { users });
  } catch (error) {
    postError(webview, request, error);
  }
}

async function handleGenderCount(webview, message) {
  const request = message.request;

  try {
    const count = await usersGenderCount();
    postReply(webview, request, { count });
  } catch (error) {
    postError(webview, request, error);
  }
}

async function handleCreate(webview, message) {
  const request = message.request;

  try {
    const name = message.name;
    const email = message.email;
    await createUser({ name, email });
    postReply(webview, request, {});
  } catch (error) {
    postError(webview, request, error);
  }
}

async function handleSearchName(webview, message) {
  const request = message.request;

  try {
    const name = message.name;
    const users = await findUserByName(name);
    postReply(webview, request, { users });
  } catch (error) {
    postError(webview, request, error);
  }
}

async function handleSearchEmail(webview, message) {
  const request = message.request;

  try {
    const email = message.email;
    const user = await findUserByEmail(email);
    const users = [user];
    postReply(webview, request, { users });
  } catch (error) {
    postError(webview, request, error);
  }
}

async function handleSearchId(webview, message) {
  const request = message.request;

  try {
    const rawId = message.rawId;
    const id = parseUserId(rawId);
    const user = await findUserById(id);
    const users = [user];
    postReply(webview, request, { users });
  } catch (error) {
    postError(webview, request, error);
  }
}

async function handleFindUserById(webview, message) {
  const request = message.request;

  try {
    const rawId = message.rawId;
    const id = parseUserId(rawId);
    const user = await findUserById(id);
    postReply(webview, request, { user });
  } catch (error) {
    postError(webview, request, error);
  }
}

async function handleUpdate(webview, message) {
  const request = message.request;

  try {
    const id = message.id;
    const name = message.name;
    const email = message.email;
    const user = await updateUser({ id, name, email });
    postReply(webview, request, { user });
  } catch (error) {
    postError(webview, request, error);
  }
}

async function handleDelete(webview, message) {
  const request = message.request;

  try {
    const id = message.id;
    await deleteUser(id);
    postReply(webview, request, {});
  } catch (error) {
    postError(webview, request, error);
  }
}

function handleMessage(webview, message) {
  const action = message.action;

  if (action === "list") {
    handleList(webview, message);
    return;
  }

  if (action === "create") {
    handleCreate(webview, message);
    return;
  }

  if (action === "searchName") {
    handleSearchName(webview, message);
    return;
  }

  if (action === "searchEmail") {
    handleSearchEmail(webview, message);
    return;
  }

  if (action === "searchId") {
    handleSearchId(webview, message);
    return;
  }

  if (action === "findUserById") {
    handleFindUserById(webview, message);
    return;
  }

  if (action === "update") {
    handleUpdate(webview, message);
    return;
  }

  if (action === "delete") {
    handleDelete(webview, message);
    return;
  }

  if (action === "genderCount") {
    handleGenderCount(webview, message);
  }
}

function buildPanelHtml(webview) {
  const pageUrl = new URL("index.html", import.meta.url);
  let page = readFileSync(pageUrl, "utf8");
  const stylePath = vscode.Uri.joinPath(extensionUri, "styles.css");
  const styleUri = webview.asWebviewUri(stylePath);
  const scriptPath = vscode.Uri.joinPath(extensionUri, "panel.js");
  const scriptUri = webview.asWebviewUri(scriptPath);
  const styleText = String(styleUri);
  const scriptText = String(scriptUri);
  page = page.replace("./styles.css", styleText);
  page = page.replace("./panel.js", scriptText);
  const nonce = randomBytes(16).toString("hex");
  const csp =
    "default-src 'none'; style-src " +
    webview.cspSource +
    " 'unsafe-inline'; script-src 'nonce-" +
    nonce +
    "';";
  page = page.replace(
    "<head>",
    '<head>\n    <meta http-equiv="Content-Security-Policy" content="' +
      csp +
      '" />',
  );
  page = page.replace(
    '<script type="module"',
    '<script type="module" nonce="' + nonce + '"',
  );

  return page;
}

function openUsersPanel() {
  if (panel !== null) {
    panel.reveal(vscode.ViewColumn.One);
    return;
  }

  panel = vscode.window.createWebviewPanel(
    PANEL_TYPE,
    "First App · Usuarios",
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      localResourceRoots: [extensionUri],
    },
  );

  panel.webview.html = buildPanelHtml(panel.webview);
  panel.webview.onDidReceiveMessage((message) => {
    handleMessage(panel.webview, message);
  });
  panel.onDidDispose(() => {
    panel = null;
  });
}

export function activate(context) {
  extensionUri = context.extensionUri;
  const command = vscode.commands.registerCommand(OPEN_USERS, openUsersPanel);
  context.subscriptions.push(command);
}

export function deactivate() {}
