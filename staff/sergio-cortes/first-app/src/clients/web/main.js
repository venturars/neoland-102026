import {
  cancelDeleteConfirm,
  confirmDeleteSelectedUser,
  showDeleteConfirm,
} from "./delete-selected-user.js";
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
  deleteButton.addEventListener("click", showDeleteConfirm);
  const deleteConfirmYes = document.getElementById("delete-confirm-yes");
  deleteConfirmYes.addEventListener("click", confirmDeleteSelectedUser);
  const deleteConfirmNo = document.getElementById("delete-confirm-no");
  deleteConfirmNo.addEventListener("click", cancelDeleteConfirm);
  document.addEventListener("click", navigate);

  loadUserSelection();
}

initializeClient();
