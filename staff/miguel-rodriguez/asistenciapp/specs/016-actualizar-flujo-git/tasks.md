# Tareas — actualizar el flujo Git

[Spec](spec.md) · [Plan](plan.md) · Issue #1171
Autorización conjunta de Miguel, 2026-11-09.

- [x] T01 Crear tests/git-workflow.test.mjs y comprobar que detecta las piezas ausentes (CA-01–05).
- [x] T02 Incorporar tools/github-cache.mjs y comprobar caché con reloj controlado (CA-01).
- [x] T03 Incorporar skills/github-cache/SKILL.md con ruta local (CA-01).
- [x] T04 Incorporar la plantilla de issue knowledge (CA-02).
- [x] T05 Incorporar la plantilla de PR knowledge (CA-02).
- [x] T06 Actualizar skills/commit-changes/SKILL.md con asunto, cuerpo y pie (CA-05).
- [x] T07 Actualizar agents/create-commit.md con el formato vigente (CA-05).
- [x] T08 Incorporar tools/create-pr-base-staging.sh (CA-04).
- [x] T09 Adaptar skills/create-pr-base-staging/SKILL.md (CA-04).
- [x] T10 Actualizar agents/create-pr.md, incluyendo revisión delegada (CA-03).
- [x] T11 Actualizar skills/assign-reviewers/SKILL.md (CA-03).
- [x] T12 Ajustar agents/git-workflow-agent.md conservando cinco momentos (CA-03).
- [x] T13 Actualizar AGENTS.md con el responsable de revisiones (CA-03).
- [x] T14 Actualizar README.md con uso y requisitos de herramientas (CA-05).
- [x] T15 Actualizar docs/ARCHITECTURE.md con las responsabilidades y archivos (CA-05).
- [x] T16 Ejecutar las pruebas del workflow y pytest en copia desechable (CA-01–05).

## Evidencia de verificación

- Antes de integrar la caché, el ensayo de carga falla por módulo ausente.
- node --test tests/git-workflow.test.mjs: 6 pruebas pasadas, sin omisiones.
- bash -n tools/*.sh y node --check tools/github-cache.mjs: correctos.
- pytest en copia desechable: 313 pruebas pasadas en 6,35 s. La primera copia
  excluyó por error también storage/data; se repuso el CSV versionado y se
  repitió toda la suite. La carpeta local de datos reales no se copió.
- La herramienta de caché conserva el comportamiento del template; se formateó
  con el Prettier ya instalado y conserva la causa al traducir errores de gh.
- Revisión documental CA-03: subagente create-pr, alias inequívocos, acceso vivo,
  exclusión del autor, solicitudes solo si faltan y verificación posterior.
  Se conservan SDD de cinco momentos, Closes/Development y base staging.
- Las pruebas de PR usan gh simulado; las de commits usan remoto bare local.
  No se atribuyen solicitudes reales a esos ensayos.
- No cambian app.py, asistencia/, static/, requirements.txt ni la constitución.
