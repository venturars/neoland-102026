# Plan — Mover el código a src

Issue: #632.

## Recorrido

Este cambio no es una funcionalidad. No crea una capa, no cambia ninguna función y no toca el SQL. Mueve cuatro carpetas y corrige las rutas que las nombran.

Los imports entre capas son relativos (`../queries/users.js`, `../db/connection.js`, `./queries/*.sql`). Como las cuatro carpetas se mueven juntas y conservan su posición entre ellas, esos imports no cambian. La conexión abre `users.sqlite` junto a `connection.js`, así que tampoco cambia.

Lo que sí cambia son las rutas que parten de la raíz de `first-app`.

## Ficheros

Se mueven, con `git mv`, para conservar el historial:

- `clients/` a `src/clients/`.
- `db/` a `src/db/`. `users.sqlite` está ignorada por git: se mueve a mano con `mv` y no se sube.
- `queries/` a `src/queries/`.
- `logic/` a `src/logic/`.

Se tocan:

- Los ocho `.txt` de `src/clients/terminal/`: `./logic/` y `./queries/` pasan a `./src/logic/` y `./src/queries/`.
- `src/clients/jupyter/run_logic.py`: la raíz de la app sube un nivel más (`parents[3]`) y las rutas de los módulos empiezan por `src/`. Los comentarios y docstrings que citan `logic/` o `db/users.sqlite` se actualizan.
- `scripts/jupyter.sh`: `clients/jupyter` pasa a `src/clients/jupyter`.
- `.gitignore`: `db/*.sqlite*` pasa a `src/db/*.sqlite*` y `clients/jupyter/jupyter-client.log` pasa a `src/clients/jupyter/jupyter-client.log`.
- `src/db/connection.js`: los dos comentarios que citan `db/users.sqlite`.
- `docs/TREE.md`: el árbol dibuja `src/` con las cuatro carpetas dentro.
- `docs/ARCHITECTURE.md`: todas las rutas pasan a `src/...`.
- `docs/CONSTITUTION.md`, `docs/DATABASE.md`, `docs/ERRORS.md` y `AGENTS.md`: solo las rutas escritas.

No se tocan `eslint.config.js` ni `.prettierignore`: no nombran estas carpetas, y `eslint .` encuentra los ficheros dentro de `src/`.

## AGENTS.md

`AGENTS.md` tiene hoy unas 350 líneas. Cada sección tiene un destino:

| Sección de `AGENTS.md`                                               | Destino                                                                 |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Qué va primero, Fuente de verdad, Antes de editar, Forma de trabajar | Se queda en `AGENTS.md`, más corta.                                     |
| Validación de paquetes con Socket                                    | `docs/CONSTITUTION.md`, sección «Paquetes».                             |
| Nivel del código, Estilo, Comentarios educativos                     | `docs/STYLE.md`.                                                        |
| Tipos y formatos                                                     | `docs/DATABASE.md`, sección «Tipos y formatos».                         |
| Firma de las funciones, Actualizaciones parciales, Respuesta         | `docs/CONSTITUTION.md`, sección «Contrato de las funciones».            |
| Reglas de implementación, Seguridad                                  | `docs/CONSTITUTION.md`, sección «Reglas de implementación y seguridad». |
| Sincronización de la documentación                                   | `docs/CONSTITUTION.md`, sección «Sincronización de la documentación».   |
| Al terminar una tarea, Verificación                                  | Se queda en `AGENTS.md`.                                                |

Qué se resume y qué no:

- Se resume lo que se repite: los ejemplos largos de comentarios, de nombres válidos e inválidos, y las frases que repiten la regla con otras palabras.
- No se resume ninguna regla con efecto: cada validación, cada límite (64 caracteres del email, 50 puntos de Socket, 3 capas, 6 nombres) y cada parada se conserva.
- El código de ejemplo imprescindible se conserva: la validación de `id`, el objeto de respuesta y la firma de `updateUser`.

Cambios que acompañan al movimiento:

- `docs/CONSTITUTION.md` dice hoy que `plan.md` «no copia reglas que ya están en `AGENTS.md`». Pasa a decir que no copia reglas que ya están en las guías.
- `docs/CONSTITUTION.md` y `docs/DATABASE.md` dicen hoy que el procedimiento de Socket y las reglas de tipo están en `AGENTS.md`. Pasan a apuntar a su nueva sección.
- `docs/STYLE.md` y `docs/CONSTITUTION.md` dejan de duplicar lo que ya dicen: el estilo se une en `docs/STYLE.md` y el orden de una función de negocio se queda una sola vez.

## Orden

Primero el movimiento, luego los clientes y los scripts, luego las guías, y al final `pnpm format` y `pnpm lint`. Cada paso se comprueba antes del siguiente.

## Riesgos

- `users.sqlite` no está en git. Si se mueve con `git mv`, no se mueve. Se mueve a mano y se comprueba que el fichero llega a `src/db/` con su tamaño.
- Los cuadernos de Jupyter no nombran estas rutas, pero dependen de `run_logic.py`. Se prueba con un caso real.
- `jupyter-client.log` se escribe junto a `run_logic.py`, así que cambia de sitio con él. El `.gitignore` tiene que seguirlo.
