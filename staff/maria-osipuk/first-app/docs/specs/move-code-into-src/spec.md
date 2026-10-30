# Mover el código a src

Issue: #632.

## Qué se pide

Que `clients/`, `db/`, `queries/` y `logic/` salgan de la raíz de `first-app` y queden dentro de una carpeta `src/`: `src/clients/`, `src/db/`, `src/queries/` y `src/logic/`.

Después del movimiento, todas las rutas que apuntan a esas carpetas siguen funcionando: los imports, los clientes de terminal y de Jupyter, los scripts, el `.gitignore` y las guías.

## A quién obliga

A María y al agente que trabaja con ella en `first-app`.

## La regla

- En la raíz de `first-app` ya no hay `clients/`, `db/`, `queries/` ni `logic/`. Están dentro de `src/`.
- El contenido de cada carpeta no cambia. Solo cambia dónde está.
- Los nombres de las capas no cambian. Las guías siguen hablando de `logic/`, `queries/`, `db/` y `clients/` como capas. Lo que cambia es cada ruta escrita: pasa a empezar por `src/`.
- El recorrido de los datos no cambia: cliente, `logic/`, `queries/users.js`, `queries/queries/*.sql`, `db/connection.js`, `db/users.sqlite`.
- `scripts/`, `docs/`, `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/` se quedan en la raíz.
- La base sigue siendo la misma: `db/users.sqlite` pasa a ser `src/db/users.sqlite` y conserva todos sus datos.

## Ejemplo correcto

Se lanza el cliente `src/clients/terminal/list-users.txt` desde `first-app`. Importa `./src/logic/list-users.js`, esa función llama a `queries/users.js`, que abre `src/db/users.sqlite`, y el resultado se escribe en la terminal.

## Ejemplo que no se sigue

Queda una copia de `logic/` en la raíz. Un `.txt` sigue importando `./logic/...` y falla. `.gitignore` sigue ignorando `db/*.sqlite` y la base nueva se sube a git. La guía `docs/TREE.md` dibuja carpetas que ya no existen en la raíz.

## Cómo se comprueba

- `clients`, `db`, `queries` y `logic` no existen en la raíz de `first-app` y sí dentro de `src/`.
- Un cliente de `src/clients/terminal/` llama a su función de `src/logic/` y escribe el resultado. Se prueba con una copia temporal de la base, con `FIRST_APP_DATABASE_FILE`, y no con la base real.
- Un cuaderno de Jupyter sigue encontrando las funciones de `src/logic/`: `run_logic.py` resuelve la raíz y las rutas de los módulos.
- `./scripts/jupyter.sh` apunta a `src/clients/jupyter`.
- `git check-ignore src/db/users.sqlite` lo confirma como ignorado.
- `pnpm lint`, lanzado en `first-app`, termina sin errores. `pnpm format` también.
- Ninguna ruta de `AGENTS.md`, `docs/` y los scripts apunta a una carpeta que ya no existe en esa ruta.

## Queda fuera

Cambiar reglas de negocio, SQL, la estructura de la base, los paquetes y el comportamiento de cualquier función. Tampoco se tocan las specs ya escritas, que cuentan lo que pasó en su momento, ni `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/`.
