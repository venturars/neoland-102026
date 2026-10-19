import { EmailDuplicado, UsuarioNoEncontrado } from "../dominio/errores.js";
import { validarCambios } from "../dominio/usuario.js";

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
