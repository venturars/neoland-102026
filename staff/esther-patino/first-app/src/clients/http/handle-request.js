import { handleUsers } from "./handle-users.js";
import { sendHttpError } from "./send-http-error.js";
import { servePublicFile } from "./serve-public-file.js";

export async function handleRequest(request, response) {
  try {
    const requestUrl = new URL(request.url, "http://127.0.0.1");
    const pathname = requestUrl.pathname;
    const isUsersCollection = pathname === "/api/users";
    const isUserResource = pathname.startsWith("/api/users/");

    if (isUsersCollection || isUserResource) {
      await handleUsers(request, response, pathname);
      return;
    }

    await servePublicFile(request, response, pathname);
  } catch (error) {
    sendHttpError(response, error);
  }
}
