export const FIND_USER_BY_EMAIL = `SELECT id, name, email, created_at, updated_at
FROM users
WHERE email = :email`;
