export function findUserById(db, id) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT id, email, name, created_at, updated_at FROM users WHERE id = ?",
      [id],
      (error, row) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(row);
      },
    );
  });
}
