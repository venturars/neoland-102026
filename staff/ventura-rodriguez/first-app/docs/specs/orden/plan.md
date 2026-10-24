# Plan — orden del desarrollo

No es una funcionalidad nueva. No reemplaza ningún fichero de `logic/`. No guarda datos. No toca `db/`, `queries/` ni `clients/`.

## Ficheros

Se crean:

- `docs/specs/orden/spec.md`
- `docs/specs/orden/plan.md`
- `docs/specs/orden/tasks.md`

Se toca:

- `AGENTS.md`

En «Orden»: un cambio del proyecto es un desarrollo. Lo es una funcionalidad, una dependencia, la configuración y la documentación. El primer proceso crea `docs/specs/<nombre>/`, con `<nombre>` en kebab-case. Escribe `spec.md` y `plan.md`. Si la constitución, el código actual y la spec dicen lo mismo, escribe también `tasks.md`. Si no dicen lo mismo, la pregunta queda al final del plan y no hay `tasks.md`. En ese proceso no se toca ningún otro fichero. Ahí se para. Una persona lee lo escrito. El proceso de implementación empieza cuando esa persona lo pide. Ejecuta `tasks.md` y no inventa pasos.

En «Reglas», las dos primeras repiten ese orden. La tercera dice: si no hay spec para ese cambio, se crea y se para.

## Firma

No hay función. No hay parámetros. No hay salida.

## SQL

No hay SQL.

## Errores

No hay fallo de la lista «Errores». Si la constitución, el código actual y la spec no dicen lo mismo, no hay `tasks.md`.

## Hecho

El texto ya está en `AGENTS.md`. Esta carpeta lo define. No se vuelve a editar `AGENTS.md`.
