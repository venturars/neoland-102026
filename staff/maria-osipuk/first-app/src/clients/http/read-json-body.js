import { Buffer } from "node:buffer";

const MAX_BODY_BYTES = 64 * 1024;

export async function readJsonBody(request) {
  const contentType = request.headers["content-type"];

  if (typeof contentType !== "string") {
    throw new Error("Request must contain JSON");
  }

  const contentTypeParts = contentType.split(";");
  const rawMediaType = contentTypeParts[0];
  const trimmedMediaType = rawMediaType.trim();
  const mediaType = trimmedMediaType.toLowerCase();

  if (mediaType !== "application/json") {
    throw new Error("Request must contain JSON");
  }

  const chunks = [];
  let bodyBytes = 0;
  let bodyIsTooLarge = false;

  for await (const chunk of request) {
    bodyBytes = bodyBytes + chunk.length;

    if (bodyBytes > MAX_BODY_BYTES) {
      bodyIsTooLarge = true;
    }

    // Finish reading an oversized request without keeping its remaining data.
    // This leaves the connection available to send the 413 response.
    if (!bodyIsTooLarge) {
      chunks.push(chunk);
    }
  }

  if (bodyIsTooLarge) {
    throw new Error("Request body is too large");
  }

  // Join bytes before decoding so a split accented character stays intact.
  const buffer = Buffer.concat(chunks);
  const text = buffer.toString("utf8");
  let body;

  try {
    body = JSON.parse(text);
  } catch {
    throw new Error("Request JSON is invalid");
  }

  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("Request JSON must be an object");
  }

  return body;
}
