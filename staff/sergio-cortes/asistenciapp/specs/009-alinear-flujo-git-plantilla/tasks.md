# Tareas 009 · Alinear el flujo de git con la plantilla

> Estado: **Pendiente de aprobación** (2026-11-05) · Plan: [plan.md](plan.md) · Creado: 2026-11-05 · Aprobada: pendiente

Issue: #1145.

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- La copia ya se subió en el commit `0d018e3d`, antes del spec. Las tareas **verifican** esa copia y cierran lo que falta. No vuelven a copiar nada.

---

## Fase A · Verificar la copia

- [ ] **T01** · Comparar los agentes, skills, plantillas y herramientas con la plantilla.
  - Ejecutar `diff -r` entre `exercises/git-workflow-agent-template/{agents,skills,templates,tools}` y las mismas carpetas de la app.
  - *Cubre:* CA-01.
  - *Hecha cuando:* solo difieren ocho skills, cada una en una línea de comando, y ningún otro fichero difiere.

- [ ] **T02** · Comprobar que las rutas propias están en las ocho skills.
  - `grep` de `` `./tools/ `` y de `exercises/git-workflow-agent-template` en `staff/sergio-cortes/asistenciapp/skills/` no devuelve nada.
  - *Cubre:* CA-02.
  - *Hecha cuando:* las ocho líneas de comando apuntan a `staff/sergio-cortes/asistenciapp/tools/`.

- [ ] **T03** · Comprobar que la plantilla no se ha editado.
  - `git diff --quiet origin/staging...HEAD -- exercises/` debe salir con código 0.
  - *Cubre:* CA-03.
  - *Hecha cuando:* el comando sale con código 0.

## Fase B · Herramientas

- [ ] **T04** · Comprobar que las ocho herramientas son ejecutables en Git.
  - `git ls-files -s staff/sergio-cortes/asistenciapp/tools/` muestra `100755` en todas.
  - *Cubre:* CA-04.
  - *Hecha cuando:* las ocho líneas muestran `100755`.

- [ ] **T05** · Comprobar que la herramienta de abrir pull requests responde bien sin argumentos.
  - Ejecutar `./staff/sergio-cortes/asistenciapp/tools/create-pr-base-staging.sh` sin argumentos.
  - *Cubre:* CA-05.
  - *Hecha cuando:* muestra el mensaje de uso, sale con código 1 y no aparece `Permission denied`.

## Fase C · Manual y alcance

- [ ] **T06** · Comprobar que el §2 de `AGENTS.md` es coherente con `agents/git-workflow-agent.md` copiado.
  - Leer ambos y listar cualquier contradicción.
  - *Cubre:* plan §2.5 (AGENTS.md).
  - *Hecha cuando:* no hay contradicciones. Si las hay, la tarea se para y se propone el cambio para aprobación, sin editar.

- [ ] **T07** · Comprobar que el cambio solo toca ficheros de flujo dentro de la carpeta.
  - `git diff --name-only origin/staging...HEAD` no lista `app.py`, `asistencia/`, `static/`, `tests/`, `requirements.txt` ni `README.md`, ni nada fuera de `staff/sergio-cortes/asistenciapp/`.
  - *Cubre:* CA-07.
  - *Hecha cuando:* la lista contiene solo agentes, skills, plantillas, `tools/`, `AGENTS.md` y `specs/009-…`.

## Fase D · Pruebas y cierre

- [ ] **T08** · Ejecutar `pytest` en la carpeta de la app.
  - Desde `staff/sergio-cortes/asistenciapp/`, con el entorno virtual.
  - *Cubre:* CA-08.
  - *Hecha cuando:* pasan los 96 tests.

- [ ] **T09** · Cerrar la spec y la fila de estado.
  - Subir la versión del spec a 1.1 con «Implementada» en el historial, y poner la fila de `AGENTS.md` §7 como implementada con su fecha.
  - Solo se hace si T01 a T05, T07 y T08 están en `[x]`.
  - *Cubre:* cierre del spec según la decisión de la versión 0.2 (no espera a CA-06).
  - *Hecha cuando:* el spec y `AGENTS.md` reflejan el cierre.

## Fase E · Pendiente de fusión

- [ ] **T10** · Verificar CA-06 al fusionar #1143.
  - Tras la fusión, `git ls-files -s` de `exercises/git-workflow-agent-template/tools/create-pr-base-staging.sh` en `staging` debe mostrar `100755`, igual que la copia.
  - *Cubre:* CA-06.
  - *Hecha cuando:* `staging` muestra `100755` para ese fichero. No bloquea el cierre de T09.

---

## Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-11-05 | Borrador inicial | Plan 009 aprobado. Tareas de verificación y cierre |
