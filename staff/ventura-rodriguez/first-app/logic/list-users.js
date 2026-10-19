import { findAll } from "../queries/users.js";

export function listUsers() {
  return { ok: true, users: findAll() };
}
