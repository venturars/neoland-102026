export function deleteUser(db, id) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM users WHERE id = ?", [id], (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}
