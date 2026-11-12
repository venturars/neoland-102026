# Plan — guías separadas por tema

Issue: #443.

No es una funcionalidad nueva. No reemplaza ningún fichero de `logic/`.
No hay firma nueva ni SQL nuevo. El código no se reescribe.

## Ficheros

Se crean: `docs/ARCHITECTURE.md`, `docs/TREE.md`, `docs/DATABASE.md`,
`docs/ERRORS.md`, `docs/STYLE.md`.

Se tocan: `docs/CONSTITUTIONS.md` y `AGENTS.md` de mi-primer-proyecto.
No se toca el `AGENTS.md` de la raíz, el código, `package.json` ni las
specs ya escritas.

## Contenido

- `TREE.md`: árbol actual de la constitución, más las cinco guías nuevas
  y `start-jupyter.js`. Solo rutas. Sin frases de responsabilidad.
- `ARCHITECTURE.md`: qué hace cada capa y cada fichero del proyecto
  (db, queries, logic con las cinco funciones actuales, clients,
  docs, start-jupyter). Sin repetir el árbol.
- `DATABASE.md`: texto actual de «Base de datos» y «Queries».
- `ERRORS.md`: mensajes que ya lanza `logic/` (`Name is empty`,
  `Email is invalid`, `Email is already used`, `User id is not valid`,
  `No user exists with that id`, `Could not create the user`,
  `Could not update the user`, `Could not delete the user`,
  `Could not list the users`, `Could not classify the users`).
- `STYLE.md`: convenciones actuales más una acción por línea, sin
  clases/`this`/métodos, constantes en mayúsculas, Prettier estándar.
- `CONSTITUTIONS.md`: quitar Árbol, Base de datos, Constantes, Queries y
  el bloque de estilo junior que pasa a STYLE. Añadir «Guías». Dejar
  SDD, paquetes, funciones de logic, cliente y los cuatro pasos.
- `AGENTS.md`: la base enlaza a las guías; estilo apunta a `STYLE.md`;
  errores a `ERRORS.md`; si un desarrollo añade o quita un fichero,
  actualiza TREE y ARCHITECTURE.

## Contrato

No hay función de `logic/`, firma pública, SQL ni mensaje nuevo de
errores.
