// sqlite3 avisa con un callback cuando termina.
// runSql usa function, no una flecha, porque el id nuevo llega en this.

function runSql(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) {
        reject(error);
        return;
      }

      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function getOne(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(row);
    });
  });
}

function getAll(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows);
    });
  });
}

export function createUsersTable(db) {
  return runSql(
    db,
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      email VARCHAR(64) NOT NULL UNIQUE,
      name VARCHAR(64) NOT NULL
    )`
  );
}

export async function createSqliteUsers(db) {
  await createUsersTable(db);

  function findById(id) {
    return getOne(db, "SELECT id, email, name FROM users WHERE id = ?", [id]);
  }

  function findByEmail(email) {
    return getOne(db, "SELECT id, email, name FROM users WHERE email = ?", [email]);
  }

  function list() {
    return getAll(db, "SELECT id, email, name FROM users ORDER BY id");
  }

  async function insert(user) {
    const result = await runSql(
      db,
      "INSERT INTO users (email, name) VALUES (?, ?)",
      [user.email, user.name]
    );

    return findById(result.id);
  }

  async function update(id, changes) {
    if (changes.email !== undefined && changes.name !== undefined) {
      await runSql(
        db,
        "UPDATE users SET email = ?, name = ? WHERE id = ?",
        [changes.email, changes.name, id]
      );
    } else if (changes.email !== undefined) {
      await runSql(
        db,
        "UPDATE users SET email = ? WHERE id = ?",
        [changes.email, id]
      );
    } else if (changes.name !== undefined) {
      await runSql(
        db,
        "UPDATE users SET name = ? WHERE id = ?",
        [changes.name, id]
      );
    }

    return findById(id);
  }

  function remove(id) {
    return runSql(db, "DELETE FROM users WHERE id = ?", [id]);
  }

  return {
    findById,
    findByEmail,
    list,
    insert,
    update,
    remove,
  };
}
