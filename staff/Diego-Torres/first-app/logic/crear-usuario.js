import { EmailDuplicado } from "./errores.js";
import { validarUsuarioNuevo } from "./usuario.js";

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
