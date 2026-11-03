import { escapeHtml } from "./escape-html.js";
import { renderLayout } from "./render-layout.js";

export function renderEditPage(user, options) {
  let errorBlock = "";
  let nameValue = user.name;
  let emailValue = user.email;

  if (options !== undefined) {
    if (options.errorMessage !== undefined) {
      const safeError = escapeHtml(options.errorMessage);
      errorBlock =
        '        <p class="message message-error" role="alert">' +
        safeError +
        "</p>\n";
    }
    if (options.name !== undefined) {
      nameValue = options.name;
    }
    if (options.email !== undefined) {
      emailValue = options.email;
    }
  }

  const idText = String(user.id);
  const confirmText =
    "¿Eliminar al usuario «" +
    user.name +
    "»? Esta acción no se puede deshacer.";

  const main =
    errorBlock +
    '        <p class="eyebrow">Datos del usuario</p>\n' +
    "        <h2>Modificar usuario</h2>\n" +
    '        <p class="description">Edita los datos y guarda los cambios.</p>\n' +
    '        <form method="post" action="/save">\n' +
    '          <input type="hidden" name="userId" value="' +
    escapeHtml(idText) +
    '" />\n' +
    '          <div class="field">\n' +
    '            <label for="user-name">Nombre</label>\n' +
    '            <input id="user-name" name="name" type="text" required value="' +
    escapeHtml(nameValue) +
    '" />\n' +
    "          </div>\n" +
    '          <div class="field">\n' +
    '            <label for="user-email">Email</label>\n' +
    '            <input id="user-email" name="email" type="email" required value="' +
    escapeHtml(emailValue) +
    '" />\n' +
    "          </div>\n" +
    '          <div class="actions">\n' +
    '            <button type="submit">Guardar cambios</button>\n' +
    '            <a class="button secondary" href="/menu?id=' +
    escapeHtml(idText) +
    '">Volver sin guardar</a>\n' +
    "          </div>\n" +
    "        </form>\n" +
    '        <div class="danger-zone">\n' +
    "          <h3>Eliminar usuario</h3>\n" +
    "          <p>Se eliminará este usuario de forma permanente.</p>\n" +
    '          <form method="post" action="/delete" onsubmit="return confirm(' +
    JSON.stringify(confirmText) +
    ');">\n' +
    '            <input type="hidden" name="userId" value="' +
    escapeHtml(idText) +
    '" />\n' +
    '            <button class="danger" type="submit">Eliminar usuario</button>\n' +
    "          </form>\n" +
    "        </div>\n";

  return renderLayout("First App · Edición", main);
}
