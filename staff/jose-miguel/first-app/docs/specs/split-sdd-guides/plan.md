# Plan · Guías SDD en ficheros separados

> Estado: **Aprobado** (2026-10-27) · Spec: [spec.md](spec.md) v1.1 · Issue: #504

## 1. Visión

Solo documentación. No se toca JavaScript ni SQL. El código que junta varias acciones en una línea no se reescribe; un spec nuevo no se para por eso.

## 2. Ficheros

| Acción | Fichero |
| --- | --- |
| Crear | `docs/TREE.md` |
| Crear | `docs/ARCHITECTURE.md` |
| Crear | `docs/DATABASE.md` |
| Crear | `docs/ERRORS.md` |
| Crear | `docs/STYLE.md` |
| Tocar | `docs/CONSTITUTIONS.md` |
| Tocar | `AGENTS.md` |
| Mover | specs actuales de la raíz → `docs/specs/` (incl. esta) |

No se toca el `AGENTS.md` de la raíz, ni `package.json`, ni el código. Las specs ya escritas se mueven a `docs/specs/` sin reescribir su contenido (salvo rutas internas si hace falta).

## 3. TREE.md

Solo el árbol de esta first-app (sin ficheros de otras apps):

```
first-app/
  .gitignore
  package.json
  scripts/
    jupyter.sh
  db/
    connection.js
    users.sqlite
  queries/
    users.js
    queries/
      create-users-table.sql
      find-all.sql
      find-by-email.sql
      find-by-id.sql
      insert.sql
      remove.sql
      update.sql
  logic/
    create-user.js
    update-user.js
    delete-user.js
    list-users.js
    find-user-by-email.js
    users-gender-count.js
  clients/
    terminal/
    jupyter/
  docs/
    ARCHITECTURE.md
    TREE.md
    DATABASE.md
    ERRORS.md
    STYLE.md
    CONSTITUTIONS.md
    specs/
      <nombre>/
        spec.md
        plan.md
        tasks.md
```

## 4. ARCHITECTURE.md

Bullets de responsabilidad con el código real de Jose Miguel:

- `db/`, `db/connection.js`, `db/users.sqlite`
- `queries/queries/`, `queries/users.js` (sin reglas de negocio)
- `logic/` y cada uno de los seis ficheros actuales
- `clients/terminal/`, `clients/jupyter/` (notebook por `.txt`, `pnpm jupyter`)
- las cinco guías + `CONSTITUTIONS.md`
- `docs/specs/<nombre>/` es un desarrollo (kebab-case)
- `scripts/jupyter.sh` arranca Notebook local

## 5. DATABASE.md

Se lleva tal cual las secciones actuales «Base de datos» y «Queries» de CONSTITUTIONS (motor `node:sqlite`, `CREATE TABLE` con `created_at`/`updated_at`, parámetros `:id`/`:name`/`:email`).

## 6. ERRORS.md

Se lleva tal cual «Manejo de errores» actual (mensajes `Name is required`, `Could not count the users by gender`, etc.; try/catch solo en paso 3; sin clases de error).

## 7. STYLE.md

Convenciones actuales de AGENTS + constantes de CONSTITUTIONS + regla declarativa:

- una función por fichero; sin clases, sin `this`, sin métodos
- usuario: `id`, `name`, `email`, `createdAt`, `updatedAt`
- una acción por línea (`input.name` y `.trim()` en líneas distintas)
- fallo con `if` y `throw new Error` en su línea
- junior a mano; Prettier estándar; constantes en `MAYUSCULAS_CON_`

Enlaces a `CONSTITUTIONS.md` (contrato logic) y `ERRORS.md`.

## 8. CONSTITUTIONS.md

Queda con:

1. Intro (clients cambian; logic no se reemplaza)
2. **Guías** (enlaces a los cinco ficheros)
3. Logic no se reemplaza + un fichero de logic (firmas Jose Miguel, cuatro pasos, reglas de datos) + frase: la forma de cada línea está en `docs/STYLE.md`
4. SDD / Specs (`docs/specs/<nombre>/`)
5. Paquetes (Socket → AGENTS)

Se quitan: Árbol, Base de datos, Manejo de errores, Queries, Constantes (y el detalle de capas que pasa a ARCHITECTURE).

## 9. AGENTS.md

- Proyecto: CONSTITUTIONS enlaza a arquitectura, árbol, base de datos, errores y estilo.
- Estilo: remisión corta a `docs/STYLE.md` (sin pegar el texto largo).
- Reglas: leer `docs/specs/<nombre>/`; forma de línea desde STYLE; código viejo como referencia de fichero; spec nuevo no se para por forma vieja; si se añade o quita un fichero, actualizar `TREE.md` y `ARCHITECTURE.md`.
- Conservar: Comandos (incl. jupyter), Paquetes Socket, Al terminar.

## 10. Comprobación

| CA | Cómo |
| --- | --- |
| CA-01 | Existen los cinco ficheros, cada uno con un solo tema |
| CA-02 | TREE/ARCHITECTURE listan los cinco docs y solo ficheros reales |
| CA-03–CA-04 | CONSTITUTIONS y AGENTS enlazan; texto movido no duplicado |
| CA-04b | Specs están en `docs/specs/`; la raíz `specs/` desaparece |
| CA-05 | Grep: árbol/SQL/errores/constantes no viven ya en CONSTITUTIONS/AGENTS como antes |
| CA-06 | Diff sin cambios en `.js` / `.sql` |
