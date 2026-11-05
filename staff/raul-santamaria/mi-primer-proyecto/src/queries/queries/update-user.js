export const UPDATE_USER = `UPDATE users
SET name = :name, email = :email, updated_at = :updatedAt
WHERE id = :id
RETURNING id, name, email, created_at, updated_at;`;
