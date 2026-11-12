# Plan — guías separadas por tema

## Distribución

Trasladar las reglas actuales de `AGENTS.md` y `docs/CONSTITUTIONS.md`
sin cambiar su significado:

| Documento en `docs/` | Contenido |
| --- | --- |
| `ARCHITECTURE.md` | Tecnologías, responsabilidades de las capas, contratos de lógica y separación del SQL. |
| `TREE.md` | Árbol de carpetas y archivos del proyecto. |
| `DATABASE.md` | Base y conexión únicas, esquema, fechas, carga y ejecución de consultas y parámetros SQL nombrados. |
| `ERRORS.md` | Mensajes válidos, validaciones, fallos de SQLite, resultados limpios, listas vacías, ausencia de retorno y valores del clasificador. |
| `STYLE.md` | Idioma, nombres, exportaciones, imports, constantes, firmas, comentarios, legibilidad y formato Prettier. |

La constitución conserva el contexto educativo, las reglas SDD y los cuatro
pasos de la lógica; enlaza las cinco guías y actualiza la referencia a los
errores. `AGENTS.md` conserva los comandos, las reglas de trabajo y el cierre
de tareas; enlaza la constitución y `docs/STYLE.md`. Las reglas de estilo
dejan de repetirse en los comandos.

## Reglas adicionales aprobadas

- `docs/STYLE.md`: añadir una acción por línea; separar `if` y
  `throw new Error` en líneas distintas; prohibir clases, `this` y métodos.
- `AGENTS.md`: exigir que la spec de un desarrollo que añada o elimine
  archivos contemple actualizar `docs/TREE.md` y `docs/ARCHITECTURE.md`.
  El estilo se toma de `docs/STYLE.md`; las diferencias del código existente
  no bloquean una nueva spec. Conservar las demás reglas de trabajo.

## Conservación de Socket

La rama todavía no contiene las reglas de paquetes integradas en `staging`.
Su integración requiere autorización separada; este plan no ejecuta el merge.
Cuando se autorice, integrar `origin/staging` y resolver los posibles
conflictos conservando la separación de guías de esta tarea y las secciones
«Paquetes» de la constitución y de `AGENTS.md`, junto con su documentación
SDD. No sustituir un documento completo por la versión de una sola rama.

Comprobar que se mantienen la validación previa a aprobar el plan para
paquetes de Node nuevos o cambios de versión, el MCP de Socket, tres capas,
campañas, alertas, puntuaciones inferiores a 50, resumen por paquete y
versión, exclusiones y decisión humana sobre las alertas.

## Verificación

Contrastar cada regla original con su destino para confirmar que no falta
ninguna ni queda duplicada. Revisar los enlaces y los criterios de la spec,
incluidas las cinco reglas añadidas y la conservación íntegra de Socket
cuando se autorice su integración. Comprobar que los cambios de esta tarea
son únicamente documentales, sin modificar código, SQL ni dependencias.

Tras aprobar el plan se actualizarán las tareas; su ejecución espera
aprobación. Sin merge, commit ni push en esta fase.
