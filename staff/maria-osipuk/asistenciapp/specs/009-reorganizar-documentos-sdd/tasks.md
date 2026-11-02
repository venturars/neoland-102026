# Tareas 009 · Reorganizar los documentos SDD

> Estado: **Implementadas y comprobadas** (2026-11-02): T01–T10, 114 tests · Tareas aprobadas: 2026-11-02 · Spec y plan aprobados: 2026-11-02 · Issue: #754 · Pull request: #755

Cada tarea indica los criterios de aceptación que cubre. Los tests van antes que los documentos.

## Tests primero

- [x] **T01** · Añadir `test_constitution_keeps_concrete_rules` a `tests/test_docs.py`: P5 contiene «400 px» y `<label>`, §6 contiene «dos veces en la misma sesión» y §7 contiene «fuera de esta carpeta». Ejecutarlo y ver que falla con la constitución redactada en local. Cubre **CA-09**.
- [x] **T02** · Añadir `test_workflow_requires_spec_before_editing` a `tests/test_docs.py`: el orquestador tiene el paso de specs y no contiene «sin parar el avance». Ejecutarlo y ver que falla. Cubre **CA-06** y **CA-07**.

## Constitución e historial

- [x] **T03** · En `docs/CONSTITUTION.md`, recuperar en P5 el ancho de unos 400 px, el HTML semántico, el contraste, `<label>` y el teclado. T01 pasa la parte de P5. Cubre **CA-09**.
- [x] **T04** · En §6, recuperar «un mismo alumno no puede registrarse dos veces en la misma sesión» y conservar que el control por nombre no acredita la identidad. En §7, recuperar «no se tocan archivos fuera de esta carpeta». T01 pasa. Cubre **CA-09**.
- [x] **T05** · En `docs/CONSTITUTION-HISTORY.md`, completar el motivo de la fila 3.1: aclara y reorganiza sin eliminar ni contradecir principios, y conserva los criterios concretos. Cubre **CA-02** y **CA-10**.

## Proceso

- [x] **T06** · En `AGENTS.md`, apartado 2, escribir que el orden issue → rama → PR en borrador → spec local vale para cualquier cambio de un archivo de la app, incluida la documentación. Cubre **CA-06**.
- [x] **T07** · En `agents/git-workflow-agent.md`, cambiar el objetivo para que no se salte las paradas SDD y añadir el paso 7 de specs a «Empezar». T02 pasa. Cubre **CA-07**.
- [x] **T08** · Revisar `agents/create-pr.md`: una PR existente se reutiliza y conserva su estado y su enlace. Cubre **CA-08**.

## Revisión y cierre

- [x] **T09** · Comprobar que cada regla de la versión 3.0 tiene un único destino (constitución, historial, `AGENTS.md`, `STYLE.md` o `ARCHITECTURE.md`) y que los enlaces relativos apuntan a archivos existentes. Cubre **CA-01** a **CA-05**.
- [x] **T10** · Ejecutar `pytest` desde la raíz de la app y ver que pasa. Comprobar con `git status` que solo cambian documentación, tests y esta spec. Cubre **CA-11**.
