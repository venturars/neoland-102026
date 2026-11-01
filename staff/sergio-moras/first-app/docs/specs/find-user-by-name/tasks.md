# Tasks: Buscar usuarios por nombre

Implementan [plan.md](plan.md), que cumple [spec.md](spec.md). Se ejecutan **en orden** y todas seguidas.

## T1. Consulta
- [ ] Añadir `selectUsersByName` a `src/queries/users.js`.

## T2. Lógica
- [ ] Crear `src/logic/find-user-by-name.js` con los pasos del plan.

## T3. Clientes
- [ ] Crear `src/clients/terminal/find-user-by-name.txt`.
- [ ] Crear `src/clients/jupyter/find-user-by-name.ipynb`.

## T4. Comprobación
- [ ] Los casos del plan con dos usuarios temporales `tmp-718-*`, en la terminal.
- [ ] El notebook con un nombre que existe y con uno que no. Se guarda con el resultado de `Ana`.
- [ ] `list-users.txt` sigue dando los mismos usuarios y no queda ningún `tmp-718-*`.
- [ ] `pnpm format` sin cambios y `pnpm lint` sin errores.

## T5. Guías
- [ ] `ARCHITECTURE.md`, `TREE.md`, `ERRORS.md` y `AGENTS.md` como dice el plan.
