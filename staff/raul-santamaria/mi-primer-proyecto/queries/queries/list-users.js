export function listUsers(db) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT id, email, name, created_at, updated_at FROM users ORDER BY id",
      (error, rows) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(rows);
      },
    );
  });
}
