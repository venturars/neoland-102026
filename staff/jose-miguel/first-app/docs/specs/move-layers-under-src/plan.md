# Plan — capas dentro de src

Issue: #579.

No es una funcionalidad nueva. No se reemplaza ningún fichero de
`logic/`. No hay firma nueva ni SQL nuevo. No hay paquete nuevo. Los
mensajes de «Errores» siguen siendo los de ahora.

Las cuatro carpetas se mueven juntas bajo `src/`. Siguen siendo
hermanas. El código de cada función no cambia.

## Ficheros

Se crea la carpeta `src/`.

Se mueven, con lo que ya contienen:

- `clients/` a `src/clients/`
- `db/` a `src/db/`
- `queries/` a `src/queries/`
- `logic/` a `src/logic/`

`db/users.sqlite` se mueve con `db/` y sigue sin estar en git.

Se tocan:

- Los seis `.txt` de `src/clients/terminal/`
- `scripts/jupyter.sh`
- `package.json`
- `docs/TREE.md`
- `docs/ARCHITECTURE.md`

No se tocan los `.js` de `logic/`, `queries/` ni `db/`. No se tocan los
`.sql`. No se tocan los notebooks. No se tocan `eslint.config.js`, las
specs ya escritas ni el `.gitignore`.

## Imports que se quedan

`logic/` sigue importando `../queries/users.js`. `queries/users.js`
sigue importando `../db/connection.js`. `db/connection.js` sigue
abriendo `users.sqlite` al lado de ese fichero.

## Terminal

El comentario sigue diciendo que el directorio actual es first-app. Solo
cambia la ruta del import.

Los seis `.txt` importan desde `./src/logic/` con el mismo nombre de
fichero que ya tienen.

## Jupyter

Cada notebook busca hacia arriba la carpeta que contiene `logic/` y
lanza Node ahí. Esa carpeta pasa a ser `src/`. Los imports `./logic/`,
`./queries/` y `./db/` del bloque siguen valiendo. No se editan.

`scripts/jupyter.sh` arranca el notebook en `src/clients/jupyter`. El
resto del script no cambia.

## Formato

En `package.json`, `format` queda así. `lint` no cambia.

```json
"format": "prettier --write \"src/db/**/*.js\" \"src/queries/**/*.js\" \"src/logic/**/*.js\""
```

## Árbol y arquitectura

Como en `docs/TREE.md` y `docs/ARCHITECTURE.md` de este desarrollo.

## Decisión

`docs/DATABASE.md` y `AGENTS.md` se quedan como están. No nombran
`src/`. El árbol y la arquitectura sí.
