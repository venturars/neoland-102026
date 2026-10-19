import { EmailInUseError } from '../errors.js';

// The caller owns the SQLite connection and closes it when finished.
export function createUsersRepository(database) {
  const insert = database.prepare(
    'INSERT INTO users (name, email) VALUES (?, ?) RETURNING id, name, email, createdAt, updatedAt'
  );
  const find = database.prepare('SELECT id, name, email, createdAt, updatedAt FROM users WHERE id = ?');
  const findEmail = database.prepare('SELECT id, name, email, createdAt, updatedAt FROM users WHERE email = ?');
  const list = database.prepare('SELECT id, name, email, createdAt, updatedAt FROM users ORDER BY id');
  const update = database.prepare(
    "UPDATE users SET name = ?, email = ?, updatedAt = datetime('now') WHERE id = ? RETURNING id, name, email, createdAt, updatedAt"
  );
  const remove = database.prepare('DELETE FROM users WHERE id = ? RETURNING id');

  // SQLite rows are copied into ordinary JavaScript objects.
  function toUser(row) {
    return row === undefined ? undefined : { ...row };
  }

  function write(statement, ...values) {
    try {
      return toUser(statement.get(...values));
    } catch (error) {
      if (error.code === 'ERR_SQLITE_ERROR' && error.errcode === 2067) {
        throw new EmailInUseError('UNIQUE email constraint failed.', { cause: error });
      }
      throw error;
    }
  }

  return {
    createUser({ name, email }) {
      return write(insert, name, email);
    },
    findUserById(id) {
      return toUser(find.get(id));
    },
    findUserByEmail(email) {
      return toUser(findEmail.get(email));
    },
    listUsers() {
      return list.all().map(toUser);
    },
    // Both fields are required here; partial-update rules belong in the logic layer.
    updateUser(id, { name, email }) {
      return write(update, name, email, id);
    },
    deleteUser(id) {
      const row = remove.get(id);
      return row === undefined ? undefined : { ...row };
    },
  };
}
