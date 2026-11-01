import { Buffer } from "node:buffer";

export async function readJsonBody(request) {
  const contentType = request.headers["content-type"];

  if (typeof contentType !== "string") {
    throw new Error("Request must contain JSON");
  }

  const contentTypeParts = contentType.split(";");
  const rawMediaType = contentTypeParts[0];
  const mediaType = rawMediaType.trim().toLowerCase();

  if (mediaType !== "application/json") {
    throw new Error("Request must contain JSON");
  }

  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

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
