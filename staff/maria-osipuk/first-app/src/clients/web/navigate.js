import { loadUserSelection } from "./load-user-selection.js";
import { openUserEditor } from "./open-user-editor.js";
import { showUserMenu } from "./show-user-menu.js";
import { STATE } from "./state.js";

export function navigate(event) {
  const button = event.target.closest("button[data-action]");

  if (button === null || STATE.isBusy) {
    return;
  }

  const action = button.dataset.action;

  // Only these buttons navigate. The disabled notes option has no action.
  if (action === "selection") {
    loadUserSelection();
  }

  if (action === "menu") {
    showUserMenu();
  }

  if (action === "edit") {
    openUserEditor();
  }
}
