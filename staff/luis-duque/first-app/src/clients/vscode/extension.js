import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Uri, window } from "vscode";
import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

const VIEW_ID = "usuarios.view";
const folder = dirname(fileURLToPath(import.meta.url));

export function activate(context) {
  const registration = window.registerWebviewViewProvider(VIEW_ID, {
    resolveWebviewView(view) {
      const webview = view.webview;
      webview.options = {
        enableScripts: true,
        localResourceRoots: [context.extensionUri],
      };
      webview.onDidReceiveMessage((message) => {
        answer(webview, message);
      });
      loadHtml(webview, context.extensionUri).then((html) => {
        webview.html = html;
      });
    },
  });
  context.subscriptions.push(registration);
}

async function loadHtml(webview, extensionUri) {
  let html = await readFile(join(folder, "index.html"), "utf8");
  const scriptUri = webview.asWebviewUri(Uri.joinPath(extensionUri, "app.js"));
  const styleUri = webview.asWebviewUri(
    Uri.joinPath(extensionUri, "styles.css"),
  );
  const nonce = randomUUID();
  const policy = [
    "default-src 'none'",
    `style-src ${webview.cspSource} https://fonts.googleapis.com`,
    "font-src https://fonts.gstatic.com",
    `script-src 'nonce-${nonce}'`,
  ].join("; ");

  html = html.replace("./styles.css", String(styleUri));
  html = html.replace("./app.js", String(scriptUri));
  html = html.replace(
    '<script type="module"',
    `<script type="module" nonce="${nonce}"`,
  );
  html = html.replace(
    "<head>",
    `<head>\n    <meta http-equiv="Content-Security-Policy" content="${policy}" />`,
  );
  return html;
}

async function answer(webview, message) {
  try {
    const result = await run(message);
    webview.postMessage({ requestId: message.requestId, result });
  } catch (error) {
    webview.postMessage({
      requestId: message.requestId,
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

function run(message) {
  if (message.action === "listar") {
    return listUsers();
  }

  if (message.action === "crear") {
    return createUser({ name: message.name, email: message.email });
  }

  if (message.action === "modificar") {
    return updateUser(message.id, { name: message.name, email: message.email });
  }

  if (message.action === "eliminar") {
    return deleteUser(message.id);
  }
}
