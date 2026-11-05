// AsistenciApp · tema del panel (spec 007 · CA-19, decisión de Victor del 2026-11-05)
// La ventana de escritorio abre el panel con ?tema=claro: siempre en claro, aunque el sistema esté en
// oscuro. En un navegador (y en las páginas de los alumnos) se sigue el modo del sistema (spec 006).
// Va en el <head> y sin defer: se aplica antes de pintar, así no hay un parpadeo en oscuro.
if (new URLSearchParams(location.search).get("tema") === "claro") {
  document.documentElement.dataset.tema = "claro";
}
