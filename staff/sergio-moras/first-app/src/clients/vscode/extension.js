// Extensión de VS Code: registra el panel de usuarios y atiende sus mensajes.
// Este fichero corre en Node dentro de VS Code: es un cliente como la terminal y llama a logic/.
// El panel (panel.js) no llama a nada: pide cada operación con un mensaje y pinta la respuesta.

import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import * as vscode from "vscode";
import { listUsers } from "../../logic/list-users.js";
import { createUser } from "../../logic/create-user.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";

const VIEW_ID = "firstAppUsers.panel";

// Las acciones que puede pedir el panel. Una que no está aquí se ignora.
const ACTIONS = {
  list: function () {
    return listUsers();
  },
  create: function (data) {
    return createUser(data.name, data.email);
  },
  update: function (data) {
    return updateUser(data.id, data.name, data.email);
  },
  delete: function (data) {
    return deleteUser(data.id);
  },
};

// El panel envía { id, action, data }. Llama a la acción con data y contesta con el mismo id:
// { id, ok: true, result } o { id, ok: false, error }.
async function handleMessage(webview, message) {
  if (!Object.hasOwn(ACTIONS, message.action)) {
    return;
  }
  const action = ACTIONS[message.action];

  try {
    const result = await action(message.data);
    webview.postMessage({ id: message.id, ok: true, result: result });
  } catch (error) {
    webview.postMessage({ id: message.id, ok: false, error: error.message });
  }
}

// index.html lleva marcas que solo se conocen al abrir el panel: el origen de sus ficheros,
// un nonce nuevo para el script y las rutas de styles.css y panel.js dentro de VS Code.
function buildHtml(webview, extensionUri) {
  const pageUrl = new URL("./index.html", import.meta.url);
  const page = readFileSync(pageUrl, "utf8");

  const stylesPath = vscode.Uri.joinPath(extensionUri, "styles.css");
  const stylesUri = webview.asWebviewUri(stylesPath);
  const scriptPath = vscode.Uri.joinPath(extensionUri, "panel.js");
  const scriptUri = webview.asWebviewUri(scriptPath);
  const nonce = randomUUID();

  const withSource = page.replaceAll("{{cspSource}}", webview.cspSource);
  const withNonce = withSource.replaceAll("{{nonce}}", nonce);
  const withStyles = withNonce.replace("./styles.css", stylesUri.toString());
  return withStyles.replace("./panel.js", scriptUri.toString());
}

function activate(context) {
  const extensionUri = context.extensionUri;

  function resolveWebviewView(view) {
    const webview = view.webview;
    webview.options = {
      enableScripts: true,
      localResourceRoots: [extensionUri],
    };
    webview.html = buildHtml(webview, extensionUri);
    webview.onDidReceiveMessage(function (message) {
      handleMessage(webview, message);
    });
  }

  const provider = { resolveWebviewView: resolveWebviewView };
  const registration = vscode.window.registerWebviewViewProvider(
    VIEW_ID,
    provider,
  );
  context.subscriptions.push(registration);
}

function deactivate() {}

export { activate, deactivate };
