// Crear y actualizar comparten las mismas reglas y normalización.
export function isUserInput(input) {
  return (
    input !== null &&
    typeof input === "object" &&
    !Array.isArray(input) &&
    Object.keys(input).every((key) => key === "name" || key === "email")
  );
}

export function isValidId(id) {
  return Number.isSafeInteger(id) && id > 0;
}

export function validateUser(input) {
  if (!isUserInput(input)) {
    return { ok: false, error: "INVALID_INPUT" };
  }

  if (typeof input.name !== "string" || input.name.trim() === "") {
    return { ok: false, error: "INVALID_NAME" };
  }

  if (typeof input.email !== "string") {
    return { ok: false, error: "INVALID_EMAIL" };
  }

  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();

  // Validación básica del ejercicio: un @, dos partes y ningún espacio.
  if (email.length > 64 || !/^[^\s@]+@[^\s@]+$/u.test(email)) {
    return { ok: false, error: "INVALID_EMAIL" };
  }

  return { ok: true, data: { name, email } };
}
