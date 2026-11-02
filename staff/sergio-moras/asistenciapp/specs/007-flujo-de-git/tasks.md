# Tasks 007 · Flujo de git del curso en cinco momentos

> Estado: **Terminado** (2026-11-02) · Plan: [plan.md](plan.md)

Una tarea cada vez, en orden. Al acabarla se marca `[x]`. Si un «Terminada cuando» no se puede cumplir tal cual, se para y se propone el cambio antes de seguir.

---

## Fase A · La copia

- [x] **T01 · Test.** Crear `tests/test_git_workflow.py` con las tres comprobaciones del plan §7.
  - Cubre: CA-01, CA-02, CA-03.
  - Terminada cuando: falla porque las carpetas aún no existen; el resto de la suite sigue en verde.

- [x] **T02 · Copiar y adaptar.** Copiar `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/` desde `exercises/git-workflow-agent-template/`, cambiar las 7 rutas del plan §2 y comprobar los permisos (plan §3).
  - Cubre: CA-01, CA-02, CA-03, CA-04.
  - Terminada cuando: la suite completa pasa, incluido `test_git_workflow.py`, y `exercises/` no tiene cambios.

## Fase B · Documentos

- [x] **T03 · `AGENTS.md`.** §1, §2 (tabla de los cinco momentos), §2.4 y §5, como dice el plan §4.
  - Cubre: CA-05 a CA-10.
  - Terminada cuando: §2 describe los cinco momentos con sus subagentes y skills, dice que el agente hace uno y para, y §5 limita commit y push a los momentos 2 y 5.

- [x] **T04 · Constitución 3.1.** §4 y el historial, como dice el plan §5. En la misma tarea, `tests/test_architecture.py` pasa a buscar `Versión 3.1`.
  - Cubre: CA-08, CA-11.
  - Terminada cuando: la cabecera dice 3.1, §4 ya no pide ok entre spec, plan y tasks, y la suite sigue en verde.

- [x] **T05 · `docs/ARCHITECTURE.md`.** Árbol y sección «Flujo de git» (plan §6).
  - Cubre: CA-12.
  - Terminada cuando: el árbol muestra las cinco carpetas y la sección nombra al orquestador.

## Fase C · Verificar

- [x] **T06 · Verificación manual.** Lo del plan §8.
  - Cubre: CA-03, CA-04.
  - Terminada cuando: `check-status.sh` responde desde la raíz del repositorio y el diff de la rama no toca nada fuera de esta carpeta.

- [x] **T07 · Cierre.** `pytest` completo y la 007 en la tabla de `AGENTS.md` §7.
  - Cubre: CA-13.
  - Terminada cuando: todo en verde y la tabla muestra la 007 como implementada.
