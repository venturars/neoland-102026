// Valida identificadores y cuerpos antes de entrar en la lógica de negocio.
export function parseId(value, kind) {
  if (!/^\d+$/u.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) <= 0) {
    throw new Error(`${kind} ID is invalid`);
  }
  return Number(value);
}

export function requireJson(request) {
  if (!/^application\/json(?:\s*;\s*charset=utf-8)?$/iu.test(request.headers["content-type"] ?? "")) {
    throw new Error("Se necesita JSON.");
  }
  if (request.body === undefined) throw new Error("JSON no válido.");
}

export function methodNotAllowed(response, allowed) {
  return response.set("Allow", allowed).status(405).json({ message: "Método no permitido." });
}
