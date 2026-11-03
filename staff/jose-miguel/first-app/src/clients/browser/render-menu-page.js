import { escapeHtml } from "./escape-html.js";
import { renderLayout } from "./render-layout.js";

export function renderMenuPage(user) {
  const idText = String(user.id);
  const main =
    '        <p class="eyebrow">Menú del usuario</p>\n' +
    "        <h2>¿Qué quieres hacer?</h2>\n" +
    '        <div class="user-summary">\n' +
    "          <p>Usuario #" +
    escapeHtml(idText) +
    "</p>\n" +
    "          <h3>" +
    escapeHtml(user.name) +
    "</h3>\n" +
    "          <p>" +
    escapeHtml(user.email) +
    "</p>\n" +
    "        </div>\n" +
    '        <div class="menu-actions">\n' +
    '          <a class="button" href="/edit?id=' +
    escapeHtml(idText) +
    '">Modificar usuario</a>\n' +
    '          <button type="button" disabled>Ir a notas</button>\n' +
    '          <a class="button secondary" href="/">Volver a la selección</a>\n' +
    "        </div>\n";

  return renderLayout("First App · Menú", main);
}
