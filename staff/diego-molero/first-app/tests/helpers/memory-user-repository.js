// Sustituye SQLite en las pruebas de negocio y devuelve copias de los usuarios.
export function createMemoryUserRepository() {
  const users = new Map();
  let nextId = 1;

  function copy(user) {
    return user ? { ...user } : undefined;
  }

  return {
    findById(id) {
      return copy(users.get(id));
    },
    findByEmail(email) {
      return copy([...users.values()].find((user) => user.email === email));
    },
    findAll() {
      return [...users.values()].map(copy);
    },
    insert(data) {
      const now = new Date().toISOString();
      const user = { ...data, id: nextId++, createdAt: now, updatedAt: now };
      users.set(user.id, user);
      return copy(user);
    },
    update({ id, name, email }) {
      const current = users.get(id);
      if (!current) {
        return undefined;
      }
      const user = { ...current, name, email, updatedAt: new Date().toISOString() };
      users.set(id, user);
      return copy(user);
    },
    remove(id) {
      return users.delete(id);
    },
  };
}
