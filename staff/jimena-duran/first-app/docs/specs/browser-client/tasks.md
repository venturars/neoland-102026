Issue: #832

# Tareas del cliente del navegador

Trece tareas aprobadas, implementadas y comprobadas localmente. Resultados y límites en verification.md; entrega aprobada para publicación en la PR draft #834, sin revisores ni merge.

- [x] T01. Confirmar las rutas de Chrome, Node y gestores existentes y el estado protegido de SQLite, ChromaDB y trabajos independientes.
  Resultado: Chrome y npm disponibles para browser; pnpm ausente en las rutas consultadas, sin instalaciones ni activación de Corepack. (CA-06)
- [x] T02. Crear src/clients/browser/index.html con las tres pantallas, textos en español, módulo ./app.js y estilo ./styles.css.
  Resultado: listado, menú y edición tienen sus controles; Notas está desactivado y el ID no es editable. (CA-01–CA-04)
- [x] T03. Crear src/clients/browser/styles.css para las tres pantallas y distinguir el botón desactivado.
  Resultado: presentación local legible sin paquetes ni cambios de estructura. (CA-01–CA-03)
- [x] T04. Crear src/clients/browser/app.js con imports directos de listUsers, updateUser y deleteUser desde ../../logic/*.js.
  Resultado: selección en memoria, guardar permanece en edición, volver descarta entradas pendientes y eliminar refresca el listado inmediatamente; errores como texto. (CA-01–CA-05)
- [x] T05. Añadir a package.json el script browser con lanzamiento PowerShell de Chrome, perfil temporal first-app-chrome y --allow-file-access-from-files.
  Resultado: abre la URI file de index.html con argumentos que respetan espacios; server, dependencias y versiones permanecen intactos. (CA-01, CA-06)
- [x] T06. Añadir browser/index.html, app.js y styles.css a docs/TREE.md.
  Resultado: el árbol describe exactamente los tres archivos nuevos del cliente. (CA-01–CA-04)
- [x] T07. Documentar en docs/ARCHITECTURE.md el cliente del navegador y sus imports directos de logic.
  Resultado: refleja archivo local y persistencia por queries y /execute, sin servidor HTML ni API CRUD adicional. (CA-01–CA-06)
- [x] T08. Recorrer las tres pantallas en Chrome con usuarios ficticios, incluido el listado vacío y la reapertura de la página.
  Resultado: selección, Notas desactivado, vuelta sin guardar, guardado en edición y borrado inmediato cumplen la spec y conservan otros usuarios. (CA-01–CA-04)
- [x] T09. Comprobar desde el navegador nombre vacío, correo inválido/duplicado y usuario eliminado por otra vía.
  Resultado: aparecen los cuatro mensajes de negocio existentes sin presentar éxito ni modificar datos ante el fallo. (CA-05)
- [x] T10. Comprobar listar, guardar y eliminar desde el navegador con el servidor de la copia desechable detenido.
  Resultado: se muestran los respectivos Could not ...; no se repite la batería de pruebas del servidor SQL. (CA-05)
- [x] T11. Usar navegador y Jupyter sobre el mismo servidor y SQLite ficticios de una única copia desechable.
  Resultado: reejecutar listados refleja escrituras de ambos clientes; no se infiere actualización desde salidas guardadas. (CA-06)
- [x] T12. Comprobar formato y lint con las herramientas disponibles, incluyendo explícitamente los tres archivos browser en formato.
  Resultado: archivos de esta entrega conformes sin ampliar reglas, dependencias ni cambios ajenos. (CA-01–CA-06)
- [x] T13. Registrar comandos, resultados, límites y conservación del alcance en verification.md al ejecutar las tareas aprobadas.
  Resultado: evidencia distingue pruebas reales de pendientes, confirma datos protegidos y cierre de procesos propios, sin atribuir validación al SQL intacto. (CA-01–CA-06)
