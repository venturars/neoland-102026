import { DatosInvalidos } from "./errores.js";

const FORMA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarEmail(email) {
  const normalizado = String(email ?? "")
    .trim()
    .toLowerCase();
  if (!FORMA_EMAIL.test(normalizado)) {
    throw new DatosInvalidos("El email no es válido");
  }
  return normalizado;
}

export function validarUsuarioNuevo(datos) {
  const nombre = String(datos?.nombre ?? "").trim();
  if (nombre === "") {
    throw new DatosInvalidos("El nombre es obligatorio");
  }
  const email = validarEmail(datos?.email);
  return { nombre, email };
}

export function validarCambios(cambios) {
  const hayNombre = cambios?.nombre !== undefined;
  const hayEmail = cambios?.email !== undefined;
  if (!hayNombre && !hayEmail) {
    throw new DatosInvalidos("Hay que indicar un nombre o un email");
  }

  const salida = {};
  if (hayNombre) {
    const nombre = String(cambios.nombre).trim();
    if (nombre === "") {
      throw new DatosInvalidos("El nombre es obligatorio");
    }
    salida.nombre = nombre;
  }
  if (hayEmail) {
    salida.email = validarEmail(cambios.email);
  }
  return salida;
}
