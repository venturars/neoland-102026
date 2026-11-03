import { escapeHtml } from "./escape-html.js";
import { renderLayout } from "./render-layout.js";

export function renderSelectionPage(users) {
  let optionsHtml = "";

  if (users.length === 0) {
    const main =
      '        <p class="eyebrow">Usuarios</p>\n' +
      "        <h2>Selecciona un usuario</h2>\n" +
      '        <p class="description">No hay usuarios disponibles.</p>\n' +
      '        <p class="help">Crea usuarios desde la terminal o Jupyter.</p>\n';
    return renderLayout("First App · Selección", main);
  }

  for (const user of users) {
    const idText = String(user.id);
    const safeId = escapeHtml(idText);
    const label =
      "#" +
      escapeHtml(idText) +
      " · " +
      escapeHtml(user.name) +
      " — " +
      escapeHtml(user.email);
    optionsHtml +=
      '            <option value="' + safeId + '">' + label + "</option>\n";
  }

  const main =
    '        <p class="eyebrow">Usuarios</p>\n' +
    "        <h2>Selecciona un usuario</h2>\n" +
    '        <p class="description">Elige un usuario de la lista para ver sus opciones.</p>\n' +
    '        <form method="post" action="/select">\n' +
    '          <div class="field">\n' +
    '            <label for="user-select">Usuario</label>\n' +
    '            <select id="user-select" name="userId" required>\n' +
    '              <option value="" disabled selected>Elige un usuario</option>\n' +
    optionsHtml +
    "            </select>\n" +
    "          </div>\n" +
    '          <div class="actions">\n' +
    '            <button type="submit">Continuar</button>\n' +
    "          </div>\n" +
    "        </form>\n";

  return renderLayout("First App · Selección", main);
}
