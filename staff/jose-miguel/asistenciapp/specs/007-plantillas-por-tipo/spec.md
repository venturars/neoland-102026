# Spec 007 · Plantillas por tipo y reglas sin duplicar

> Estado: **Implementada** (2026-11-01) · Creada: 2026-11-01

Issue: #714.

---

## 1. Problema

La spec 006 trajo el flujo de git y la carpeta `templates/`, pero no fijó en criterios ni en tests que cada tipo de cambio (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`) tenga su plantilla de issue y de pull request, ni que las reglas de título y de rama vivan solo ahí.

Si esas reglas se repiten en `agents/`, `skills/` o `tools/`, un cambio en la plantilla deja sitios desalineados. Si vuelven plantillas genéricas `basic_*`, el agente puede ignorar el tipo.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien trabaja en esta carpeta** | Saber qué plantilla usar y dónde está escrita la regla del título y de la rama. |
| **Agente** | Rellenar issue y pull request del tipo correcto sin copiar reglas en otro sitio. |

---

## 3. Historias de usuario

- **HU-01**: Como persona que trabaja en esta carpeta, quiero seis plantillas de issue y seis de pull request, para que el tipo del cambio marque la forma del cuerpo.
- **HU-02**: Como persona que trabaja en esta carpeta, quiero que la regla del título y de la rama esté solo en comentarios HTML de las plantillas, para un solo sitio de verdad.
- **HU-03**: Como persona que trabaja en esta carpeta, quiero tests que impidan `basic_*` y reglas duplicadas, para que no se rompa el flujo sin que `pytest` avise.
- **HU-04**: Como persona que trabaja en esta carpeta, quiero que el contenido de `templates/` coincida con el ejercicio del curso, para seguir la misma forma que el resto del bootcamp.

---

## 4. Criterios de aceptación

Formato: **Dado** · **Cuando** · **Entonces**.

- **CA-01**: **Dado** esta carpeta, **cuando** se listan `templates/issues/` y `templates/pull-request/`, **entonces** hay exactamente seis plantillas de issue (`{tipo}_issue.md`) y seis de pull request (`{tipo}-pull-request.md`) para `feat`, `fix`, `docs`, `refactor`, `test` y `chore`.
- **CA-02**: **Dado** cada plantilla, **cuando** se lee el comentario HTML inicial, **entonces** indica título en inglés (menos de 72 caracteres, verbo), el tipo y el patrón de rama `número-tipo-descripcion`. El cuerpo visible incluye las secciones acordadas por tipo (`Fuera de esto`, `Cómo se reproduce`, `Dónde queda escrito`, `Qué sigue igual`, etc.).
- **CA-03**: **Dado** esta carpeta, **cuando** se buscan `templates/issues/basic_issue.md` y `templates/pull-request/basic-pull-request.md`, **entonces** no existen.
- **CA-04**: **Dado** `agents/`, `skills/` y `tools/`, **cuando** se buscan «menos de 72», la lista literal de los seis tipos y `número-tipo-descripcion`, **entonces** no aparecen (sí pueden estar en `templates/`).
- **CA-05**: **Dado** `exercises/git-workflow-agent-template/templates/` en el repositorio, **cuando** se compara con `templates/` de esta app, **entonces** el contenido es idéntico archivo a archivo.
- **CA-06**: **Dado** `agents/create-issue.md` y las skills `create-issue`, `create-pr-base-staging` y `link-pr-to-issue`, **cuando** se leen, **entonces** hablan de plantilla por tipo o la más cercana y no nombran `basic-pull-request.md` ni `basic_issue.md`.
- **CA-07**: **Dado** el cierre de esta spec, **cuando** se ejecuta `pytest`, **entonces** pasa incluido `tests/test_git_workflow_templates.py`, y la tabla §7 de `AGENTS.md` incluye `007-plantillas-por-tipo`.

---

## 5. Fuera de alcance

- Editar `exercises/git-workflow-agent-template`.
- Cambiar la lógica de pasar lista en `asistencia/` o `app.py`.
- Fusionar la pull request a `staging`.

---

## 6. Preguntas abiertas

Ninguna.

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 1.0 | 2026-11-01 | Versión inicial aprobada | La issue #714 deja el alcance antes de los tests |
