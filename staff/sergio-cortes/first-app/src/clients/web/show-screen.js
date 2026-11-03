import { resetDeleteConfirm } from "./delete-selected-user.js";
import { showMessage } from "./show-message.js";

export function showScreen(screenName) {
  const screens = document.querySelectorAll("[data-screen]");

  for (const screen of screens) {
    screen.hidden = screen.id !== screenName + "-screen";
  }

  if (screenName !== "edit") {
    resetDeleteConfirm();
  }

  showMessage("", false);
}
