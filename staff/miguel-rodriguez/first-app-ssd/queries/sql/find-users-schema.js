export const findUsersSchemaSql = `
  SELECT type, sql FROM sqlite_schema
  WHERE name = :name COLLATE NOCASE AND type IN ('table', 'view')
`;
