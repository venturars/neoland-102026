import { readFile } from "node:fs/promises";

// La lista cerrada impide servir bases, SQL y archivos privados.
const files = new Map([
  ["/", ["../web/index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["../web/index.html", "text/html; charset=utf-8"]],
  ["/styles.css", ["../web/styles.css", "text/css; charset=utf-8"]],
  ...[
    "main.js",
    "state.js",
    "api.js",
    "show-screen.js",
    "user-selection.js",
    "user-menu.js",
    "user-editor.js",
    "notes-list.js",
    "note-editor.js",
  ].map((name) => [`/${name}`, [`../web/${name}`, "text/javascript; charset=utf-8"]]),
]);

export async function servePublicFile(request, response, path) {
  const file = files.get(path);
  if (!file) {
    return false;
  }
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.statusCode = 405;
    response.end("Método no permitido.");
    return true;
  }
  const content = await readFile(new URL(file[0], import.meta.url));
  response.setHeader("Content-Type", file[1]);
  response.statusCode = 200;
  response.end(content);
  return true;
}
