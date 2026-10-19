import {
  EmailDuplicado,
  UsuarioNoEncontrado,
  validarCambios,
  validarEmail,
  validarUsuarioNuevo,
} from "../dominio/usuario.js";

export async function crearUsuario(almacen, datos) {
  const usuario = validarUsuarioNuevo(datos);
  const yaExiste = await almacen.buscarPorEmail(usuario.email);
  if (yaExiste) {
    throw new EmailDuplicado(`El email ${usuario.email} ya está registrado`);
  }
  return almacen.guardar(usuario);
}

export async function actualizarUsuario(almacen, id, cambios) {
  const actual = await almacen.buscarPorId(id);
  if (!actual) {
    throw new UsuarioNoEncontrado(id);
  }

  const siguiente = validarCambios(actual, cambios);
  if (siguiente.email !== actual.email) {
    const otro = await almacen.buscarPorEmail(siguiente.email);
    if (otro && otro.id !== actual.id) {
      throw new EmailDuplicado(`El email ${siguiente.email} ya está registrado`);
    }
  }

  return almacen.guardar(siguiente);
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
  const emailLimpio = validarEmail(email);
  return almacen.buscarPorEmail(emailLimpio);
}
