# Plan — capas dentro de src

Issue: #603.

No es funcionalidad nueva. Sin firma, SQL ni paquete nuevos. Las cuatro
capas se mueven juntas bajo `src/` y siguen hermanas. El código de cada
función no cambia.

## Ficheros

Se crea `src/`. Se mueven `clients/`, `db/`, `queries/` y `logic/` (con
lo que ya tienen). `db/users.sqlite` va con `db/` y sigue fuera de git.

Se tocan: los cinco `.txt` de `src/clients/terminal/`, `start-jupyter.js`,
`package.json`, `docs/TREE.md`, `docs/ARCHITECTURE.md`.

No se tocan los `.js` de `logic/`, `queries/` ni `db/`, ni los `.sql`, ni
los notebooks, ni `eslint.config.js`, ni las specs ya escritas.

## Imports que se quedan

`logic/` sigue importando `../queries/users.js`. `queries/users.js`
sigue importando `../db/connection.js`. `db/connection.js` sigue
abriendo `users.sqlite` a su lado.

## Terminal y Jupyter

El comentario de los `.txt` sigue diciendo `mi-primer-proyecto`. Solo
cambia el import a `./src/logic/…`.

Los notebooks buscan hacia arriba la carpeta que contiene `logic/`; esa
carpeta pasa a ser `src/`. No se editan. `start-jupyter.js` arranca el
notebook en `src/clients/jupyter`.

## Formato

En `package.json`, `format` apunta a `src/db`, `src/queries` y
`src/logic`. `lint` no cambia.

## Árbol y arquitectura

`TREE.md` muestra las cuatro capas dentro de `src/`. En
`ARCHITECTURE.md`, esas rutas llevan el prefijo `src/`. El resto no
cambia. `DATABASE.md` y `AGENTS.md` se quedan: no nombran `src/`.

## Firma / SQL / Errores

No hay. No hay mensaje nuevo de «Errores».

## Decisión

Sin pregunta abierta. Las tareas se escriben tras revisar este plan.
