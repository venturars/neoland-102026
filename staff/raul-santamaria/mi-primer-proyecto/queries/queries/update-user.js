export function updateUser(db, id, user) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE users SET email = ?, name = ?, updated_at = ? WHERE id = ?",
      [user.email, user.name, user.updated_at, id],
      (error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      },
    );
  });
}
