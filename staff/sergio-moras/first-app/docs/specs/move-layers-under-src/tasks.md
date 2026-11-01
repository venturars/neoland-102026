# Tasks: Capas dentro de `src/`

Implementan [plan.md](plan.md), que cumple [spec.md](spec.md). Se ejecutan **en orden** y todas seguidas.

## T1. Foto inicial
- [x] Guardar la salida de los `.txt` con un usuario temporal `tmp-716-<n>@example.com`, y la de `classifyGender` con Ollama apagado.

## T2. Copia de la base
- [x] Copiar `db/users.sqlite` al scratchpad y anotar su huella SHA-256.

## T3. Mover
- [x] `git mv` de `clients/`, `logic/`, `queries/` y `db/connection.js` a `src/`.
- [x] `mv` de `users.sqlite` y sus auxiliares a `src/db/`. Borrar `db/` vacía.
- [x] Comprobar la huella antes de ejecutar nada.

## T4. Rutas
- [x] `.txt`, notebooks, `package.json` y `.gitignore` como dice el plan.

## T5. Comprobación
- [x] Foto después, idéntica a la de T1 salvo fechas e ids. `classifyGender` con Ollama apagado, igual. Ollama se vuelve a encender.
- [x] Los 6 notebooks en orden, con su resultado guardado.
- [x] `pnpm format` sin cambios, `pnpm lint` sin errores y `git status` sin `users.sqlite`.
- [x] No queda ningún usuario temporal.

## T6. Documentación
- [x] Guías y `AGENTS.md` con las rutas nuevas.
- [x] Principio 4 de la constitución con `src/db/users.sqlite` y versión 2.1.0.
