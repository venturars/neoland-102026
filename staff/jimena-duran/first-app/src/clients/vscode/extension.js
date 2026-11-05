/* global URL */
import * as vscode from "vscode";
import { readFileSync } from "node:fs";
import { createUser } from "../../logic/create-user.js";
import { listUsers } from "../../logic/list-users.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";

const DIRECTORY_URL = new URL("./", import.meta.url);
const DIRECTORY_URI = vscode.Uri.parse(DIRECTORY_URL.href);
const PAGE_URL = new URL("./index.html", import.meta.url);

function resolveWebviewView(view) {
  const webview = view.webview;
  webview.options = {
    enableScripts: true,
    localResourceRoots: [DIRECTORY_URI],
  };
  const styleUri = vscode.Uri.joinPath(DIRECTORY_URI, "styles.css");
  const scriptUri = vscode.Uri.joinPath(DIRECTORY_URI, "panel.js");
  const styleResource = webview.asWebviewUri(styleUri);
  const scriptResource = webview.asWebviewUri(scriptUri);
  let html = readFileSync(PAGE_URL, "utf8");
  html = html.replace("./styles.css", styleResource.toString());
  html = html.replace("./panel.js", scriptResource.toString());
  webview.html = html;

  webview.onDidReceiveMessage(async (request) => {
    try {
      if (request.action === "list") {
        const users = await listUsers();
        webview.postMessage({ users });
      }
      if (request.action === "create") {
        const input = { name: request.name, email: request.email };
        const user = await createUser(input);
        webview.postMessage({ user });
      }
      if (request.action === "view") {
        const user = await findUserById(request.id);
        webview.postMessage({ user });
      }
      if (request.action === "update") {
        const user = await updateUser(request.id, request.changes);
        webview.postMessage({ user });
      }
      if (request.action === "delete") {
        await deleteUser(request.id);
        webview.postMessage({});
      }
    } catch (error) {
      if (error instanceof Error) {
        webview.postMessage({ message: error.message });
      }
    }
  });
}

export function activate(context) {
  const provider = { resolveWebviewView };
  const registration = vscode.window.registerWebviewViewProvider(
    "firstApp.users",
    provider,
  );
  context.subscriptions.push(registration);
}
