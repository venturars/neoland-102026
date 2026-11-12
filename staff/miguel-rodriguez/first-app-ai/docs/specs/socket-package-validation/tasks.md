# Tareas · Validación de paquetes con Socket

Estado: tareas aprobadas por Miguel el 2026-10-27. Implementación documental completada y verificada; pendiente de revisión final de Miguel.
Fecha: 2026-10-27. [Spec aprobada](spec.md) · [Plan aprobado](plan.md) · [Issue #435](https://github.com/venturars/neoland-102026/issues/435) · [PR #437](https://github.com/venturars/neoland-102026/pull/437).

Las tareas modifican solo los documentos previstos en el plan. No instalan paquetes, ejecutan la app, abren bases de datos ni crean herramientas. La publicación se realizará después, con la autorización correspondiente del flujo del repositorio.

- [x] **T01 · Confirmar el punto de partida.**
  Leer spec, plan, constitución y AGENTS.md; comprobar la rama y los archivos modificados y nuevos.
  Conservar una referencia del contenido de los documentos que se editarán para distinguir los cambios de esta tarea.
  Resultado: alcance identificado y cambios ajenos excluidos, incluida la base local no versionada.

- [x] **T02 · Añadir la regla fundamental.**
  En docs/CONSTITUTIONS.md, añadir el texto de «Regla fundamental» del plan a «Dependencies and package management».
  Mantener las reglas existentes y remitir a AGENTS.md sin copiar el procedimiento.
  Resultado: se exige Socket antes de aprobar planes con paquetes Node nuevos o cambios de versión.

- [x] **T03 · Actualizar el árbol documental.**
  En el árbol de docs/CONSTITUTIONS.md, añadir docs/specs/socket-package-validation/ y sus tres documentos.
  Conservar las otras entradas y su estructura; no crear todavía las guías de arquitectura, árbol o estilo.
  Resultado: la nueva documentación se puede localizar sin reorganizar otras partes del proyecto.

- [x] **T04 · Escribir el procedimiento.**
  Añadir «Socket package validation» a AGENTS.md, en inglés claro, siguiendo los nueve puntos del plan.
  Incluir las tres capas totales, versiones exactas, dependencias ya presentes, umbral, resumen, decisión humana y comparación posterior del lockfile.
  Resultado: pasos breves y aplicables, con las instrucciones anteriores conservadas y sin scripts nuevos.

- [x] **T05 · Precisar las fuentes y sus límites en el procedimiento.**
  Revisar esa sección de AGENTS.md: estadísticas por MCP, alertas exactas por la API verificada y campañas con cobertura limitada por el plan de Socket.
  Incluir paginación, datos pendientes o ausentes, avisos con acción ignore y credenciales fuera del repositorio y de las salidas.
  Resultado: un vacío organizativo no acredita una versión; el límite de campañas se declara en cada revisión y no se acepta por adelantado para paquetes futuros.

- [x] **T06 · Recorrer los casos del plan.**
  Leer las instrucciones finales usando la tabla de comprobación inferior, el lockfile sin modificar y la evidencia ya registrada en el plan.
  No instalar paquetes ni repetir consultas solo para reproducir resultados existentes; si hace falta una consulta nueva, registrar su resultado real.
  Resultado: cada caso tiene una regla concreta y una comprobación registrada, sin presentar ejemplos hipotéticos como ejecuciones.

- [x] **T07 · Revisar alcance y enlaces.**
  Comparar los documentos finales con la referencia inicial y revisar también los archivos nuevos, todavía no versionados.
  Confirmar que solo cambian los dos documentos de instrucciones y esta carpeta; comprobar enlaces locales y formato del diff.
  Resultado: sin cambios de código, dependencias, datos, otras specs o manual de raíz; sin credenciales ni instalaciones.

- [x] **T08 · Registrar la verificación y entregar para revisión.**
  Completar este archivo con resultados reales de T01–T07 y corregir cualquier incumplimiento antes de marcarlo terminado.
  Separar preparación, implementación documental, aprobación de Miguel y revisión de compañeros; no atribuir aprobaciones pendientes.
  Resultado: entrega revisable de esta tarea, sin publicar, cambiar la base de la PR ni solicitar revisiones automáticamente.

## Comprobación documental de T06

Las filas se comprobaron por lectura de las instrucciones finales y contraste con el lockfile y la evidencia del plan. Los casos de instalación, 49/50 y respuestas incompletas son recorridos documentales: no se simularon instalaciones ni respuestas de Socket.

| Caso | Regla que debe encontrarse | Resultado |
| --- | --- | --- |
| Paquete nuevo o versión distinta, también de desarrollo | Resumen de Socket antes de aprobar el plan y antes de instalar | Comprobado: constitución, Dependencies and package management; AGENTS, inicio de Socket package validation y pasos 1, 7 y 8. |
| Dependencia ya presente dentro de las tres capas | Se incluye; no se confunde con auditar todos los paquetes existentes | Comprobado: AGENTS, paso 2 y exclusiones finales. |
| Ejemplo cli-table3 del lockfile | cli-table3 es capa 1; string-width y colors, capa 2; sus dependencias, capa 3; ansi-regex queda en capa 4 | Comprobado: árbol leído del lockfile; coincide con el ejemplo del plan y AGENTS, paso 2. |
| Estadística hipotética de 49 y otra de 50 | Solo 49 está por debajo del umbral; un dato ausente no es cero ni favorable | Comprobado documentalmente: AGENTS, paso 4; no se consultaron puntuaciones ficticias. |
| Alertas paginadas o búsqueda organizativa vacía | Agotar páginas o indicar consulta parcial; no inferir cobertura por versión | Comprobado documentalmente: AGENTS, paso 5; completar páginas no amplía su cobertura. |
| API por versión con pendingScan, notFound o identidad distinta | Comprobación incompleta; no afirmar ausencia de avisos | Comprobado documentalmente: AGENTS, paso 6 y párrafo final de cobertura. |
| Alertas reales de la preparación | Mostrar envVars de colors aunque su acción sea ignore; el control chalk detectó malware sin instalarlo | Comprobado contra evidencia previa del plan: AGENTS, paso 6 no oculta avisos ignore; no se repitieron consultas. |
| API de campañas 403 y panel limitado | Declarar cobertura limitada y fuentes consultadas, sin afirmar «sin campañas» ni contratar un plan | Comprobado contra el 403 y captura ya registrados: AGENTS, paso 7 y exclusiones finales. |
| Instalación futura autorizada con resolución distinta | Revisar las diferencias de las tres capas y esperar aprobación del plan actualizado | Comprobado documentalmente: AGENTS, paso 9; no se instaló nada. |
| Instalación futura autorizada con resolución coincidente | No exigir otra aprobación por esa comparación | Comprobado documentalmente: AGENTS, paso 9; sin puerta adicional por coincidencia. |
| Decisión de Miguel sobre esta tarea documental | No equivale a aceptar riesgos de paquetes futuros | Comprobado: AGENTS, paso 8; cada propuesta conserva su decisión humana. |

## Evidencia de implementación

Verificación realizada el 2026-10-27 en la rama `435-docs-require-socket-validation`, con referencia inicial `bc10b7a7636eb08075ac7ae06831f9c0d835c367`.

- **T01:** se leyeron spec, plan, constitución y AGENTS.md. `git status --short --branch` mostró esta carpeta documental nueva y la base local no versionada `staff/miguel-rodriguez/first-app/db/users.sqlite`. Esta última no se abrió, modificó ni añadió a Git. Se conservaron copias temporales de los dos documentos originales y huellas SHA-256 de los 1554 archivos versionados.
- **T02–T03:** la constitución añade la regla con enlace al manual y el árbol de esta carpeta. Al retirar solo esas dos adiciones, su contenido coincide exactamente con la referencia anterior.
- **T04–T05:** el manual añade nueve pasos de consulta y revisión. Su contenido anterior se conserva íntegro. Se revisaron los pasos contra el plan, incluida la decisión aprobada sobre campañas, credenciales fuera de la entrega y avisos de gravedad baja o acción ignore. El procedimiento usa herramientas existentes; no se creó código ni se instaló nada.
- **T06:** las once filas anteriores indican la regla que resuelve cada caso. Los resultados reales de Socket se reutilizan desde la preparación del plan; esta implementación no realizó nuevas consultas ni presenta comprobaciones hipotéticas como pruebas ejecutadas.
- **T07:** un script Python temporal comparó las huellas de los 1554 archivos versionados: solo cambiaron AGENTS.md y docs/CONSTITUTIONS.md de esta app. Comprobó que la constitución conserva todo salvo la regla y el árbol previstos y que el manual conserva su contenido anterior. Se revisaron además los tres documentos nuevos de esta carpeta. Los enlaces locales de los cinco documentos resuelven correctamente; la credencial real no aparece en ellos. `git diff --check` terminó sin incidencias.
- **T08:** lectura final del diff y de los documentos nuevos contra spec, plan y casos de T06. Solo se modificaron los dos documentos de instrucciones y esta carpeta. No se ejecutaron tests, terminales de la app, instalaciones ni bases de datos: el cambio es documental. No se hicieron commits, push, cambios de base de PR ni solicitudes de revisión.

El resultado es una implementación documental revisada por el agente. La aprobación previa de spec, plan y tareas no se presenta como aprobación final de esta implementación ni como revisión de compañeros. La PR permanece en draft; publicación y revisión final pendientes.
