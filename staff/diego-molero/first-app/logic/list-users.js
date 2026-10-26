import { findAll } from "../queries/users.js";

// Devuelve los usuarios ordenados por identificador.
export function listUsers() {
  return findAll();
}
