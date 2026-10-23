export const findUserByIdSql = `
  SELECT id AS id, name AS name, email AS email,
    createdAt AS createdAt, updatedAt AS updatedAt
  FROM users WHERE id = :id
`;
