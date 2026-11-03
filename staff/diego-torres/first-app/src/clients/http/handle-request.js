import { URL } from "node:url";

import { handleUsers } from "./handle-users.js";
import { sendHttpError } from "./send-http-error.js";
import { serveWebFile } from "./serve-web-file.js";

export async function handleRequest(store, request, response) {
  try {
    const pathname = new URL(request.url, "http://127.0.0.1").pathname;

    if (pathname === "/api/users" || pathname.startsWith("/api/users/")) {
      await handleUsers(store, request, response, pathname);
      return;
    }

    await serveWebFile(request, response, pathname);
  } catch (error) {
    sendHttpError(response, error);
  }
}
