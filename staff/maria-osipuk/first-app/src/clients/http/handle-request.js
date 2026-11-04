import { handleUsers } from "./handle-users.js";
import { sendHttpError } from "./send-http-error.js";
import { servePublicFile } from "./serve-public-file.js";

export async function handleRequest(request, response) {
  try {
    // The base is only used to read a relative path. No external URL is fetched.
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
    // Every failed request gets a safe response, including an unexpected failure.
    sendHttpError(response, error);
  }
}
