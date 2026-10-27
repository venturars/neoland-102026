import { UsuarioNoEncontrado } from "./errores.js";

export async function obtenerUsuario(almacen, id) {
  const usuario = await almacen.buscarPorId(id);
  if (!usuario) {
    throw new UsuarioNoEncontrado(id);
  }
  return usuario;
}
