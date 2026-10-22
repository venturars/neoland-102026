# Gestor pnpm

## Recorrido

No hay capa nueva, ni SQL, ni cambio en `logic/`. El pedido fija el gestor de paquetes.

Hoy `package.json` no declara gestor. No hay `pnpm-lock.yaml` ni `package-lock.json`. La constitución no tiene la sección de dependencias. En esta máquina Node es 24; pnpm se activa con corepack, que viene con Node, en la línea 10.

## Qué se escribe

En `package.json`, sin añadir dependencias:

- `packageManager` con la versión exacta que imprima `pnpm -v` después de activar pnpm 10. El valor tiene la forma `pnpm@10.x.x`.
- Un script `preinstall` que lee `npm_config_user_agent`. Si no empieza por `pnpm/`, escribe que hay que usar pnpm y termina con error. Así `npm install` se corta antes de instalar.

En la raíz de `first-app`, `pnpm install` genera `pnpm-lock.yaml`. Ese archivo se conserva. Si apareciera `package-lock.json`, se borra.

En `docs/CONSTITUTION.md`:

- vuelve la sección «Gestión de dependencias», con la regla de pnpm de `spec.md`;
- el árbol incluye `pnpm-lock.yaml` al lado de `package.json`.

La sección dice que no se usan `npm` ni `npx`, que los comandos son `pnpm install`, `pnpm add`, `pnpm run`, `pnpm exec` y `pnpm dlx`, y que el lockfile que se conserva es `pnpm-lock.yaml`.

## Comprobación

- `pnpm -v` muestra una versión 10.
- `pnpm install` termina sin error y deja `pnpm-lock.yaml`.
- No aparece `package-lock.json`.
- `npm install` termina con error por el script `preinstall`.
- La constitución coincide con `package.json` y con `pnpm-lock.yaml`.
