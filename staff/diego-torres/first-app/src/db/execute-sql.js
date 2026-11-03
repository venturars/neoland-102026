import { db } from "./connection.js";

// Ejecuta una petición de /execute. Devuelve null si la petición no es válida.
export function executeSql(peticion) {
  const method = peticion?.method;
  const sql = peticion?.sql;
  const params = peticion?.params ?? {};

  if (typeof sql !== "string") {
    return null;
  }

  if (method === "exec") {
    db.exec(sql);
    return { ok: true };
  }

  if (method === "get") {
    const fila = db.prepare(sql).get(params);
    return { row: fila ?? null };
  }

  if (method === "all") {
    const filas = db.prepare(sql).all(params);
    return { rows: filas };
  }

  if (method === "run") {
    const info = db.prepare(sql).run(params);
    return { changes: Number(info.changes) };
  }

  return null;
}
