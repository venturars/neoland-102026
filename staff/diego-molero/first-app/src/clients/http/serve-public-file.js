import { readFile } from "node:fs/promises";

// Solo estos archivos del cliente pueden salir por HTTP; la base y el SQL quedan privados.
const files = new Map([
  ["/", ["../web/index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["../web/index.html", "text/html; charset=utf-8"]],
  ["/styles.css", ["../web/styles.css", "text/css; charset=utf-8"]],
  ...[
    "main.js", "state.js", "api.js", "show-screen.js", "user-selection.js",
    "user-create.js", "user-menu.js", "user-editor.js", "notes-list.js", "note-editor.js",
  ].map((name) => [`/${name}`, [`../web/${name}`, "text/javascript; charset=utf-8"]]),
]);

export async function servePublicFile(request, response, next) {
  const file = files.get(request.path);
  if (!file) return next();
  if (request.method !== "GET") {
    response.set("Allow", "GET").status(405).send("Método no permitido.");
    return;
  }
  try {
    const content = await readFile(new URL(file[0], import.meta.url));
    response.type(file[1]).status(200).send(content);
  } catch (error) {
    next(error);
  }
}
