import { EmailDuplicado, UsuarioNoEncontrado } from "./errores.js";
import { validarCambios, validarEmail, validarUsuarioNuevo } from "./usuario.js";

export async function crearUsuario(almacen, datos) {
  const usuario = validarUsuarioNuevo(datos);
  const existente = await almacen.buscarPorEmail(usuario.email);
  if (existente) {
    throw new EmailDuplicado(
      `El email ${usuario.email} ya está registrado`,
    );
  }
  return almacen.guardar(usuario);
}

export async function actualizarUsuario(almacen, id, cambios) {
  const siguiente = validarCambios(cambios);
  const actual = await almacen.buscarPorId(id);
  if (!actual) {
    throw new UsuarioNoEncontrado(id);
  }
  if (siguiente.email !== undefined && siguiente.email !== actual.email) {
    const otro = await almacen.buscarPorEmail(siguiente.email);
    if (otro) {
      throw new EmailDuplicado(
        `El email ${siguiente.email} ya está registrado`,
      );
    }
  }
  return almacen.guardar({ ...actual, ...siguiente, id: actual.id });
}

export async function eliminarUsuario(almacen, id) {
  const actual = await almacen.buscarPorId(id);
  if (!actual) {
    throw new UsuarioNoEncontrado(id);
  }
  await almacen.borrar(id);
  return actual;
}

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

export async function buscarUsuarioPorEmail(almacen, email) {
  const normalizado = validarEmail(email);
  return almacen.buscarPorEmail(normalizado);
}
