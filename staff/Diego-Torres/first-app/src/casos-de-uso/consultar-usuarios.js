import { UsuarioNoEncontrado } from "../dominio/errores.js";

export async function obtenerUsuario(almacen, id) {
  const usuario = await almacen.buscarPorId(id);
  if (!usuario) {
    throw new UsuarioNoEncontrado(id);
  }
  return usuario;
}

export async function listarUsuarios(almacen) {
  return almacen.listar();
}
