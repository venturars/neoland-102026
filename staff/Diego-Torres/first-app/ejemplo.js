import {
  actualizarUsuario,
  crearAlmacenMemoria,
  crearUsuario,
  eliminarUsuario,
  listarUsuarios,
} from "./src/index.js";

const almacen = crearAlmacenMemoria();

const ana = await crearUsuario(almacen, {
  nombre: "Ana Ruiz",
  email: "ana@ejemplo.com",
});
await crearUsuario(almacen, {
  nombre: "Luis Peña",
  email: "luis@ejemplo.com",
});
await actualizarUsuario(almacen, ana.id, { nombre: "Ana Ruiz López" });
await eliminarUsuario(almacen, ana.id);

const quedan = await listarUsuarios(almacen);
console.log(quedan);
