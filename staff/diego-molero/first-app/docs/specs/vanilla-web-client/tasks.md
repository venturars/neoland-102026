# Tareas del cliente web vanilla

Issue: #778 (documentación) y #788 (implementación). La rama de implementación parte de la rama de notas de la PR #787.

- [x] **W-T01:** Preparar una copia temporal con dos usuarios, notas de ambos y casos vacíos, usando el inicializador explícito ya comprobado. W-01, W-05, W-10.
- [x] **W-T02:** Implementar lectura JSON limitada en bytes, salida JSON y traducción de errores, sin trasladar reglas de negocio a HTTP. W-03, W-06 a W-10.
- [x] **W-T03:** Implementar rutas de usuarios llamando a logic; validar formato completo de los IDs, métodos y cuerpos. W-01 a W-04, W-09.
- [x] **W-T04:** Implementar rutas anidadas de notas, conservando los dos IDs en cada llamada a logic. W-05 a W-10.
- [x] **W-T05:** Implementar mapa de archivos públicos y dispatcher; rechazar rutas y métodos no admitidos. W-01, W-10.
- [x] **W-T06:** Implementar arranque local, configuración PORT y cierre; documentar preparación explícita y comando de ejecución solo en la constitución. W-01, W-12.
- [x] **W-T07:** Crear HTML semántico de las cinco pantallas y CSS adaptable con labels, foco y mensajes accesibles. W-01 a W-08, W-11.
- [x] **W-T08:** Implementar acceso API, estado en memoria, cambio de pantalla y foco; restaurar botones al terminar y conservar formularios ante error. W-09, W-11, W-12.
- [x] **W-T09:** Implementar lista/selección de usuario y menú con sus tres destinos y estado sin usuarios. W-01, W-02, W-09, W-12.
- [x] **W-T10:** Implementar edición del usuario y borrado confirmado, incluyendo advertencia sobre notas; refrescar datos y estado. W-03, W-04, W-09.
- [x] **W-T11:** Implementar listado vacío, carga de nota, creación, edición, vuelta sin guardar y borrado confirmado; renderizar siempre texto plano. W-05 a W-10.
- [x] **W-T12:** Verificar API en copia aislada: respuestas y errores del plan, IDs mezclados, persistencia y cascada, cancelaciones, archivos privados y conservación de otros usuarios. W-01 a W-10, W-12.
- [x] **W-T13:** Recorrer la interfaz en navegador real a ancho normal y 390 px, con teclado, Unicode, errores de red, recarga y estados pendientes. W-01 a W-12.
- [x] **W-T14:** Revisar sintaxis, UTF-8, comentarios breves, enlaces y alcance; actualizar arquitectura, árbol, errores y registro factual. Cerrar procesos propios y verificar puerto libre. W-01 a W-12.

## Estado de esta entrega documental

La primera entrega de este documento fue solo documental. Las comprobaciones de implementación se registran debajo; no se atribuye a Diego una revisión individual que no ha realizado.

## Implementación autorizada · 2026-11-03 · Issue #788

Diego pidió continuar con el cliente web después de la entrega de notas. Esta autorización cubre implementación, comprobación y entrega de HTTP y pantallas vanilla; no atribuye una revisión individual de los documentos. La rama de implementación parte de la de notas de la PR #787, que depende de la propuesta documental de la PR #781. La aplicación usa una copia temporal para las comprobaciones, sin migrar la base personal.

## Evidencia de implementación · 2026-11-03

- En `.venv/web-788/` se copió `src/` sin archivos SQLite personales; `initializeDatabase()` preparó una base nueva con dos usuarios y notas separadas. Un proceso HTTP de la copia respondió a GET, POST, PATCH y DELETE, incluidos los nueve endpoints, persistencia, cascada y aislamiento de notas. Se comprobaron 400, 404, 405 con `Allow`, 409, 413 y 415, IDs con sufijos, campos desconocidos y archivos privados.
- En navegador real se recorrieron selección, menú, edición de usuario, listado, creación y edición de nota. Una nota `Prueba ñ` con contenido `<script>alert(1)</script>` apareció como texto, sin crear otro elemento script. Se comprobaron cancelación de edición y de ambos diálogos, borrado confirmado de usuario, listas vacías, recarga a selección y fallo de red con el formulario conservado. A 390 px no hubo desbordamiento; Tab y Enter activaron la selección y el foco llegó al encabezado del menú.
- `node --check` pasó en los módulos HTTP y web. `git diff --check` no señaló espacios incorrectos. El servidor temporal se cerró y el puerto 43187 quedó sin listener. La prueba se hizo en Windows con Node 24.14.1; no se atribuye cobertura de otros sistemas.
