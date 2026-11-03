export function showScreen(name) {
  const screens = document.querySelectorAll("[data-screen]");
  for (const screen of screens) {
    screen.hidden = screen.id !== `${name}-screen`;
  }
}
