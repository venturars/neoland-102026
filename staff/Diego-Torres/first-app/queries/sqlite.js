import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const carpetaQueries = dirname(fileURLToPath(import.meta.url));

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
  db.exec(leerSql("esquema.sql"));

  const insertar = db.prepare(leerSql("insertar-usuario.sql"));
  const actualizar = db.prepare(leerSql("actualizar-usuario.sql"));
  const borrarUsuario = db.prepare(leerSql("borrar-usuario.sql"));
  const buscarPorId = db.prepare(leerSql("buscar-por-id.sql"));
  const buscarPorEmail = db.prepare(leerSql("buscar-por-email.sql"));
  const listarUsuarios = db.prepare(leerSql("listar-usuarios.sql"));

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

    async listar() {
      return listarUsuarios.all().map((fila) => copia(fila));
    },

    async borrar(id) {
      const info = borrarUsuario.run({ id: Number(id) });
      return info.changes > 0;
    },
  };
}
