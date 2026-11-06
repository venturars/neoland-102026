import { readFileSync } from "node:fs";
import * as vscode from "vscode";
import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

const viewId = "firstApp.people";

let extensionUri;

function readId(value) {
  const text = String(value ?? "").trim();
  if (!/^[1-9]\d*$/.test(text)) {
    throw new Error("Invalid id");
  }
  const id = Number(text);
  if (!Number.isSafeInteger(id)) {
    throw new Error("Invalid id");
  }
  return id;
}

function sendError(webview, error) {
  webview.postMessage({ message: error.message });
}

async function replyList(webview) {
  try {
    const users = await listUsers();
    webview.postMessage({ users });
  } catch (error) {
    sendError(webview, error);
  }
}

async function replyCreate(webview, message) {
  try {
    const user = await createUser({
      name: message.name,
      email: message.email,
    });
    webview.postMessage({ user });
  } catch (error) {
    sendError(webview, error);
  }
}

async function replyView(webview, message) {
  try {
    const user = await findUserById(readId(message.id));
    webview.postMessage({ user });
  } catch (error) {
    sendError(webview, error);
  }
}

async function replyUpdate(webview, message) {
  try {
    const user = await updateUser(readId(message.id), message.changes);
    webview.postMessage({ user });
  } catch (error) {
    sendError(webview, error);
  }
}

async function replyDelete(webview, message) {
  try {
    await deleteUser(readId(message.id));
    webview.postMessage({});
  } catch (error) {
    sendError(webview, error);
  }
}

function handleMessage(webview, message) {
  if (message.action === "list") {
    replyList(webview);
    return;
  }
  if (message.action === "create") {
    replyCreate(webview, message);
    return;
  }
  if (message.action === "view") {
    replyView(webview, message);
    return;
  }
  if (message.action === "update") {
    replyUpdate(webview, message);
    return;
  }
  if (message.action === "delete") {
    replyDelete(webview, message);
  }
}

function resolveWebviewView(webviewView) {
  const webview = webviewView.webview;
  webview.options = {
    enableScripts: true,
    localResourceRoots: [extensionUri],
  };
  const page = readFileSync(new URL("./index.html", import.meta.url), "utf8");
  const styleUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "styles.css"),
  );
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "panel.js"),
  );
  webview.html = page
    .replace("./styles.css", String(styleUri))
    .replace("./panel.js", String(scriptUri));
  webview.onDidReceiveMessage(function (message) {
    handleMessage(webview, message);
  });
}

export function activate(context) {
  extensionUri = context.extensionUri;
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(viewId, {
      resolveWebviewView: resolveWebviewView,
    }),
  );
}
