// Crear, actualizar y buscar comparten las reglas y normalización del correo.
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

export function validateEmail(input) {
  if (typeof input !== "string") {
    return { ok: false, error: "INVALID_EMAIL" };
  }

  const email = input.trim().toLowerCase();

  // Validación básica del ejercicio: un @, dos partes y ningún espacio.
  if (email.length > 64 || !/^[^\s@]+@[^\s@]+$/u.test(email)) {
    return { ok: false, error: "INVALID_EMAIL" };
  }

  return { ok: true, email };
}

export function validateUser(input) {
  if (!isUserInput(input)) {
    return { ok: false, error: "INVALID_INPUT" };
  }

  if (typeof input.name !== "string" || input.name.trim() === "") {
    return { ok: false, error: "INVALID_NAME" };
  }

  const validation = validateEmail(input.email);
  if (!validation.ok) {
    return validation;
  }

  return { ok: true, data: { name: input.name.trim(), email: validation.email } };
}
