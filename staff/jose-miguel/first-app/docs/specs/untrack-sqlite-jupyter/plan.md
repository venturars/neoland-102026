# Plan · Base local fuera de git y arranque Jupyter

> Estado: **Aprobado** (2026-11-02) · Spec: [spec.md](spec.md) v1.0 · Issue: #744

## 1. Visión

Chore de configuración y documentación. Sin paquetes npm nuevos ni Validación Socket.

## 2. Ficheros

| Acción | Fichero |
| --- | --- |
| Crear | `docs/specs/untrack-sqlite-jupyter/spec.md`, `plan.md`, `tasks.md` |
| Tocar | [`.gitignore`](../../../../.gitignore) — entrada `src/db/users.sqlite` |
| Tocar | `docs/DATABASE.md`, `docs/ARCHITECTURE.md`, `docs/TREE.md`, `AGENTS.md` |
| Condicional | `git rm --cached` si `users.sqlite` estuviera indexado (comprobación T01) |

No se toca `scripts/jupyter.sh` ni `package.json` salvo que la revisión T04 detecte incoherencia (hoy: `jupyter` → `sh scripts/jupyter.sh`, destino `src/clients/jupyter`).

## 3. Comprobación de la constitución

- No hay ficheros nuevos en `logic/`.
- Clients y queries sin cambios.

## 4. Criterios

| CA | Verificación |
| --- | --- |
| CA-01 | `git ls-files staff/jose-miguel/first-app/src/db/users.sqlite` vacío |
| CA-02 | `git check-ignore -v src/db/users.sqlite` desde first-app |
| CA-03 | `pnpm jupyter` (smoke manual) |
| CA-04 | Lectura de guías actualizadas |
| CA-05 | Ejecutar p. ej. `create-users-table.txt` |

## 5. Nota monorepo

El [`.gitignore`](../../../../../../.gitignore) raíz ya ignora `*.sqlite`. La entrada en first-app hace explícita la ruta para quien trabaja solo en esta carpeta.
