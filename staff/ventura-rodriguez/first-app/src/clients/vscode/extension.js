/* global URL */
import { readFileSync } from "node:fs";
import * as vscode from "vscode";
import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

const VIEW_ID = "firstApp.users";

let extensionUri;

function sendError(webview, error) {
  if (error instanceof Error) {
    const errorMessage = error.message;
    const reply = { message: errorMessage };
    webview.postMessage(reply);
  }
}

async function replyList(webview) {
  try {
    const users = await listUsers();
    const reply = { users };
    webview.postMessage(reply);
  } catch (error) {
    sendError(webview, error);
  }
}

async function replyCreate(webview, message) {
  try {
    const name = message.name;
    const email = message.email;
    const user = await createUser({ name, email });
    const reply = { user };
    webview.postMessage(reply);
  } catch (error) {
    sendError(webview, error);
  }
}

async function replyView(webview, message) {
  try {
    const id = message.id;
    const user = await findUserById(id);
    const reply = { user };
    webview.postMessage(reply);
  } catch (error) {
    sendError(webview, error);
  }
}

async function replyUpdate(webview, message) {
  try {
    const id = message.id;
    const changes = message.changes;
    const user = await updateUser(id, changes);
    const reply = { user };
    webview.postMessage(reply);
  } catch (error) {
    sendError(webview, error);
  }
}

async function replyDelete(webview, message) {
  try {
    const id = message.id;
    await deleteUser(id);
    const reply = {};
    webview.postMessage(reply);
  } catch (error) {
    sendError(webview, error);
  }
}

function handleMessage(webview, message) {
  const action = message.action;
  if (action === "list") {
    replyList(webview);
    return;
  }
  if (action === "create") {
    replyCreate(webview, message);
    return;
  }
  if (action === "view") {
    replyView(webview, message);
    return;
  }
  if (action === "update") {
    replyUpdate(webview, message);
    return;
  }
  if (action === "delete") {
    replyDelete(webview, message);
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
}
