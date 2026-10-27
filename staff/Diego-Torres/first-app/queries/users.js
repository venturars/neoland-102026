import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const carpetaQueries = join(dirname(fileURLToPath(import.meta.url)), "queries");

function leerSql(nombre) {
  return readFileSync(join(carpetaQueries, nombre), "utf8");
}

function copia(fila) {
  if (!fila) {
    return null;
  }
  return {
    id: String(fila.id),
    nombre: fila.name,
    email: fila.email,
  };
}

export function crearAlmacenSqlite(db) {
  db.exec(leerSql("create-users-table.sql"));

  const insertar = db.prepare(leerSql("insert.sql"));
  const actualizar = db.prepare(leerSql("update.sql"));
  const borrarUsuario = db.prepare(leerSql("remove.sql"));
  const buscarPorId = db.prepare(leerSql("find-by-id.sql"));
  const buscarPorEmail = db.prepare(leerSql("find-by-email.sql"));
  const buscarPorNombre = db.prepare(leerSql("find-by-name.sql"));
  const listarUsuarios = db.prepare(leerSql("find-all.sql"));

  return {
    async guardar(usuario) {
      if (usuario.id === undefined || usuario.id === null) {
        return copia(
          insertar.get({
            name: usuario.nombre,
            email: usuario.email,
          }),
        );
      }

      return copia(
        actualizar.get({
          id: Number(usuario.id),
          name: usuario.nombre,
          email: usuario.email,
        }),
      );
    },

    async buscarPorId(id) {
      return copia(buscarPorId.get({ id: Number(id) }));
    },

    async buscarPorEmail(email) {
      return copia(buscarPorEmail.get({ email }));
    },

    async buscarPorNombre(nombre) {
      return buscarPorNombre.all({ name: nombre }).map((fila) => copia(fila));
    },

    async listar() {
      return listarUsuarios.all().map((fila) => copia(fila));
    },

    async borrar(id) {
      const info = borrarUsuario.run({ id: Number(id) });
      return info.changes > 0;
    },
  };
}
