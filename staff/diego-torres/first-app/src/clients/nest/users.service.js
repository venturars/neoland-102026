// Permite que Nest cree este servicio y se lo pase al controlador.
import { Injectable } from "@nestjs/common";

// Crea un usuario (viene de la capa de lógica).
import { createUser } from "../../logic/create-user.js";
// Borra un usuario (viene de la capa de lógica).
import { deleteUser } from "../../logic/delete-user.js";
// Busca un usuario por su id (viene de la capa de lógica).
import { findUserById } from "../../logic/find-user-by-id.js";
// Devuelve la lista de usuarios (viene de la capa de lógica).
import { listUsers } from "../../logic/list-users.js";
// Modifica un usuario (viene de la capa de lógica).
import { updateUser } from "../../logic/update-user.js";

// Llama a la lógica. Las reglas no se repiten aquí.
@Injectable()
export class UsersService {
  // Crea un usuario con su nombre y su email.
  create(name, email) {
    return createUser({ name, email });
  }

  // Devuelve todos los usuarios.
  list() {
    return listUsers();
  }

  // Devuelve el usuario con ese id.
  find(id) {
    return findUserById(id);
  }

  // Cambia solo los datos que llegan en changes.
  update(id, changes) {
    return updateUser(id, changes);
  }

  // Borra el usuario con ese id.
  remove(id) {
    return deleteUser(id);
  }
}
