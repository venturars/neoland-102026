import { DatosInvalidos } from "./errores.js";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function texto(valor) {
  return String(valor ?? "").trim();
}

function exigirNombre(nombre) {
  const limpio = texto(nombre);
  if (!limpio) {
    throw new DatosInvalidos("El nombre es obligatorio");
  }
  return limpio;
}

function exigirEmail(email) {
  const limpio = texto(email).toLowerCase();
  if (!EMAIL.test(limpio)) {
    throw new DatosInvalidos("El email no es válido");
  }
  return limpio;
}

export function validarUsuarioNuevo({ nombre, email }) {
  return {
    nombre: exigirNombre(nombre),
    email: exigirEmail(email),
  };
}

export function validarCambios(actual, cambios) {
  const hayNombre = Object.hasOwn(cambios, "nombre");
  const hayEmail = Object.hasOwn(cambios, "email");
  if (!hayNombre && !hayEmail) {
    throw new DatosInvalidos("Hay que indicar un nombre o un email");
  }

  return {
    ...actual,
    nombre: hayNombre ? exigirNombre(cambios.nombre) : actual.nombre,
    email: hayEmail ? exigirEmail(cambios.email) : actual.email,
  };
}
