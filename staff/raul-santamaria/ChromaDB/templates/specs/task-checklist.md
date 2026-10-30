# TASK CHECKLIST: [Código de la Issue]

## FASE 1: PREPARACIÓN Y ENTORNO

- [ ] **TASK-01:** Crear rama del feature a partir de `staging`
- [ ] **TASK-02:** Comprobar entorno (venv, dependencias) según docs/COMMANDS.md

## FASE 2: IMPLEMENTACIÓN DE CÓDIGO

- [ ] **TASK-03:** Modificar/crear lógica definida en `plan.md`
- [ ] **TASK-04:** Implementar manejo de errores y casos borde de `spec.md`

## FASE 3: VERIFICACIÓN Y VALIDACIÓN

- [ ] **TASK-05:** Ejecutar comprobaciones de `spec.md` (tester si toca `src/core` o `src/sdk`)
- [ ] **TASK-06:** `python -m ruff check` y `python -m black --check` en ficheros tocados

## FASE 4: PREPARACIÓN DE PULL REQUEST

- [ ] **TASK-07:** Commit con mensaje estandarizado del flujo git
- [ ] **TASK-08:** Push; parar antes de pedir revisión (ver AGENTS.md)
