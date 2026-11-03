import { sendJson } from "./send-json.js";

const BAD_REQUEST_MESSAGES = [
  "Name is required",
  "Email is invalid",
  "A name or an email is required",
  "Body is not valid JSON",
];

export function sendHttpError(response, error) {
  const message = error?.message ?? "";

  if (message.startsWith("There is no user with id")) {
    sendJson(response, 404, { error: message });
    return;
  }

  const isEmailTaken =
    message.startsWith("Email ") && message.endsWith(" is already registered");
  if (BAD_REQUEST_MESSAGES.includes(message) || isEmailTaken) {
    sendJson(response, 400, { error: message });
    return;
  }

  sendJson(response, 500, { error: "Unexpected error" });
}
