import { validarEmail } from "./usuario.js";

export async function buscarUsuarioPorEmail(almacen, email) {
  const normalizado = validarEmail(email);
  return almacen.buscarPorEmail(normalizado);
}
