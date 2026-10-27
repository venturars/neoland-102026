import { DatosInvalidos } from "./errores.js";

export async function buscarUsuarioPorNombre(almacen, nombre) {
  const recortado = String(nombre ?? "").trim();
  if (recortado === "") {
    throw new DatosInvalidos("El nombre es obligatorio");
  }
  return almacen.buscarPorNombre(recortado);
}
