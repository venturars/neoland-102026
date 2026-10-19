export function insertUser(db, user) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO users (email, name, created_at, updated_at) VALUES (?, ?, ?, ?)",
      [user.email, user.name, user.created_at, user.updated_at],
      // function, no flecha: sqlite3 deja el id nuevo en this.lastID.
      function onInsert(error) {
        if (error) {
          reject(error);
          return;
        }

        resolve({ id: this.lastID });
      },
    );
  });
}
