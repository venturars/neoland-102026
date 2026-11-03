import { deleteSelectedUser } from "./delete-selected-user.js";
import { loadUserSelection } from "./load-user-selection.js";
import { navigate } from "./navigate.js";
import { saveUser } from "./save-user.js";
import { selectUser } from "./select-user.js";

export function initializeClient() {
  const selectionForm = document.getElementById("selection-form");
  selectionForm.addEventListener("submit", selectUser);
  const editForm = document.getElementById("edit-form");
  editForm.addEventListener("submit", saveUser);
  const deleteButton = document.getElementById("delete-user");
  deleteButton.addEventListener("click", deleteSelectedUser);
  document.addEventListener("click", navigate);

  loadUserSelection();
}

initializeClient();
