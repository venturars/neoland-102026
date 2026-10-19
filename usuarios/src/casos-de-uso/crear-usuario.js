import { EmailDuplicado } from "../dominio/errores.js";
import { validarUsuarioNuevo } from "../dominio/usuario.js";

export async function crearUsuario(almacen, datos) {
  const usuario = validarUsuarioNuevo(datos);
  const yaExiste = await almacen.buscarPorEmail(usuario.email);
  if (yaExiste) {
    throw new EmailDuplicado(`El email ${usuario.email} ya está registrado`);
  }
  return almacen.guardar(usuario);
}
