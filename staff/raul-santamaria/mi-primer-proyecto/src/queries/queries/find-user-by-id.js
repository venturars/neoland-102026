export const FIND_USER_BY_ID = `SELECT id, name, email, created_at, updated_at
FROM users
WHERE id = :id;`;
