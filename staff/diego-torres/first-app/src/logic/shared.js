const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email) {
  const normalized = String(email ?? "")
    .trim()
    .toLowerCase();
  if (!EMAIL_SHAPE.test(normalized)) {
    throw new Error("Email is invalid");
  }
  return normalized;
}

export function validateNewUser(data) {
  const nombre = String(data?.nombre ?? "").trim();
  if (nombre === "") {
    throw new Error("Name is required");
  }
  const email = validateEmail(data?.email);
  return { nombre, email };
}

export function validateChanges(changes) {
  const hasName = changes?.nombre !== undefined;
  const hasEmail = changes?.email !== undefined;
  if (!hasName && !hasEmail) {
    throw new Error("A name or an email is required");
  }

  const next = {};
  if (hasName) {
    const nombre = String(changes.nombre).trim();
    if (nombre === "") {
      throw new Error("Name is required");
    }
    next.nombre = nombre;
  }
  if (hasEmail) {
    next.email = validateEmail(changes.email);
  }
  return next;
}
