# Plan — un solo gestor de paquetes

Cumple `docs/specs/orden/spec.md`.

Este desarrollo ya está aplicado. El plan deja escrito qué ficheros quedaron tocados.

## Ficheros

Se toca `package.json`: el campo `packageManager` queda en `pnpm@12.15.0`. La dependencia sigue siendo `openai` `7.39.0`.

No se edita `pnpm-lock.yaml`. Lo escribe pnpm. No se crean `package-lock.json` ni `yarn.lock`.

Se tocan, en el mismo cambio:

- `docs/CONSTITUTIONS.MD`: la introducción dice que `package.json` declara pnpm `12.15.0` y que pnpm escribe `pnpm-lock.yaml`.
- `AGENTS.MD`: el gestor es pnpm `12.15.0`, declarado en `packageManager`. Se instala y se añaden dependencias con pnpm desde `first-app`. No se usa npm ni yarn, y no se crean `package-lock.json` ni `yarn.lock`.

No se tocan `logic`, `queries`, `db` ni `clients`.

## Firma

No hay función nueva.

## SQL

No hay SQL.
