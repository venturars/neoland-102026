const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class ErrorDeUsuarios extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = new.target.name;
  }
}

export class DatosInvalidos extends ErrorDeUsuarios {}

export class EmailDuplicado extends ErrorDeUsuarios {}

export class UsuarioNoEncontrado extends ErrorDeUsuarios {
  constructor(id) {
    super(`No existe un usuario con id ${id}`);
    this.id = id;
  }
}

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

export function validarEmail(email) {
  return exigirEmail(email);
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
