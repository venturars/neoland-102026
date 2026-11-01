import { showMessage } from "./show-message.js";

export function showScreen(screenName) {
  const screens = document.querySelectorAll("[data-screen]");

  for (const screen of screens) {
    screen.hidden = screen.id !== screenName + "-screen";
  }

  showMessage("", false);
}
