// Muestra la pantalla pedida ("list" o "detail") y oculta la otra.
export function showScreen(name) {
  // Oculta todas las pantallas y deja visible solo la que tiene ese nombre.
  const screens = document.querySelectorAll("[data-screen]");
  for (const screen of screens) {
    screen.hidden = screen.id !== `${name}-screen`;
  }
}
