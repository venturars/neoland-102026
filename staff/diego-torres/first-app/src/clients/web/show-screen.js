// Muestra la pantalla indicada por name.
export function showScreen(name) {
  // Oculta todas las pantallas menos la que tiene el id `${name}-screen`.
  const screens = document.querySelectorAll("[data-screen]");
  for (const screen of screens) {
    screen.hidden = screen.id !== `${name}-screen`;
  }
}
