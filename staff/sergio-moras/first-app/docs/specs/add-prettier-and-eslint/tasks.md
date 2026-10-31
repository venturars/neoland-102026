# Tasks: Prettier y ESLint

Implementan [plan.md](plan.md), que cumple [spec.md](spec.md). Se ejecutan **en orden** y todas seguidas.

## T1. Foto inicial
- [x] Guardar la salida de los `.txt` de `clients/terminal/` con un usuario temporal `tmp-700-<n>@example.com`, como en #638.

## T2. Paquetes y comandos
- [x] Instalar con pnpm, en versión fija y como dependencias de desarrollo, `prettier@3.9.10`, `eslint@10.14.0` y `@eslint/js@10.0.1`.
- [x] Añadir los scripts `format` y `lint` a `package.json`.
- [x] Crear `eslint.config.js` con el contenido del plan.

## T3. Arreglos de ESLint
- [x] Lanzar `pnpm lint` y comprobar que da los 6 errores del plan.
- [x] Hacer en `logic/classifyGender.js` los 3 arreglos del plan.
- [x] Lanzar `pnpm lint` y comprobar que da 0 errores.

## T4. Formato
- [x] Lanzar `pnpm format`. Comprobar que cambia los 8 `.js` y que una segunda vez no cambia nada.
- [x] Lanzar `pnpm lint` y comprobar que sigue en 0 errores.

## T5. Comprobación de la app
- [x] Repetir la foto de T1 y comprobar que la salida es la misma.
- [x] `classifyGender` con Ollama apagado da el mismo error. Ollama se vuelve a encender.
- [x] No queda ningún usuario `tmp-700-*`.

## T6. Documentación
- [x] Añadir la línea del principio 7 y subir la versión a 1.5.0.
- [x] Cambiar «Stack», «Comandos» y «Cómo verificar un cambio» de `AGENTS.md`.
