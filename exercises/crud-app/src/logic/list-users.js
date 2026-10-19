export function listUsers(users) {
  return { ok: true, data: users.listUsers() };
}
