export const listUsersSql = `
  SELECT id AS id, name AS name, email AS email,
    createdAt AS createdAt, updatedAt AS updatedAt
  FROM users ORDER BY id ASC
`;
