# Plan — guías separadas por tema

## Dónde va cada cosa

Se mueven las reglas de `AGENTS.md` y `docs/CONSTITUTIONS.md` sin cambiar lo que dicen.

| Guía en `docs/` | Qué guarda |
| --- | --- |
| `ARCHITECTURE.md` | Una línea por fichero: qué hace cada capa, cada acción y cada guía. |
| `TREE.md` | El dibujo corto. Carpetas y ficheros principales, sin explicar qué hace cada uno. |
| `DATABASE.md` | Una base, una conexión, `USERS_DB_PATH`, la tabla, la persona, el email y el SQL. |
| `ERRORS.md` | Las frases de error que la app ya usa, en inglés. |
| `STYLE.md` | Idioma, nombres, imports, lectura de arriba abajo y Prettier. |

La constitución se queda con qué es la app, las reglas de spec, plan y tasks, y los cuatro pasos. Enlaza las cinco guías y apunta los errores a `docs/ERRORS.md`. `AGENTS.md` se queda con el orden, git, los comandos, las reglas de trabajo y el cierre. Enlaza la constitución y `docs/STYLE.md`. El formato deja de repetirse en los comandos.

## Comprobar

Cada regla de origen tiene un solo destino. Los enlaces abren esa guía. El diff no sale de la documentación de esta app.
