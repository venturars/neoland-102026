import { deleteUser } from "../../logic/delete-user.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";
import { URL } from "node:url";
import { parseFormBody } from "./parse-form-body.js";
import { parseUserId } from "./parse-user-id.js";
import { renderEditPage } from "./render-edit-page.js";
import { renderErrorPage } from "./render-error-page.js";
import { renderMenuPage } from "./render-menu-page.js";
import { renderSelectionPage } from "./render-selection-page.js";
import { redirectTo, sendHtml } from "./send-html.js";
import { serveStatic } from "./serve-static.js";

export async function handleRequest(request, response) {
  try {
    const requestUrl = new URL(request.url, "http://127.0.0.1");
    const pathname = requestUrl.pathname;

    if (pathname === "/styles.css") {
      await serveStatic(request, response, pathname);
      return;
    }

    if (pathname === "/" && request.method === "GET") {
      const users = listUsers();
      const html = renderSelectionPage(users);
      sendHtml(response, 200, html);
      return;
    }

    if (pathname === "/select" && request.method === "POST") {
      const body = await parseFormBody(request);
      const id = parseUserId(body.userId);
      findUserById(id);
      redirectTo(response, "/menu?id=" + String(id));
      return;
    }

    if (pathname === "/menu" && request.method === "GET") {
      const rawId = requestUrl.searchParams.get("id");
      const id = parseUserId(rawId);
      const user = findUserById(id);
      const html = renderMenuPage(user);
      sendHtml(response, 200, html);
      return;
    }

    if (pathname === "/edit" && request.method === "GET") {
      const rawId = requestUrl.searchParams.get("id");
      const id = parseUserId(rawId);
      const user = findUserById(id);
      const html = renderEditPage(user);
      sendHtml(response, 200, html);
      return;
    }

    if (pathname === "/save" && request.method === "POST") {
      const body = await parseFormBody(request);
      const id = parseUserId(body.userId);
      const rawName = body.name;
      const rawEmail = body.email;

      try {
        const user = updateUser(id, [rawName, rawEmail]);
        redirectTo(response, "/menu?id=" + String(user.id));
      } catch (error) {
        let message = "Unable to complete the operation";

        if (error instanceof Error) {
          message = error.message;
        }

        const storedUser = findUserById(id);
        const html = renderEditPage(storedUser, {
          errorMessage: message,
          name: rawName,
          email: rawEmail,
        });
        sendHtml(response, 400, html);
      }

      return;
    }

    if (pathname === "/delete" && request.method === "POST") {
      const body = await parseFormBody(request);
      const id = parseUserId(body.userId);
      deleteUser(id);
      redirectTo(response, "/");
      return;
    }

    throw new Error("HTTP resource does not exist");
  } catch (error) {
    let message = "Unable to complete the operation";

    if (error instanceof Error) {
      message = error.message;
    }

    const html = renderErrorPage(message);
    sendHtml(response, 400, html);
  }
}
