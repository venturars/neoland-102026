import { findAll } from "../queries/users.js";

// Conserva el formato de salida y el orden por identificador de las consultas.
export function listUsers() {
  return { ok: true, users: findAll() };
}
