export function parseName(value) {
  if (typeof value !== "string") {
    return { ok: false, error: "EMPTY_NAME" };
  }
  const name = value.trim();
  if (name === "") {
    return { ok: false, error: "EMPTY_NAME" };
  }
  return { ok: true, name };
}

export function parseEmail(value) {
  if (typeof value !== "string") {
    return { ok: false, error: "INVALID_EMAIL" };
  }
  const email = value.trim().toLowerCase();
  const parts = email.split("@");
  const hasSingleAt =
    parts.length === 2 && parts[0].length > 0 && parts[1].length > 0;
  if (!hasSingleAt || email.length > 64) {
    return { ok: false, error: "INVALID_EMAIL" };
  }
  return { ok: true, email };
}
