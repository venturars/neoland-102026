import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const carpetaDb = dirname(fileURLToPath(import.meta.url));
const carpetaQueries = join(carpetaDb, "..", "queries");

function leerSql(carpeta, nombre) {
  return readFileSync(join(carpeta, nombre), "utf8");
}

function copia(fila) {
  if (!fila) {
    return null;
  }
  return {
    id: String(fila.id),
    nombre: fila.nombre,
    email: fila.email,
  };
}

export function crearAlmacenSqlite(ruta) {
  const db = new DatabaseSync(ruta);
  db.exec(leerSql(carpetaDb, "esquema.sql"));

  const insertar = db.prepare(leerSql(carpetaQueries, "insertar-usuario.sql"));
  const actualizar = db.prepare(
    leerSql(carpetaQueries, "actualizar-usuario.sql"),
  );
  const borrarUsuario = db.prepare(leerSql(carpetaQueries, "borrar-usuario.sql"));
  const buscarPorId = db.prepare(leerSql(carpetaQueries, "buscar-por-id.sql"));
  const buscarPorEmail = db.prepare(
    leerSql(carpetaQueries, "buscar-por-email.sql"),
  );
  const listarUsuarios = db.prepare(
    leerSql(carpetaQueries, "listar-usuarios.sql"),
  );

  return {
    async guardar(usuario) {
      if (usuario.id === undefined || usuario.id === null) {
        const info = insertar.run({
          nombre: usuario.nombre,
          email: usuario.email,
        });
        return {
          id: String(info.lastInsertRowid),
          nombre: usuario.nombre,
          email: usuario.email,
        };
      }

      actualizar.run({
        id: Number(usuario.id),
        nombre: usuario.nombre,
        email: usuario.email,
      });
      return {
        id: String(usuario.id),
        nombre: usuario.nombre,
        email: usuario.email,
      };
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
