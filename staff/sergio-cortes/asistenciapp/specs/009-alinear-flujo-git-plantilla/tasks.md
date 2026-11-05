# Tareas 009 · Alinear el flujo de git con la plantilla

> Estado: **Implementadas y verificadas** (2026-11-05) · Plan: [plan.md](plan.md) · Creado: 2026-11-05 · Aprobada: 2026-11-05

Issue: #1145.

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- La copia ya se subió en el commit `0d018e3d`, antes del spec. Las tareas **verifican** esa copia y cierran lo que falta. No vuelven a copiar nada.

---

## Fase A · Verificar la copia

- [x] **T01** · Comparar los agentes, skills, plantillas y herramientas con la plantilla.
  - Ejecutar `diff -r` entre `exercises/git-workflow-agent-template/{agents,skills,templates,tools}` y las mismas carpetas de la app.
  - *Cubre:* CA-01.
  - *Hecha cuando:* solo difieren ocho skills, cada una en una línea de comando, y ningún otro fichero difiere.
  - *Resultado (2026-11-05):* agentes, plantillas y herramientas idénticos. Difieren las ocho skills esperadas, con 16 líneas de diff (una por fichero y lado).

- [x] **T02** · Comprobar que las rutas propias están en las ocho skills.
  - `grep` de `` `./tools/ `` y de `exercises/git-workflow-agent-template` en `staff/sergio-cortes/asistenciapp/skills/` no devuelve nada.
  - *Cubre:* CA-02.
  - *Hecha cuando:* las ocho líneas de comando apuntan a `staff/sergio-cortes/asistenciapp/tools/`.
  - *Resultado (2026-11-05):* ninguna ruta de la plantilla queda. Las ocho skills apuntan a la ruta propia.

- [x] **T03** · Comprobar que la plantilla no se ha editado.
  - `git diff --quiet origin/staging...HEAD -- exercises/` debe salir con código 0.
  - *Cubre:* CA-03.
  - *Hecha cuando:* el comando sale con código 0.
  - *Resultado (2026-11-05):* código 0.

## Fase B · Herramientas

- [x] **T04** · Comprobar que las ocho herramientas son ejecutables en Git.
  - `git ls-files -s staff/sergio-cortes/asistenciapp/tools/` muestra `100755` en todas.
  - *Cubre:* CA-04.
  - *Hecha cuando:* las ocho líneas muestran `100755`.
  - *Resultado (2026-11-05):* las ocho muestran `100755`.

- [x] **T05** · Comprobar que la herramienta de abrir pull requests responde bien sin argumentos.
  - Ejecutar `./staff/sergio-cortes/asistenciapp/tools/create-pr-base-staging.sh` sin argumentos.
  - *Cubre:* CA-05.
  - *Hecha cuando:* muestra el mensaje de uso, sale con código 1 y no aparece `Permission denied`.
  - *Resultado (2026-11-05):* «Uso: create-pr-base-staging.sh RAMA TITULO CUERPO», código 1.

## Fase C · Manual y alcance

- [x] **T06** · Comprobar que el §2 de `AGENTS.md` es coherente con `agents/git-workflow-agent.md` copiado.
  - Leer ambos y listar cualquier contradicción.
  - *Cubre:* plan §2.5 (AGENTS.md).
  - *Hecha cuando:* no hay contradicciones. Si las hay, la tarea se para y se propone el cambio para aprobación, sin editar.
  - *Resultado (2026-11-05):* coherentes en el momento «empezar», en las dos reglas de commit y push, y en que issue, rama y PR no autorizan código. No hay contradicciones que tratar.

- [x] **T07** · Comprobar que el cambio solo toca ficheros de flujo dentro de la carpeta.
  - `git diff --name-only origin/staging...HEAD` no lista `app.py`, `asistencia/`, `static/`, `tests/`, `requirements.txt` ni `README.md`, ni nada fuera de `staff/sergio-cortes/asistenciapp/`.
  - *Cubre:* CA-07.
  - *Hecha cuando:* la lista contiene solo agentes, skills, plantillas, `tools/`, `AGENTS.md` y `specs/009-…`.
  - *Resultado (2026-11-05):* 16 ficheros, todos de esa lista. Ninguno de la app.

## Fase D · Pruebas y cierre

- [x] **T08** · Ejecutar `pytest` en la carpeta de la app.
  - Desde `staff/sergio-cortes/asistenciapp/`, con el entorno virtual.
  - *Cubre:* CA-08.
  - *Hecha cuando:* pasan los 96 tests.
  - *Resultado (2026-11-05):* 96 passed.

- [x] **T09** · Cerrar la spec y la fila de estado.
  - Subir la versión del spec a 1.1 con «Implementada» en el historial, y poner la fila de `AGENTS.md` §7 como implementada con su fecha.
  - Solo se hace si T01 a T05, T07 y T08 están en `[x]`.
  - *Cubre:* cierre del spec según la decisión de la versión 0.2 (no espera a CA-06).
  - *Hecha cuando:* el spec y `AGENTS.md` reflejan el cierre.
  - *Resultado (2026-11-05):* spec 1.1, plan y fila de `AGENTS.md` actualizados.

## Fase E · Pendiente de fusión

- [x] **T10** · Verificar CA-06 al fusionar #1143.
  - Tras la fusión, `git ls-files -s` de `exercises/git-workflow-agent-template/tools/create-pr-base-staging.sh` en `staging` debe mostrar `100755`, igual que la copia.
  - *Cubre:* CA-06.
  - *Hecha cuando:* `staging` muestra `100755` para ese fichero. No bloquea el cierre de T09.
  - *Resultado (2026-11-05):* #1143 fusionada (commit `b99ccb81`). `origin/staging` tiene `100755` con el mismo blob `8bea723` que la copia.

---

## Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-11-05 | Borrador inicial | Plan 009 aprobado. Tareas de verificación y cierre |
| 1.0 | 2026-11-05 | Aprobadas | Ok para verificar |
| 1.1 | 2026-11-05 | T01 a T09 hechas; T10 pendiente de #1143 | Verificación completa de CA-01 a CA-05, CA-07 y CA-08 |
| 1.2 | 2026-11-05 | T10 hecha | #1143 fusionada; `staging` tiene el script como `100755`. CA-06 verificado |
