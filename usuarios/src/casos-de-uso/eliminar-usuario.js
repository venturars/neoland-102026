import { UsuarioNoEncontrado } from "../dominio/errores.js";

export async function eliminarUsuario(almacen, id) {
  const actual = await almacen.buscarPorId(id);
  if (!actual) {
    throw new UsuarioNoEncontrado(id);
  }
  await almacen.borrar(id);
  return actual;
}
