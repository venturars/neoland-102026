import { sendJson } from "./send-json.js";

const HTTP_ERRORS = {
  "Name is empty": 400,
  "Email is invalid": 400,
  "Invalid id": 400,
  "User not found": 404,
  "Email is already used": 409,
  "Request must contain JSON": 400,
  "Request JSON is invalid": 400,
  "Request JSON must be an object": 400,
  "HTTP resource does not exist": 404,
  "HTTP method is not allowed": 405,
};

export function sendHttpError(response, error) {
  let statusCode = 500;
  let message = "Unable to complete the operation";

  if (error instanceof Error) {
    const knownMessage = Object.hasOwn(HTTP_ERRORS, error.message);

    if (knownMessage) {
      statusCode = HTTP_ERRORS[error.message];
      message = error.message;
    }
  }

  sendJson(response, statusCode, { error: message });
}
