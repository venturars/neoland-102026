// Crea un usuario con lo escrito en el formulario de alta.
import { createUserFromForm } from "./create-user-from-form.js";
// Elimina el usuario de la ficha, si se confirma.
import { deleteCurrentUser } from "./delete-current-user.js";
// Abre la pantalla de la lista y carga los usuarios.
import { loadUsers } from "./load-users.js";
// Busca un usuario y abre su ficha.
import { openUser } from "./open-user.js";
// Guarda el formulario de la ficha.
import { saveUser } from "./save-user.js";

// Conecta el alta y la edición con la función que las atiende.
document
  .getElementById("create-form")
  .addEventListener("submit", createUserFromForm);
document.getElementById("edit-form").addEventListener("submit", saveUser);

// Al pedir un usuario por id, abre su ficha sin recargar la página.
document.getElementById("view-form").addEventListener("submit", (event) => {
  event.preventDefault();
  openUser(document.getElementById("view-id").value);
});

// Conecta los botones de la ficha.
document
  .getElementById("delete-button")
  .addEventListener("click", deleteCurrentUser);
document.getElementById("back-button").addEventListener("click", loadUsers);

// Al abrir la ventana, empieza por la lista.
loadUsers();
