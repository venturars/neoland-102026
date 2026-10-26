export const insertUserSql = `
  INSERT INTO users (name, email) VALUES (:name, :email)
  RETURNING id AS id, name AS name, email AS email,
    createdAt AS createdAt, updatedAt AS updatedAt
`;
