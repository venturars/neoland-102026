# Plan: Capas dentro de `src/`

Implementa [spec.md](spec.md). Cambia [CONSTITUTIONS.md](../../CONSTITUTIONS.md) con el permiso explícito del usuario, que lo ha pedido en la issue.

## Árbol después
```
first-app/
  src/
    clients/terminal/   clients/jupyter/
    logic/
    queries/
    db/                 connection.js y users.sqlite
  docs/  agents/  skills/  tools/  templates/  MCPS/
  AGENTS.md  package.json  pnpm-lock.yaml  eslint.config.js  .gitignore  .gitattributes
```

## Ficheros de git
Con `git mv`, para conservar el historial: `clients/`, `logic/`, `queries/` y `db/connection.js` pasan a `src/`.

## La base de datos
`users.sqlite` no está en git. Como hacen maria-osipuk y jimena-duran:
1. Copia de seguridad de `db/users.sqlite` en el scratchpad, fuera del repositorio, y su huella SHA-256.
2. `mv` a mano de `db/users.sqlite` a `src/db/users.sqlite`, y de `users.sqlite-journal`, `-wal` y `-shm` si existen.
3. Antes de ejecutar nada, la huella de `src/db/users.sqlite` coincide con la de la copia.
4. `db/` queda vacía y se borra.

`db/connection.js` busca `users.sqlite` en su misma carpeta con `import.meta.url`, así que no cambia.

## Rutas que cambian
| Fichero | Cambio |
|---|---|
| `src/clients/terminal/*.txt` | `./logic/...` pasa a `./src/logic/...`. Se siguen pegando desde `first-app/` |
| `src/clients/jupyter/*.ipynb` | El bloque sube hasta la carpeta que contiene `logic/`, que ahora es `src/`, y lanza Node desde ahí: el código no cambia. Node encuentra `cli-table3` subiendo hasta `first-app/node_modules/`. Cambian el comentario («la carpeta que contiene `logic/`, `src/`») y el texto «Qué comando usa» (`src/clients/terminal/...`) |
| `package.json` | `format` pasa a `"src/logic/**/*.js" "src/queries/**/*.js" "src/db/**/*.js" eslint.config.js` |
| `.gitignore` | Las 4 rutas `/db/users.sqlite*` pasan a `/src/db/users.sqlite*` |
| `docs/ARCHITECTURE.md`, `docs/TREE.md`, `docs/DATABASE.md`, `docs/STYLE.md`, `AGENTS.md` | Rutas con `src/` |
| `docs/CONSTITUTIONS.md` | El principio 4 nombra `src/db/users.sqlite`. Versión 2.1.0 |

`eslint.config.js` revisa todos los `.js` y no cambia.

## Cómo se prueba
- Foto antes y después de los 22 casos de la terminal y de `classifyGender` con Ollama apagado. Tiene que ser idéntica, salvo fechas e ids del usuario temporal.
- Los 6 notebooks en el orden de #710, con su resultado guardado. `list-users` muestra a Ana y a Pedro.
- `pnpm format` sin cambios y `pnpm lint` sin errores.
- `git status` no enseña `users.sqlite`.
- No queda ningún usuario temporal.
