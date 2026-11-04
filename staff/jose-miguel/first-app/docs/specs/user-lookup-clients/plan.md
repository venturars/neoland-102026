# Plan · Consultas de usuario y clientes manuales

> Estado: **Aprobado** (2026-11-02) · Spec: [spec.md](spec.md) v1.0 · Issue: #742

## 1. Visión

Tres funcionalidades nuevas en `src/logic/` (buscar por nombre, buscar por identificador, crear tabla), una query SQL nueva, clientes en `src/clients/terminal/` y `src/clients/jupyter/`, y actualización de guías. Sin paquetes npm nuevos.

## 2. Ficheros

| Acción | Fichero |
| --- | --- |
| Crear | `docs/specs/user-lookup-clients/spec.md`, `plan.md`, `tasks.md` |
| Crear | `src/queries/queries/find-by-name.sql` |
| Tocar | `src/queries/users.js` (`findUsersByName`) |
| Crear | `src/logic/find-user-by-name.js` |
| Crear | `src/logic/find-user-by-id.js` |
| Crear | `src/logic/create-users-table.js` |
| Crear | `src/clients/terminal/find-user-by-name.txt`, `find-user-by-id.txt`, `create-users-table.txt` |
| Crear | `src/clients/jupyter/find-user-by-name.ipynb`, `find-user-by-id.ipynb`, `create-users-table.ipynb` |
| Tocar | `docs/ARCHITECTURE.md`, `docs/TREE.md`, `docs/DATABASE.md`, `docs/ERRORS.md`, `docs/CONSTITUTIONS.md` |

## 3. Capas

- `find-by-name.sql`: `SELECT * FROM users WHERE name = :name ORDER BY id`.
- `users.js`: `findUsersByName(name)` con `.all()`.
- `find-user-by-name.js`: recorte; vacío → `Name is empty`; try/catch → `Could not find the user`; mapeo `created_at` / `updated_at` a camelCase.
- `find-user-by-id.js`: validación como `delete-user.js` para id ausente; try/catch → `Could not find the user`; sin fila → `User does not exist`.
- `create-users-table.js`: try/catch sobre `createUsersTable()` de queries → `Could not create the users table`.
- Clientes solo importan `src/logic/`. Tras crear tabla, el cliente llama `listUsers()` para comprobar que la base responde (CA-08).

## 4. Comprobación de la constitución

- P1–P2: un fichero por función en logic; clients no tocan SQL ni db.
- P3: sin dependencias nuevas.
- Paquetes: no aplica Validación Socket (sin cambios en `package.json`).

## 5. Comprobación de criterios

| CA | Cómo |
| --- | --- |
| CA-01–CA-04 | `find-user-by-name.txt` y cuaderno |
| CA-05–CA-07 | `find-user-by-id.txt` y cuaderno |
| CA-08–CA-09 | `create-users-table.txt` y cuaderno |
| CA-10 | Nombres de cuadernos = nombres de `.txt` |

## 6. Formato

Antes de cerrar: `pnpm format` y `pnpm lint` desde `staff/jose-miguel/first-app`.
