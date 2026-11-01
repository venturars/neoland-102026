import { readFile } from "node:fs/promises";

const PUBLIC_FILES = {
  "/": ["index.html", "text/html; charset=utf-8"],
  "/index.html": ["index.html", "text/html; charset=utf-8"],
  "/styles.css": ["styles.css", "text/css; charset=utf-8"],
  "/main.js": ["main.js", "text/javascript; charset=utf-8"],
  "/state.js": ["state.js", "text/javascript; charset=utf-8"],
  "/show-screen.js": ["show-screen.js", "text/javascript; charset=utf-8"],
  "/show-message.js": ["show-message.js", "text/javascript; charset=utf-8"],
  "/load-user-selection.js": [
    "load-user-selection.js",
    "text/javascript; charset=utf-8",
  ],
  "/select-user.js": ["select-user.js", "text/javascript; charset=utf-8"],
  "/show-user-menu.js": ["show-user-menu.js", "text/javascript; charset=utf-8"],
  "/open-user-editor.js": [
    "open-user-editor.js",
    "text/javascript; charset=utf-8",
  ],
  "/navigate.js": ["navigate.js", "text/javascript; charset=utf-8"],
  "/save-user.js": ["save-user.js", "text/javascript; charset=utf-8"],
  "/delete-selected-user.js": [
    "delete-selected-user.js",
    "text/javascript; charset=utf-8",
  ],
};

export async function servePublicFile(request, response, pathname) {
  const isPublicFile = Object.hasOwn(PUBLIC_FILES, pathname);

  if (!isPublicFile) {
    throw new Error("HTTP resource does not exist");
  }

  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    throw new Error("HTTP method is not allowed");
  }

  const publicFile = PUBLIC_FILES[pathname];
  const fileName = publicFile[0];
  const contentType = publicFile[1];
  const fileUrl = new URL("../web/" + fileName, import.meta.url);
  const content = await readFile(fileUrl);

  response.statusCode = 200;
  response.setHeader("Content-Type", contentType);
  response.setHeader("Cache-Control", "no-store");
  response.end(content);
}
