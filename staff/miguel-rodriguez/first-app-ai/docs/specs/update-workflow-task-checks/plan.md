# Actualizar las comprobaciones del workflow

Issue: #893 · PR: #897.
Spec: [spec.md](spec.md), aprobada el 2026-11-04.
Estado: aprobado por Miguel el 2026-11-04.

## Cambio

Adaptar la validación del template de referencia fijado en la spec a la sección
«Entrada y estado» de `agents/git-workflow-agent.md`:

- Elegir el momento por la petición y el estado real del trabajo.
- Antes de escribir la issue, comprobar problema, resultado esperado, alcance y
  verificación, contrastando los documentos del proyecto cuando corresponda.
- Si está definido, explicar brevemente qué información permite escribirla y
  delegar en create-issue. Si hay dudas o contradicciones, delegar en
  help-me-to-think y esperar la respuesta necesaria antes de publicar.
- Conservar las respuestas anteriores y consultar las decisiones nuevas o
  pendientes. Para otros momentos, pedir los datos necesarios que falten.

En «Empezar», dejar explícito que la secuencia existente debe completarse antes
de editar el proyecto: actualizar staging, crear rama, commit de apertura, push,
PR draft hacia staging y enlace de la issue en cuerpo y Development.
La reanudación mantiene las comprobaciones actuales para reutilizar recursos.

El principal sigue siendo el orquestador en Codex. Los subagentes actuales
conservan sus responsabilidades y sus skills; la elección de grill-with-docs o
grill-me sigue perteneciendo a help-me-to-think.

## Documentación

Actualizar el resumen de responsabilidades del workflow en `docs/ARCHITECTURE.md`
y añadir esta carpeta SDD a `docs/TREE.md`, incluyendo los documentos que existan
al terminar la tarea. Mantener la explicación detallada en el orquestador.
La checklist personal de Codex permanece fuera del repositorio.

## Verificación

Registrar en tasks.md la entrada, decisión esperada y observada de estos recorridos
sobre las instrucciones resultantes, sin ejecutar escrituras de prueba en GitHub:

1. Petición de crear una issue con problema, resultado, alcance y comprobación
   definidos: explicación breve y delegación a create-issue.
2. Petición con una decisión pendiente o una contradicción: aclaración mediante
   help-me-to-think antes de publicar.
3. Entrevista reanudada: reutilizar respuestas; preguntar solo por información
   pendiente. Repetir el recorrido con una decisión nueva.
4. Inicio de tarea: comprobar la secuencia completa antes de editar. Reanudación
   parcial: reconocer lo completado y continuar sin duplicarlo.

Revisar el diff contra la issue y la spec; comprobar referencias y conservación
de SDD, herramientas MCP, delegación y protecciones de revisión.
Ejecutar `pnpm format` y después `pnpm lint` desde la app; revisar cualquier
cambio producido por el formateador antes de incorporarlo.
Estos recorridos verifican instrucciones; no acreditan nuevas ejecuciones reales
de creación de recursos en GitHub.

## Entrega

Tras aprobar las tareas e implementar, revisar los cambios, crear commits
pequeños y publicar en la rama de #893. La PR #897 conserva staging como base.
Solicitar revisión solo después de terminar la entrega y cuando Miguel indique
los revisores.
