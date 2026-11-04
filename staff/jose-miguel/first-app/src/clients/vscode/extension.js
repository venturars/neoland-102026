/* global URL */
import { readFileSync } from "node:fs";
import * as vscode from "vscode";
import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { findUserByEmail } from "../../logic/find-user-by-email.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { findUserByName } from "../../logic/find-user-by-name.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

const VIEW_ID = "firstAppJm.usersPanel";
const EMAIL_DOES_NOT_MATCH = "El email no coincide";

let extensionUri;

function postError(webview, request, error) {
  if (error instanceof Error) {
    const message = error.message;
    const reply = { request, message };
    webview.postMessage(reply);
    return;
  }
  const reply = { request, message: "Could not complete the action" };
  webview.postMessage(reply);
}

async function handleList(webview, message) {
  const request = message.request;
  try {
    const users = await listUsers();
    users.sort((left, right) => {
      return left.id - right.id;
    });
    const reply = { request, users };
    webview.postMessage(reply);
  } catch (error) {
    postError(webview, request, error);
  }
}

async function handleCreate(webview, message) {
  const request = message.request;
  try {
    const name = message.name;
    const email = message.email;
    const user = await createUser({ name, email });
    const reply = { request, user };
    webview.postMessage(reply);
  } catch (error) {
    postError(webview, request, error);
  }
}

async function handleSearchName(webview, message) {
  const request = message.request;
  try {
    const name = message.name;
    const users = await findUserByName(name);
    users.sort((left, right) => {
      return left.id - right.id;
    });
    const reply = { request, users };
    webview.postMessage(reply);
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
    const reply = { request, users };
    webview.postMessage(reply);
  } catch (error) {
    postError(webview, request, error);
  }
}

async function handleSearchId(webview, message) {
  const request = message.request;
  try {
    const id = message.id;
    const user = await findUserById(id);
    const users = [user];
    const reply = { request, users };
    webview.postMessage(reply);
  } catch (error) {
    postError(webview, request, error);
  }
}

async function handleUpdate(webview, message) {
  const request = message.request;
  try {
    const id = message.id;
    const changes = message.changes;
    const user = await updateUser(id, changes);
    const reply = { request, user };
    webview.postMessage(reply);
  } catch (error) {
    postError(webview, request, error);
  }
}

async function handleDelete(webview, message) {
  const request = message.request;
  try {
    const id = message.id;
    const confirmation = message.confirmation;
    if (typeof confirmation !== "string") {
      throw new Error(EMAIL_DOES_NOT_MATCH);
    }
    const user = await findUserById(id);
    const savedEmail = user.email.trim().toLowerCase();
    const typedEmail = confirmation.trim().toLowerCase();
    if (typedEmail !== savedEmail) {
      throw new Error(EMAIL_DOES_NOT_MATCH);
    }
    await deleteUser(id);
    const reply = { request, deleted: true };
    webview.postMessage(reply);
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
  if (action === "update") {
    handleUpdate(webview, message);
    return;
  }
  if (action === "delete") {
    handleDelete(webview, message);
  }
}

function resolveWebviewView(webviewView) {
  const webview = webviewView.webview;
  const options = {
    enableScripts: true,
    localResourceRoots: [extensionUri],
  };
  webview.options = options;
  const pageUrl = new URL("index.html", import.meta.url);
  const page = readFileSync(pageUrl, "utf8");
  const stylePath = vscode.Uri.joinPath(extensionUri, "styles.css");
  const styleUri = webview.asWebviewUri(stylePath);
  const styleText = String(styleUri);
  const scriptPath = vscode.Uri.joinPath(extensionUri, "panel.js");
  const scriptUri = webview.asWebviewUri(scriptPath);
  const scriptText = String(scriptUri);
  const withStyle = page.replace("./styles.css", styleText);
  const html = withStyle.replace("./panel.js", scriptText);
  webview.html = html;
  webview.onDidReceiveMessage((message) => {
    handleMessage(webview, message);
  });
}

export function activate(context) {
  extensionUri = context.extensionUri;
  const provider = {
    resolveWebviewView: resolveWebviewView,
  };
  const registration = vscode.window.registerWebviewViewProvider(
    VIEW_ID,
    provider,
  );
  context.subscriptions.push(registration);
  const command = vscode.commands.registerCommand(
    "firstAppJm.openUsers",
    async () => {
      await vscode.commands.executeCommand("firstAppJm.usersPanel.focus");
    },
  );
  context.subscriptions.push(command);
}

export function deactivate() {}
