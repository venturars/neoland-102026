import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import * as vscode from "vscode";

import {
  countUsersAction,
  createUserAction,
  deleteUserAction,
  findUserAction,
  listUsersAction,
  updateUserAction,
} from "./user-actions.js";

// This process is the only part of this client that reaches logic/.
// The view runs isolated in a webview: it asks here with messages.

const VIEW_ID = "firstAppUsers.view";
const DELETE_BUTTON = "Eliminar";

const fileUrl = import.meta.url;
const filePath = fileURLToPath(fileUrl);
const folder = path.dirname(filePath);

async function confirmAndDeleteUser(id) {
  // The confirmation lives here and not in the view, so nothing in the view
  // can delete a user without going through the dialog. VS Code adds the
  // cancel button itself, and cancelling answers undefined.
  const options = {
    modal: true,
    detail: "Esta acción no se puede deshacer.",
  };
  const answer = await vscode.window.showWarningMessage(
    "¿Eliminar este usuario?",
    options,
    DELETE_BUTTON,
  );

  if (answer !== DELETE_BUTTON) {
    return { cancelled: true };
  }

  return deleteUserAction(id);
}

async function runAction(message) {
  const action = message.action;

  if (action === "list") {
    return listUsersAction();
  }

  if (action === "count") {
    return countUsersAction();
  }

  if (action === "create") {
    return createUserAction(message.name, message.email);
  }

  if (action === "view") {
    return findUserAction(message.id);
  }

  if (action === "update") {
    return updateUserAction(message.id, message.changes);
  }

  if (action === "delete") {
    return confirmAndDeleteUser(message.id);
  }

  // Answer anyway, so the view does not wait forever for this request.
  return { error: "Unknown action" };
}

async function answerMessage(webview, message) {
  const answer = await runAction(message);

  // The number tells the view which of its requests this answer belongs to.
  const request = message.request;
  const reply = { ...answer, request };

  await webview.postMessage(reply);
}

function buildPage(webview, extensionUri) {
  const pagePath = path.join(folder, "index.html");
  const page = readFileSync(pagePath, "utf8");

  // A webview cannot open files by their normal path. Each file needs the
  // special address that asWebviewUri gives it.
  const stylesPath = vscode.Uri.joinPath(extensionUri, "styles.css");
  const stylesUri = webview.asWebviewUri(stylesPath);
  const scriptPath = vscode.Uri.joinPath(extensionUri, "view.js");
  const scriptUri = webview.asWebviewUri(scriptPath);

  const withSource = page.replaceAll("{{cspSource}}", webview.cspSource);
  const withStyles = withSource.replace("{{stylesUri}}", String(stylesUri));

  return withStyles.replace("{{scriptUri}}", String(scriptUri));
}

function showView(webviewView, extensionUri) {
  const webview = webviewView.webview;

  // The view may only run scripts and read files from this folder.
  webview.options = {
    enableScripts: true,
    localResourceRoots: [extensionUri],
  };

  webview.html = buildPage(webview, extensionUri);
  webview.onDidReceiveMessage((message) => answerMessage(webview, message));
}

export function activate(context) {
  const extensionUri = context.extensionUri;
  const provider = {
    resolveWebviewView: (webviewView) => showView(webviewView, extensionUri),
  };
  const registration = vscode.window.registerWebviewViewProvider(
    VIEW_ID,
    provider,
  );

  context.subscriptions.push(registration);
}
