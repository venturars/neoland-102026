import { showMessage } from "./show-message.js";

export function showScreen(screenName) {
  const screens = document.querySelectorAll("[data-screen]");

  for (const screen of screens) {
    screen.hidden = screen.id !== screenName + "-screen";
  }

  showMessage("", false);

  // Move focus with the screen so keyboard users do not remain on a hidden button.
  const heading = document.getElementById(screenName + "-heading");
  heading.focus();
}
