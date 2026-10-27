export function createMemoryStore() {
  const users = new Map();
  let next = 1;

  return {
    async save(user) {
      if (user.id === undefined || user.id === null) {
        const id = String(next);
        next += 1;
        const copy = { id, nombre: user.nombre, email: user.email };
        users.set(id, copy);
        return { ...copy };
      }

      const copy = {
        id: String(user.id),
        nombre: user.nombre,
        email: user.email,
      };
      users.set(copy.id, copy);
      return { ...copy };
    },

    async findById(id) {
      const user = users.get(String(id));
      return user ? { ...user } : null;
    },

    async findByEmail(email) {
      for (const user of users.values()) {
        if (user.email === email) {
          return { ...user };
        }
      }
      return null;
    },

    async findByName(name) {
      return [...users.values()]
        .filter((user) => user.nombre === name)
        .map((user) => ({ ...user }));
    },

    async findAll() {
      return [...users.values()].map((user) => ({ ...user }));
    },

    async remove(id) {
      return users.delete(String(id));
    },
  };
}
