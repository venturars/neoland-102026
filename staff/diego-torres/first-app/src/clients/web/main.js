// Elimina el usuario seleccionado, si se confirma.
import { deleteSelectedUser } from "./delete-selected-user.js";
// Abre la pantalla de selección y carga los usuarios.
import { loadUserSelection } from "./load-user-selection.js";
// Cambia de pantalla según el botón pulsado.
import { navigate } from "./navigate.js";
// Guarda los datos del formulario de edición.
import { saveUser } from "./save-user.js";
// Busca el usuario elegido y abre su menú.
import { selectUser } from "./select-user.js";

// Conecta cada formulario y botón con la función que lo atiende.
const selectionForm = document.getElementById("selection-form");
selectionForm.addEventListener("submit", selectUser);
const editForm = document.getElementById("edit-form");
editForm.addEventListener("submit", saveUser);
const deleteButton = document.getElementById("delete-user");
deleteButton.addEventListener("click", deleteSelectedUser);
// Los botones con data-action se atienden todos en navigate.
document.addEventListener("click", navigate);

// Al abrir la página, empieza por la selección de usuario.
loadUserSelection();
