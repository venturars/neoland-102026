import { EmailDuplicado, UsuarioNoEncontrado } from "./errores.js";
import { validarCambios } from "./usuario.js";

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
