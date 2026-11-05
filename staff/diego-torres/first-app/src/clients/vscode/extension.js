// Lee el HTML de la vista desde el disco.
import { readFileSync } from "node:fs";
// Da acceso a las funciones del editor.
import * as vscode from "vscode";

// Crea un usuario (viene de la capa de lógica).
import { createUser } from "../../logic/create-user.js";
// Borra un usuario (viene de la capa de lógica).
import { deleteUser } from "../../logic/delete-user.js";
// Busca un usuario por su id (viene de la capa de lógica).
import { findUserById } from "../../logic/find-user-by-id.js";
// Devuelve la lista de usuarios (viene de la capa de lógica).
import { listUsers } from "../../logic/list-users.js";
// Modifica un usuario (viene de la capa de lógica).
import { updateUser } from "../../logic/update-user.js";
// Cuenta los usuarios por género (viene de la capa de lógica).
import { usersGenderCount } from "../../logic/users-gender-count.js";

// Las acciones que cambian datos vuelven a enviar la lista.
const CAMBIAN_DATOS = ["create", "update", "delete"];

// Ejecuta la acción pedida y devuelve lo que ve la vista.
async function runAction(message) {
  const { action, id, name, email, changes } = message;

  if (action === "list") {
    return { users: await listUsers() };
  }
  if (action === "create") {
    await createUser({ name, email });
    return { created: true };
  }
  if (action === "view") {
    return { user: await findUserById(id) };
  }
  if (action === "gender-count") {
    return { genderCount: await usersGenderCount() };
  }
  if (action === "update") {
    return { user: await updateUser(id, changes) };
  }

  await deleteUser(id);
  return { deleted: true };
}

// Atiende un mensaje de la vista y le envía la respuesta.
async function answer(webview, message) {
  const { action } = message;

  try {
    const reply = await runAction(message);
    webview.postMessage({ action, ...reply });

    // Si han cambiado los datos, envía la lista nueva.
    if (CAMBIAN_DATOS.includes(action)) {
      const users = await listUsers();
      webview.postMessage({ action: "list", users });
    }
  } catch (error) {
    // El mensaje llega a la vista tal como sale de la lógica.
    webview.postMessage({ action, error: error.message });
  }
}

// Monta el HTML con las direcciones que acepta la vista.
function buildHtml(webview, extensionUri) {
  const uriOf = (file) =>
    webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, file)).toString();

  const htmlUri = vscode.Uri.joinPath(extensionUri, "index.html");
  return readFileSync(htmlUri.fsPath, "utf8")
    .replaceAll("__CSP_SOURCE__", webview.cspSource)
    .replaceAll("__STYLES_URI__", uriOf("styles.css"))
    .replaceAll("__PANEL_URI__", uriOf("panel.js"));
}

// El editor llama a esta función al arrancar la extensión.
export function activate(context) {
  const { extensionUri } = context;

  // Prepara la vista cuando el editor la abre.
  const provider = {
    resolveWebviewView(view) {
      const { webview } = view;
      webview.options = {
        enableScripts: true,
        localResourceRoots: [extensionUri],
      };
      webview.html = buildHtml(webview, extensionUri);
      webview.onDidReceiveMessage((message) => answer(webview, message));
    },
  };

  // Registra la vista y la libera al cerrar la extensión.
  const registro = vscode.window.registerWebviewViewProvider(
    "firstApp.users",
    provider,
  );
  context.subscriptions.push(registro);
}
