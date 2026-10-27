# Guías separadas por tema

Quien trabaja en first-app encuentra cada regla en una única guía de su
tema, conservando su significado y adaptada a la estructura actual:

- `docs/ARCHITECTURE.md`: responsabilidades de las capas y sus contratos.
- `docs/TREE.md`: estructura de carpetas y archivos.
- `docs/DATABASE.md`: persistencia, esquema y consultas.
- `docs/ERRORS.md`: valores de salida, errores y sus mensajes válidos.
- `docs/STYLE.md`: idioma, nombres, formato y legibilidad del código.

La constitución conserva las reglas de documentación SDD y los cuatro pasos
de la lógica, y enlaza las guías. `AGENTS.md` conserva el proceso de trabajo,
los comandos y el cierre de tareas, y enlaza la guía de estilo.

## Criterios de aceptación

- Cada guía contiene solo su tema; todas las reglas existentes se conservan
  y el contenido trasladado se sustituye por enlaces, sin duplicaciones.
- Los enlaces desde la constitución y la guía del agente resuelven a los
  documentos correspondientes dentro del proyecto.
- La guía de estilo exige una acción por línea, separa `if` y
  `throw new Error` en líneas distintas y prohíbe clases, `this` y métodos.
- La guía del agente exige actualizar el árbol y la arquitectura cuando un
  desarrollo añade o elimina archivos, incluyéndolo en su spec. Las
  diferencias de estilo del código existente no bloquean una nueva spec.
- Al integrar `staging`, se conservan íntegramente las reglas de Socket:
  obligación en la constitución y procedimiento en la guía del agente,
  con su momento de validación, tres capas, criterios, resumen, exclusiones
  y decisión humana sobre las alertas, sin perder la separación de guías.
- Se respeta el flujo spec → plan → tasks → implementación, con aprobación
  entre fases.

## Límites

Solo documentación de `staff/jimena-duran/first-app/`, sin cambios en
JavaScript ni SQL ni referencias externas de autoría. Solo se incorporan
las cinco reglas indicadas y se conservan las reglas existentes, incluidas
las de Socket; no se alinea el código previo con el nuevo estilo.
