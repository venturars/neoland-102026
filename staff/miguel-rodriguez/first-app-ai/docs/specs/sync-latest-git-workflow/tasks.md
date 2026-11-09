# Tareas — actualización del flujo Git

[Spec](spec.md) · [Plan](plan.md) · Issue #1170
Autorización conjunta de Miguel, 2026-11-09.

- [x] T01 Incorporar caché y skill; verificar TTL/contexto/ETag/paginación (CA-01).
- [x] T02 Integrar knowledge y mensajes de commit (CA-02, CA-05).
- [x] T03 Actualizar create-pr y revisión sin alterar bases o commits (CA-03).
- [x] T04 Crear PR con staging/draft/assignee (CA-04).
- [x] T05 Actualizar documentación y referencias (CA-05).
- [x] T06 Ejecutar pruebas desechables y registrar resultados (CA-01–05).

## Evidencia

- node --test tests/git-workflow.test.mjs: 6 pruebas pasadas, sin omisiones.
- bash -n sobre los scripts: correcto.
- pnpm format y pnpm lint: correctos en copia desechable con lockfile congelado.
- El nuevo módulo de caché y sus tests se formatearon con el Prettier existente.
- Los ensayos Git usaron repositorio y remoto bare temporales, con gh simulado.
  No se atribuye a estos ensayos un alta de PR real ni una comprobación de permisos.
- Revisión documental: create-pr conserva cuerpo/enlace al pedir revisión, solo
  cambia casillas verificadas, comprueba acceso vivo y no modifica base/commits.
- Se añadieron causas a dos errores del template para cumplir ESLint.
- Los archivos fuente funcionales, package.json y el lockfile no cambian.

La PR se publica independientemente de Node/Jupyter; antes de pedir revisión se
comprobará que su combinación no introduce conflictos.
