import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { crearAlmacenSqlite } from "./db/sqlite.js";
import {
  actualizarUsuario,
  buscarUsuarioPorEmail,
  crearUsuario,
  listarUsuarios,
} from "./logic/operaciones.js";

const ruta = join(dirname(fileURLToPath(import.meta.url)), "db", "usuarios.sqlite");
const almacen = crearAlmacenSqlite(ruta);

const email = "Ana@Ejemplo.com";
let ana = await buscarUsuarioPorEmail(almacen, email);
if (!ana) {
  ana = await crearUsuario(almacen, {
    nombre: " Ana ",
    email,
  });
}
console.log(ana);

const cambiada = await actualizarUsuario(almacen, ana.id, {
  nombre: "Ana Torres",
});
console.log(cambiada);
console.log(await listarUsuarios(almacen));
