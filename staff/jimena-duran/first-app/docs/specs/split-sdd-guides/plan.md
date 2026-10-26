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

## Verificación

Contrastar cada regla original con su destino para confirmar que no falta
ninguna ni queda duplicada. Revisar los enlaces y los criterios de la spec.