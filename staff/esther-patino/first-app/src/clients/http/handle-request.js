import { sendHttpError } from "./send-http-error.js";
import { servePublicFile } from "./serve-public-file.js";

export async function handleRequest(request, response) {
  try {
    const requestUrl = new URL(request.url, "http://127.0.0.1");
    const pathname = requestUrl.pathname;
    await servePublicFile(request, response, pathname);
  } catch (error) {
    sendHttpError(response, error);
  }
}
