import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { sendJson } from "./send-json.js";

const webDir = join(dirname(fileURLToPath(import.meta.url)), "..", "web");

const HTML = "text/html; charset=utf-8";
const CSS = "text/css; charset=utf-8";
const JS = "text/javascript; charset=utf-8";

const WEB_FILES = {
  "/": ["index.html", HTML],
  "/index.html": ["index.html", HTML],
  "/styles.css": ["styles.css", CSS],
  "/main.js": ["main.js", JS],
  "/state.js": ["state.js", JS],
  "/show-screen.js": ["show-screen.js", JS],
  "/show-message.js": ["show-message.js", JS],
  "/navigate.js": ["navigate.js", JS],
  "/load-user-selection.js": ["load-user-selection.js", JS],
  "/select-user.js": ["select-user.js", JS],
  "/show-user-menu.js": ["show-user-menu.js", JS],
  "/open-user-editor.js": ["open-user-editor.js", JS],
  "/save-user.js": ["save-user.js", JS],
  "/delete-selected-user.js": ["delete-selected-user.js", JS],
  "/show-notes.js": ["show-notes.js", JS],
};

export async function serveWebFile(request, response, pathname) {
  const file = Object.hasOwn(WEB_FILES, pathname) ? WEB_FILES[pathname] : null;

  if (request.method !== "GET" || file === null) {
    sendJson(response, 404, { error: "Not found" });
    return;
  }

  const [name, contentType] = file;
  const content = await readFile(join(webDir, name));
  response.writeHead(200, { "Content-Type": contentType });
  response.end(content);
}
