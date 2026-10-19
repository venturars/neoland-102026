export const OPERACIONES_ALMACEN = [
  "guardar",
  "buscarPorId",
  "buscarPorEmail",
  "listar",
  "borrar",
];

export function comprobarAlmacen(almacen) {
  for (const operacion of OPERACIONES_ALMACEN) {
    if (typeof almacen?.[operacion] !== "function") {
      throw new Error(`El almacén debe implementar ${operacion}()`);
    }
  }
  return almacen;
}
