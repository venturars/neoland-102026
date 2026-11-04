export const INSERT_USER = `INSERT INTO users (name, email, created_at, updated_at)
VALUES (:name, :email, :createdAt, :updatedAt)
RETURNING id, name, email, created_at, updated_at;`;
