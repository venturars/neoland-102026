export const findUserByEmailSql = `
  SELECT id AS id, name AS name, email AS email,
    createdAt AS createdAt, updatedAt AS updatedAt FROM users WHERE email = :email
`;
