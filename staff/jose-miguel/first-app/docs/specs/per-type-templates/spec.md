# Spec · Plantillas por tipo en el flujo git

Issue: #733

## Qué se pide

En `staff/jose-miguel/first-app`, usar una plantilla de issue y una de pull request por cada tipo (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`), con el mismo contenido que `exercises/git-workflow-agent-template/templates/`.

Las reglas de título (inglés, menos de 72 caracteres, verbo), tipo y nombre de rama (`número-tipo-descripcion`) viven solo en los comentarios HTML de cada plantilla. No se repiten en `agents/`, `skills/` ni `tools/`.

Se eliminan `templates/issues/basic_issue.md` y `templates/pull-request/basic-pull-request.md`. Los agentes y skills de issue, pull request y rama usan la plantilla del tipo o la más cercana.

## Criterios de aceptación

1. Existen seis plantillas en `templates/issues/` y seis en `templates/pull-request/`, con los nombres `{tipo}_issue.md` y `{tipo}-pull-request.md`.
2. Cada plantilla incluye comentario HTML con título, tipo y patrón de rama; el cuerpo visible sigue las secciones del ejercicio por tipo.
3. No existen `basic_issue.md` ni `basic-pull-request.md`.
4. En `agents/`, `skills/` y `tools/` no aparecen «menos de 72», la lista literal de los seis tipos ni `número-tipo-descripcion` (sí en `templates/`).
5. `templates/` es idéntico a `exercises/git-workflow-agent-template/templates/`.
6. `agents/create-issue.md`, `agents/create-pr.md`, `skills/create-issue`, `skills/create-pr-base-staging` y `skills/link-pr-to-issue` hablan de plantilla por tipo; no nombran `basic-pull-request.md`.
7. `docs/ARCHITECTURE.md` describe plantillas por tipo. `src/`, `package.json` y clientes no cambian.

## Fuera de alcance

- Editar `exercises/git-workflow-agent-template`.
- Cambiar `agents/git-workflow-agent.md` salvo si una frase contradice las plantillas (no se prevé).
