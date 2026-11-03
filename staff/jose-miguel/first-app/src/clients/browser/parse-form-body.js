import { Buffer } from "node:buffer";
import { URLSearchParams } from "node:url";

export async function parseFormBody(request) {
  const contentType = request.headers["content-type"];
  let typeMissing = false;

  if (typeof contentType !== "string") {
    typeMissing = true;
  }

  if (!typeMissing) {
    const contentTypeParts = contentType.split(";");
    const rawMediaType = contentTypeParts[0];
    const mediaType = rawMediaType.trim().toLowerCase();

    if (mediaType !== "application/x-www-form-urlencoded") {
      typeMissing = true;
    }
  }

  if (typeMissing) {
    throw new Error("Form must use application/x-www-form-urlencoded");
  }

  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const buffer = Buffer.concat(chunks);
  const text = buffer.toString("utf8");
  const params = new URLSearchParams(text);
  const body = {};

  for (const [key, value] of params.entries()) {
    body[key] = value;
  }

  return body;
}
