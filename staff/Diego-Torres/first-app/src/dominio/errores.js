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
