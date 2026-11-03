import { readFile } from "node:fs/promises";

const PUBLIC_FILES = {
  "/": ["../web/index.html", "text/html; charset=utf-8"],
  "/index.html": ["../web/index.html", "text/html; charset=utf-8"],
  "/styles.css": ["../web/styles.css", "text/css; charset=utf-8"],
  "/main.js": ["../web/main.js", "text/javascript; charset=utf-8"],
  "/state.js": ["../web/state.js", "text/javascript; charset=utf-8"],
  "/show-screen.js": [
    "../web/show-screen.js",
    "text/javascript; charset=utf-8",
  ],
  "/show-message.js": [
    "../web/show-message.js",
    "text/javascript; charset=utf-8",
  ],
  "/load-user-selection.js": [
    "../web/load-user-selection.js",
    "text/javascript; charset=utf-8",
  ],
  "/select-user.js": [
    "../web/select-user.js",
    "text/javascript; charset=utf-8",
  ],
  "/show-user-menu.js": [
    "../web/show-user-menu.js",
    "text/javascript; charset=utf-8",
  ],
  "/open-user-editor.js": [
    "../web/open-user-editor.js",
    "text/javascript; charset=utf-8",
  ],
  "/navigate.js": ["../web/navigate.js", "text/javascript; charset=utf-8"],
  "/save-user.js": ["../web/save-user.js", "text/javascript; charset=utf-8"],
  "/delete-selected-user.js": [
    "../web/delete-selected-user.js",
    "text/javascript; charset=utf-8",
  ],
  "/logic/list-users.js": [
    "../../logic/list-users.js",
    "text/javascript; charset=utf-8",
  ],
  "/logic/find-user-by-id.js": [
    "../../logic/find-user-by-id.js",
    "text/javascript; charset=utf-8",
  ],
  "/logic/update-user.js": [
    "../../logic/update-user.js",
    "text/javascript; charset=utf-8",
  ],
  "/logic/delete-user.js": [
    "../../logic/delete-user.js",
    "text/javascript; charset=utf-8",
  ],
  "/logic/shared.js": [
    "../../logic/shared.js",
    "text/javascript; charset=utf-8",
  ],
  "/queries/users.js": [
    "../../queries/users.js",
    "text/javascript; charset=utf-8",
  ],
  "/queries/queries/create-users-table.js": [
    "../../queries/queries/create-users-table.js",
    "text/javascript; charset=utf-8",
  ],
  "/queries/queries/find-by-id.js": [
    "../../queries/queries/find-by-id.js",
    "text/javascript; charset=utf-8",
  ],
  "/queries/queries/find-by-email.js": [
    "../../queries/queries/find-by-email.js",
    "text/javascript; charset=utf-8",
  ],
  "/queries/queries/find-by-name.js": [
    "../../queries/queries/find-by-name.js",
    "text/javascript; charset=utf-8",
  ],
  "/queries/queries/find-all.js": [
    "../../queries/queries/find-all.js",
    "text/javascript; charset=utf-8",
  ],
  "/queries/queries/insert.js": [
    "../../queries/queries/insert.js",
    "text/javascript; charset=utf-8",
  ],
  "/queries/queries/update.js": [
    "../../queries/queries/update.js",
    "text/javascript; charset=utf-8",
  ],
  "/queries/queries/remove.js": [
    "../../queries/queries/remove.js",
    "text/javascript; charset=utf-8",
  ],
  "/queries/queries/list-tables.js": [
    "../../queries/queries/list-tables.js",
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
  const filePath = publicFile[0];
  const contentType = publicFile[1];
  const fileUrl = new URL(filePath, import.meta.url);
  const content = await readFile(fileUrl);

  response.statusCode = 200;
  response.setHeader("Content-Type", contentType);
  response.setHeader("Cache-Control", "no-store");
  response.end(content);
}
