// Este adaptador concentra el SQL; todos los datos se pasan como parámetros.
export function createSqliteUserRepository(db) {
  const findByIdStatement = db.prepare("SELECT * FROM users WHERE id = :id");
  const findByEmailStatement = db.prepare("SELECT * FROM users WHERE email = :email");
  const findAllStatement = db.prepare("SELECT * FROM users ORDER BY id");
  const insertStatement = db.prepare(`
    INSERT INTO users (name, email)
    VALUES (:name, :email)
    RETURNING *
  `);
  const updateStatement = db.prepare(`
    UPDATE users
    SET name = :name,
        email = :email,
        updatedAt = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    WHERE id = :id
    RETURNING *
  `);
  const removeStatement = db.prepare("DELETE FROM users WHERE id = :id");

  // Devuelve objetos JavaScript normales en lugar de filas propias del driver.
  function toUser(row) {
    return row ? { ...row } : undefined;
  }

  function writeUser(statement, parameters) {
    try {
      return toUser(statement.get(parameters));
    } catch (error) {
      // SQLITE_CONSTRAINT_UNIQUE se traduce a un error independiente de SQLite.
      if (error.code === "ERR_SQLITE_ERROR" && error.errcode === 2067) {
        const duplicateEmail = new Error("El correo ya está registrado.", { cause: error });
        duplicateEmail.code = "EMAIL_ALREADY_USED";
        throw duplicateEmail;
      }
      throw error;
    }
  }

  return {
    findById(id) {
      return toUser(findByIdStatement.get({ id }));
    },
    findByEmail(email) {
      return toUser(findByEmailStatement.get({ email }));
    },
    findAll() {
      return findAllStatement.all().map(toUser);
    },
    insert({ name, email }) {
      return writeUser(insertStatement, { name, email });
    },
    update({ id, name, email }) {
      return writeUser(updateStatement, { id, name, email });
    },
    remove(id) {
      return removeStatement.run({ id }).changes > 0;
    },
  };
}
