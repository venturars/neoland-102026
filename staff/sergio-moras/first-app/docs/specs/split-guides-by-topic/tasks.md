# Tasks: Guías por tema

Implementan [plan.md](plan.md), que cumple [spec.md](spec.md). Se ejecutan **en orden** y todas seguidas.

## T1. Las cinco guías
- [x] Escribir `docs/ARCHITECTURE.md`, `docs/TREE.md`, `docs/DATABASE.md`, `docs/ERRORS.md` y `docs/STYLE.md` con el contenido del plan.

## T2. Constitución
- [x] Añadir la sección «Guías».
- [x] Dejar cada principio con su regla, su motivo y el enlace del plan.
- [x] Subir la versión a 2.0.0.

## T3. `AGENTS.md`
- [x] Quitar «Stack», «Estructura» y «Estilo», y enlazar a las guías desde la introducción.
- [x] Ajustar «Comandos» y «Nunca» como dice el plan.

## T4. Comprobación
- [x] Cada regla de la tabla del plan aparece en un solo documento.
- [x] Los enlaces llevan a ficheros que existen.
- [x] Los mensajes de `ERRORS.md` coinciden con el código y `TREE.md` con `git ls-files`.
- [x] `pnpm format` y `pnpm lint` sin cambios ni errores.
