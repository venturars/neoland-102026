import { comprobarAlmacen } from "./contrato.js";

export function crearAlmacenMemoria() {
  const porId = new Map();
  let siguienteId = 1;

  const almacen = {
    async guardar(usuario) {
      const id = usuario.id ?? String(siguienteId++);
      const guardado = { ...usuario, id };
      porId.set(id, guardado);
      return { ...guardado };
    },

    async buscarPorId(id) {
      const usuario = porId.get(String(id));
      return usuario ? { ...usuario } : null;
    },

    async buscarPorEmail(email) {
      const buscado = String(email ?? "").trim().toLowerCase();
      for (const usuario of porId.values()) {
        if (usuario.email === buscado) {
          return { ...usuario };
        }
      }
      return null;
    },

    async listar() {
      return [...porId.values()].map((usuario) => ({ ...usuario }));
    },

    async borrar(id) {
      return porId.delete(String(id));
    },
  };

  return comprobarAlmacen(almacen);
}
