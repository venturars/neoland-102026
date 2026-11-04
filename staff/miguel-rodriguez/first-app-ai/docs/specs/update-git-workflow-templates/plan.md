# Plan: actualizar las plantillas del flujo Git

Issue: #749 · PR: #750.
Referencia: [spec aprobada](spec.md).
Estado: aprobado por Miguel el 2026-11-02; corrección de review autorizada
el 2026-11-03.

## Enfoque

Adaptar las plantillas y sus instrucciones de uso desde
`exercises/git-workflow-agent-template` en el commit
`25208d23157626954906ffe7da32757c58d9a66e`. Leer esa revisión con git show;
no tomar cambios posteriores silenciosamente ni copiar el template completo.

El flujo existente de Codex permanece. No hay firmas, operaciones de negocio,
consultas, dependencias ni errores de aplicación nuevos. No se instalan paquetes
ni se necesita una revisión Socket de dependencias para este cambio documental.

## Archivos y cambios permitidos

Rutas relativas a `staff/miguel-rodriguez/first-app-ai/`:

| Archivos | Cambio |
| --- | --- |
| `templates/issues/{feat,fix,docs,refactor,test,chore}_issue.md` | Añadir las seis plantillas de la referencia. |
| `templates/pull-request/{feat,fix,docs,refactor,test,chore}-pull-request.md` | Añadir las seis plantillas de la referencia. |
| `templates/issues/basic_issue.md`, `templates/pull-request/basic-pull-request.md` | Retirar las dos plantillas genéricas después de actualizar sus referencias activas. |
| `agents/create-issue.md`, `agents/create-pr.md` | Seleccionar plantilla por tipo y alternativa más cercana; conservar el resto de responsabilidades y controles. |
| `agents/create-branch.md` | Recibir el tipo según la plantilla sin normalizarlo a una lista cerrada, sin cambiar la base staging ni el helper actual. |
| `skills/create-issue/SKILL.md`, `skills/create-pr-base-staging/SKILL.md` | Sustituir referencias genéricas por selección por tipo, manteniendo MCP, validaciones y protección de PRs existentes. |
| `skills/assign-reviewers/SKILL.md` | Incorporar la comprobación de casillas verificadas al solicitar revisión, sin inventar revisores ni resultados. |
| `skills/link-pr-to-issue/SKILL.md` | Eliminar la suposición obligatoria de main y explicar el cierre según la rama predeterminada real; mantener lectura previa, idempotencia y verificación posterior. |
| `AGENTS.md`, `agents/git-workflow-agent.md` | Ajustar únicamente la explicación de cierre según la rama predeterminada real y la referencia al uso de las casillas al pedir revisión. |
| `docs/ARCHITECTURE.md`, `docs/TREE.md` | Reflejar las doce plantillas, sus responsabilidades, retirada de genéricas y documentos de este desarrollo. |
| `docs/specs/update-git-workflow-templates/` | Conservar spec aprobada, este plan y las tareas posteriores con evidencia real. |

No modificar otros archivos. README y registros opcionales de Cursor no requieren
cambios si sus referencias siguen siendo válidas. Si la revisión encuentra una
referencia activa que exige ampliar esta lista, corregir y aprobar el plan antes
de editarla. Las referencias de specs históricas permanecen históricas.

## Selección y creación — CA-01, CA-02, CA-03

- Seleccionar la plantilla por tipo. Si no existe una específica, usar la más
  cercana como indica la fuente. La forma del título y el tipo pertenecen a las
  plantillas; agentes y skills de creación solo las referencian. No imponer una
  lista cerrada, normalizar tipos automáticamente ni renombrar ramas existentes.
- Mantener secciones, comentarios y listas propios de cada plantilla de la
  referencia. No cambiar las doce plantillas ni los scripts en esta corrección.
  Los validadores previos de los helpers quedan fuera de esta PR; si rechazan un
  tipo, comunicar el error en vez de convertirlo silenciosamente a otro.
- El creador de PR utiliza la plantilla correspondiente pero deja Issue vacío
  para el enlace posterior del principal. Un borrador resume el alcance previsto
  y señala qué está pendiente sin afirmar una implementación o prueba inexistente.
- Las casillas permanecen desmarcadas en draft. Al pedir revisión, comprobar cada
  punto y marcar solo los verificados. Si falta una comprobación necesaria,
  comunicarla antes de pasar a revisión, sin marcarla para aparentar finalización.
- No reescribir agentes enteros ni eliminar sus controles de duplicados, fallos
  parciales o validación posterior para igualar la forma del template.

## Enlace y cierre — CA-04, CA-05

El principal conserva la actualización del cuerpo mediante MCP y la comprobación
de Development según la skill vigente. Consultar la rama predeterminada real;
no exigir que sea main. Closes #N solo se añade una vez. Si Development ya está
enlazado, no repetir la mutación. Si falta, usar el procedimiento existente.

Describir que GitHub cierra la issue cuando se integra la PR con el enlace de
cierre en la rama predeterminada. No llamar a la API para cerrarla, cambiar la
rama predeterminada ni mover la base de la PR. Staging permanece como destino.
La comprobación es documental y de solo lectura; no necesita recursos de prueba.

## Verificación — CA-01 a CA-06

1. Comparar las doce plantillas con la referencia fijada y revisar sus enlaces.
   Confirmar la retirada de las dos genéricas y que no quedan referencias activas
   a ellas. Buscar fuera de specs históricas; no alterar sus evidencias.
2. Recorrer documentalmente los seis tipos: plantilla de issue y PR, campos y
   comprobaciones esperados. Simular un tipo sin plantilla solo para comprobar
   la elección de alternativa sin normalizar automáticamente el tipo. Comprobar
   que agentes y skills remiten las reglas editoriales a las plantillas y que no
   se renombra una rama existente. No ejecutar helpers ni crear recursos externos.
3. Revisar el borrador, la solicitud de revisión y el enlace posterior: casillas
   inicialmente vacías, comprobaciones reales, Issue completado por el principal,
   Closes único y Development. Esto verifica instrucciones, no ejecución remota.
4. Consultar por lectura la rama predeterminada y el enlace de #749/#750.
   Contrastar también el caso conceptual de una predeterminada distinta de
   staging: la base sigue staging, sin prometer cierre al fusionar allí.
5. Revisar el diff y el inventario antes/después: scripts, src, scripts de
   Jupyter, configuración, paquetes, datos, referencia MCP, constitución y specs
   históricas permanecen intactos. No ejecutar Git mutador ni la aplicación.
6. En una copia desechable sin datos ni secretos y con las dependencias existentes,
   ejecutar pnpm format y después pnpm lint. No instalar ni actualizar paquetes;
   si faltan dependencias, registrar el bloqueo. Confirmar que el formateo no
   introduce cambios en el código; retirar la copia y registrar resultados reales.

## Revisión del plan

Cubre la selección y contenido (CA-01–03), cierre correcto (CA-04), conservación
(CA-05) y documentación/comprobaciones (CA-06). La actualización se limita al
mantenimiento pedido en #749, sin cambios ejecutables ni pruebas Git completas.

Las tareas requieren aprobación independiente. No se implementa, hace commit,
push, cambia el estado de #750 ni se solicitan revisores en esta preparación.
