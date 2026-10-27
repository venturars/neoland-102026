export function crearAlmacenMemoria() {
  const usuarios = new Map();
  let siguiente = 1;

  return {
    async guardar(usuario) {
      if (usuario.id === undefined || usuario.id === null) {
        const id = String(siguiente);
        siguiente += 1;
        const copia = { id, nombre: usuario.nombre, email: usuario.email };
        usuarios.set(id, copia);
        return { ...copia };
      }

      const copia = {
        id: String(usuario.id),
        nombre: usuario.nombre,
        email: usuario.email,
      };
      usuarios.set(copia.id, copia);
      return { ...copia };
    },

    async buscarPorId(id) {
      const usuario = usuarios.get(String(id));
      return usuario ? { ...usuario } : null;
    },

    async buscarPorEmail(email) {
      for (const usuario of usuarios.values()) {
        if (usuario.email === email) {
          return { ...usuario };
        }
      }
      return null;
    },

    async buscarPorNombre(nombre) {
      return [...usuarios.values()]
        .filter((usuario) => usuario.nombre === nombre)
        .map((usuario) => ({ ...usuario }));
    },

    async listar() {
      return [...usuarios.values()].map((usuario) => ({ ...usuario }));
    },

    async borrar(id) {
      return usuarios.delete(String(id));
    },
  };
}
