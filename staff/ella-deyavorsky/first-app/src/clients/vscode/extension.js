/* global console */
import { randomUUID } from "node:crypto";
import { Uri, window } from "vscode";
import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

// The id of the view in the manifest (package.json of this folder).
const VIEW_ID = "firstAppUsers";
// The button of the dialog that accepts a delete.
const DELETE_BUTTON = "Borrar";

// The folder of the extension. activate saves it for resolveView.
let extensionFolder;

// Only register the view here: VS Code does not show it until this returns.
export function activate(context) {
  extensionFolder = context.extensionUri;
  const registration = window.registerWebviewViewProvider(VIEW_ID, {
    resolveWebviewView: resolveView,
  });
  context.subscriptions.push(registration);
}

function resolveView(view) {
  const webview = view.webview;
  webview.options = {
    enableScripts: true,
    localResourceRoots: [extensionFolder],
  };
  webview.onDidReceiveMessage((message) => {
    answerMessage(webview, message);
  });
  webview.html = writeHtml(webview);
}

function writeHtml(webview) {
  const scriptFile = Uri.joinPath(extensionFolder, "webview.js");
  const scriptUri = webview.asWebviewUri(scriptFile);
  const styleFile = Uri.joinPath(extensionFolder, "webview.css");
  const styleUri = webview.asWebviewUri(styleFile);
  // A new nonce each time: only the script with this nonce can run.
  const nonce = randomUUID();
  // default-src 'none' also stops the screen from calling the network.
  const policy =
    "default-src 'none'; style-src " +
    webview.cspSource +
    "; script-src 'nonce-" +
    nonce +
    "';";

  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="${policy}" />
    <link rel="stylesheet" href="${styleUri}" />
  </head>
  <body>
    <p id="error" class="error"></p>

    <h2>Resultado</h2>
    <ul id="result"></ul>

    <h2>Usuarios</h2>
    <button id="reload-button" type="button">Recargar</button>
    <p id="list-empty" class="hidden">No hay usuarios</p>
    <ul id="user-list"></ul>

    <h2>Crear</h2>
    <label>Nombre <input id="create-name" type="text" /></label>
    <label>Email <input id="create-email" type="text" /></label>
    <button id="create-button" type="button">Crear</button>

    <h2>Ver</h2>
    <label>Id <input id="view-id" type="text" /></label>
    <button id="view-button" type="button">Ver</button>

    <h2>Actualizar</h2>
    <label>Id <input id="update-id" type="text" /></label>
    <label>Nombre <input id="update-name" type="text" /></label>
    <label>Email <input id="update-email" type="text" /></label>
    <button id="update-button" type="button">Actualizar</button>

    <h2>Borrar</h2>
    <label>Id <input id="delete-id" type="text" /></label>
    <button id="delete-button" type="button">Borrar</button>

    <script nonce="${nonce}" src="${scriptUri}"></script>
  </body>
</html>`;
}

// Each message of the screen gets exactly one reply, so the screen never waits for nothing.
async function answerMessage(webview, message) {
  let reply;
  try {
    reply = await runAction(message);
  } catch (error) {
    reply = { error: chooseSentence(error) };
  }
  webview.postMessage(reply);
}

async function runAction(message) {
  if (message.action === "list") {
    const users = await listUsers();
    return { users };
  }

  if (message.action === "view") {
    const user = await findUserById({ id: message.id });
    return { user };
  }

  if (message.action === "create") {
    const user = await createUser({ name: message.name, email: message.email });
    return addUsers({ user });
  }

  if (message.action === "update") {
    // An empty box means "not entered", and logic/ writes that as undefined.
    let name = message.name;
    if (name === "") {
      name = undefined;
    }
    let email = message.email;
    if (email === "") {
      email = undefined;
    }
    const user = await updateUser({ id: message.id, name, email });
    return addUsers({ user });
  }

  if (message.action === "delete") {
    const answer = await window.showWarningMessage(
      "¿Borrar el usuario con id " + message.id + "?",
      { modal: true },
      DELETE_BUTTON,
    );
    // Cancel or closing the dialog gives undefined: nothing is deleted.
    if (answer !== DELETE_BUTTON) {
      return {};
    }
    await deleteUser({ id: message.id });
    return addUsers({});
  }

  return {};
}

// The action already happened, so a failure of the list must not hide its result.
async function addUsers(reply) {
  try {
    reply.users = await listUsers();
  } catch (error) {
    reply.error = chooseSentence(error);
  }
  return reply;
}

// logic/ only throws plain Error, so that is the only thing that is safe to show.
function chooseSentence(error) {
  let sentence = "The database failed.";
  let isPlainError = false;
  // instanceof comes first: reading .constructor of null or undefined would throw.
  if (error instanceof Error) {
    if (error.constructor === Error) {
      isPlainError = true;
    }
  }
  if (isPlainError) {
    sentence = error.message;
  } else {
    console.error(error);
  }
  return sentence;
}
