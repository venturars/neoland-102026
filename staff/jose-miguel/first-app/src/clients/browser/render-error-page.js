import { escapeHtml } from "./escape-html.js";
import { renderLayout } from "./render-layout.js";

export function renderErrorPage(message) {
  const safeMessage = escapeHtml(message);
  const main =
    '        <p class="eyebrow">Error</p>\n' +
    "        <h2>No se ha podido completar la acción</h2>\n" +
    '        <p class="message message-error" role="alert">' +
    safeMessage +
    "</p>\n" +
    '        <p><a href="/">Volver a la selección</a></p>\n';
  return renderLayout("First App · Error", main);
}
