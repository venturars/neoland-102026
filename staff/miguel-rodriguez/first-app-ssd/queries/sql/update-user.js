export const updateUserSql = `
  UPDATE users SET name = :name, email = :email, updatedAt = datetime('now')
  WHERE id = :id
  RETURNING id AS id, name AS name, email AS email,
    createdAt AS createdAt, updatedAt AS updatedAt
`;
