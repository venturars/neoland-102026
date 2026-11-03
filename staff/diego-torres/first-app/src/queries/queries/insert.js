export const INSERT_USER = `INSERT INTO users (name, email)
VALUES (:name, :email)
RETURNING *;`;
