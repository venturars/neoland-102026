import { escapeHtml } from "./escape-html.js";

export function renderLayout(title, mainHtml) {
  const safeTitle = escapeHtml(title);
  const html =
    "<!doctype html>\n" +
    '<html lang="es">\n' +
    "  <head>\n" +
    '    <meta charset="utf-8" />\n' +
    '    <meta name="viewport" content="width=device-width, initial-scale=1" />\n' +
    "    <title>" +
    safeTitle +
    "</title>\n" +
    '    <link rel="stylesheet" href="/styles.css" />\n' +
    "  </head>\n" +
    "  <body>\n" +
    '    <div class="app">\n' +
    '      <header class="app-header">\n' +
    '        <p class="brand-mark">F</p>\n' +
    "        <div>\n" +
    "          <h1>First App</h1>\n" +
    "          <p>Gestión de usuarios</p>\n" +
    "        </div>\n" +
    "      </header>\n" +
    '      <main class="card">\n' +
    mainHtml +
    "      </main>\n" +
    "    </div>\n" +
    "  </body>\n" +
    "</html>\n";
  return html;
}
