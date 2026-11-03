import { readFile } from "node:fs/promises";
import { URL } from "node:url";

const STATIC_FILES = {
  "/styles.css": ["styles.css", "text/css; charset=utf-8"],
};

export async function serveStatic(request, response, pathname) {
  const isStaticFile = Object.hasOwn(STATIC_FILES, pathname);

  if (!isStaticFile) {
    throw new Error("HTTP resource does not exist");
  }

  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    throw new Error("HTTP method is not allowed");
  }

  const staticFile = STATIC_FILES[pathname];
  const fileName = staticFile[0];
  const contentType = staticFile[1];
  const fileUrl = new URL(fileName, import.meta.url);
  const content = await readFile(fileUrl);

  response.statusCode = 200;
  response.setHeader("Content-Type", contentType);
  response.setHeader("Cache-Control", "no-store");
  response.end(content);
}
