# Tasks: Alinear el código con las guías

Implementan [plan.md](plan.md), que cumple [spec.md](spec.md). Se ejecutan **en orden** y todas seguidas.

## T1. Foto inicial
- [ ] Guardar la salida de los `.txt` de hoy con un usuario temporal `tmp-710-<n>@example.com`, y la de `classifyGender` con Ollama apagado.

## T2. `.gitattributes`
- [ ] Crear `.gitattributes` y renormalizar los `.js`.

## T3. Renombrados
- [ ] `git mv` de los 18 ficheros.
- [ ] Cambiar los `import` de los `.txt` y de los notebooks, y el texto «Qué comando usa» de los notebooks.

## T4. `logic/`
- [ ] Reescribir `create-user.js`, `find-user-by-email.js`, `update-user.js`, `delete-user.js` y `list-users.js` con una acción por línea y la salida en camelCase.
- [ ] Reescribir `classify-gender.js` con una acción por línea.
- [ ] Revisar `queries/users.js` y `db/connection.js`.

## T5. Clientes
- [ ] Notebooks: `createdAt` y `updatedAt` en la tabla y en los encabezados.
- [ ] Ejemplos de `update-user` y `delete-user` con el id actual de Pedro.

## T6. Comprobación
- [ ] Foto después y comparación con la de T1, con las diferencias del plan.
- [ ] `classifyGender` con Ollama apagado da el mismo error. Ollama se vuelve a encender.
- [ ] Ejecutar los 6 notebooks en el orden del plan y guardar su resultado.
- [ ] `pnpm format` dos veces, sin cambios la segunda y sin `.js` marcados en `git status`. `pnpm lint` sin errores.
- [ ] No queda ningún usuario temporal.

## T7. Guías
- [ ] `STYLE.md`, `DATABASE.md`, `ARCHITECTURE.md`, `TREE.md` y `AGENTS.md` como dice el plan.
