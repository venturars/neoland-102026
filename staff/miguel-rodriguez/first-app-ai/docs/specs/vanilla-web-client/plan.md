# Plan del cliente web

Issue: #760. Referencia: [spec](spec.md).
Preparación y ejecución delegadas por Miguel el 2026-11-02.

## Enfoque

Cliente vanilla servido por Node builtin HTTP en loopback, sin dependencias nuevas.
El navegador usa JSON del mismo origen; nunca importa node:sqlite. Las operaciones
existentes siguen en logic y SQL en queries. No se modifica ninguno de esos módulos.

## Archivos

- src/clients/http/server.js: exporta createWebServer(); sirve solo index.html,
  styles.css y main.js mediante una lista explícita; JSON con GET /api/users,
  GET /api/users/:id, PATCH /api/users/:id y DELETE /api/users/:id.
- src/clients/http/start-server.js: inicializa explícitamente la tabla y escucha
  en 127.0.0.1; WEB_PORT opcional, por defecto 8080. Informa URL y error de arranque.
- src/clients/web/index.html, styles.css y main.js: tres pantallas, navegación,
  selección en memoria, formulario y confirmación nativa de borrado.
- tests/web-client.test.js: Node builtin test en una copia temporal sin datos.
- package.json: comandos web y test:web, ampliar format a los archivos del cliente
  y pruebas; no cambiar dependencias ni lockfile.
- eslint.config.js: globals de navegador solo en src/clients/web y globals
  builtin de las pruebas/HTTP cuando sean necesarios.
- README.md, docs/ARCHITECTURE.md, docs/TREE.md: uso, responsabilidades e inventario.
- docs/CONSTITUTIONS.md: sustituir solo la afirmación obsoleta de que no hay cliente
  interactivo por descripción del cliente local. Contratos y SDD sin cambios.
- docs/specs/vanilla-web-client/: spec, plan, tareas y evidencia.

## Contratos y errores

createWebServer() devuelve un http.Server aún sin escuchar para pruebas en puerto
asignado por el sistema. GET lista/contacto devuelve JSON con los cinco campos
actuales. PATCH acepta solo un objeto con name/email string; campos omitidos se
preservan. IDs deben ser enteros positivos seguros. DELETE devuelve 204 sin cuerpo.
JSON inválido o forma incorrecta devuelve 400, no encontrado 404, método no admitido
405, contenido no JSON 415, cuerpo excesivo 413 y errores internos 500 genérico.
Los errores de validación de negocio siguen siendo los actuales; el cliente los
traduce a mensajes claros. No devolver stack traces ni detalles de base de datos.
Límite de cuerpo 8 KiB; no servir rutas del disco fuera de la lista. Solicitudes
mutadoras con Origin distinto al servidor se rechazan. Esta selección no es
identidad autenticada; no exponer el servidor públicamente.

## Verificación y riesgos

Usar copia temporal con código y dependencias existentes, sin base real. Probar
inicialización repetida, listas, consultas sin escrituras, guardado normalizado,
errores y borrado, entradas malformadas, métodos y rutas, origen ajeno, lista de
estáticos e inyección de nombres. Navegador: selección, menú, editor, mensajes,
confirmar/cancelar borrado, Notas pendiente, teclado y móvil. Cerrar servidores
propios. pnpm format y lint deben pasar; no instalar paquetes. Comparar hashes
para preservar src/logic, queries, db, terminal, Jupyter, lockfile y dependencias.

## Revisión

Revisado contra CA-01 a CA-07 antes de las tareas: alcance de tres pantallas,
ninguna capa nueva de negocio, ningún CRUD de notas ni librería nueva.
