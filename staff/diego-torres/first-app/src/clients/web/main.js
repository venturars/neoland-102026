import { deleteSelectedUser } from "./delete-selected-user.js";
import { loadUserSelection } from "./load-user-selection.js";
import { navigate } from "./navigate.js";
import { saveUser } from "./save-user.js";
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
