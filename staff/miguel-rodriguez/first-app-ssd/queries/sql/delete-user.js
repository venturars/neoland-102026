export const deleteUserSql = `
  DELETE FROM users WHERE id = :id RETURNING id AS id
`;
