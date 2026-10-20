export class DatosInvalidos extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = "DatosInvalidos";
  }
}

export class EmailDuplicado extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = "EmailDuplicado";
  }
}

export class UsuarioNoEncontrado extends Error {
  constructor(id) {
    super(`No existe un usuario con id ${id}`);
    this.name = "UsuarioNoEncontrado";
  }
}
