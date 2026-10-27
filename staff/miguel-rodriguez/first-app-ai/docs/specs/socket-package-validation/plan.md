# Plan · Validación de paquetes con Socket

Estado: plan aprobado por Miguel el 2026-10-27.
Fecha: 2026-10-27. [Spec aprobada](spec.md). [Issue #435](https://github.com/venturars/neoland-102026/issues/435).

## Punto de partida y alcance

La constitución ya exige versiones exactas, pnpm y aprobación de las dependencias, pero no exige Socket. AGENTS.md remite a esas reglas y conserva las aprobaciones separadas de spec, plan y tareas.

Es un cambio documental, sin una operación de negocio equivalente ni firmas, SQL o errores nuevos. No se instalan paquetes ni se cambian versiones. Las consultas siguientes prueban la cobertura de las herramientas; no proponen incorporar ni actualizar los paquetes utilizados como ejemplo.

## Archivos

- Modificar `docs/CONSTITUTIONS.md`: añadir la regla fundamental dentro de «Dependencies and package management». Añadir únicamente esta carpeta de spec, plan y tareas al árbol existente.
- Modificar `AGENTS.md`: añadir una sección «Socket package validation» con el procedimiento, manteniendo las instrucciones anteriores.
- Completar `docs/specs/socket-package-validation/`: spec, este plan y, tras su aprobación, tareas con resultados de la verificación.

No se modifican el manual de la raíz, otras specs, código, datos, clientes, requisitos, `package.json` ni el lockfile. No se crean guías adicionales o herramientas de escaneo.

## Regla fundamental

Añadir en la constitución, en el idioma actual del documento:

> A new Node package, or a change to its version, must be checked with Socket before the implementation plan is approved. Follow the procedure in AGENTS.md.

El detalle vive únicamente en AGENTS.md. Las reglas actuales de versiones exactas, instalación y aprobación siguen vigentes.

## Procedimiento en AGENTS.md

La sección se redactará en inglés, como el manual actual, con pasos breves. El uso habitual será consultar las fuentes existentes y escribir el resumen; no se crea un escáner, un cliente API propio ni una capa de adaptadores. Establecerá estos pasos:

1. Identificar cada paquete Node nuevo o cuya versión se propone cambiar, con su versión exacta; incluye dependencias de desarrollo.
2. Enumerar tres capas en total: paquete propuesto, dependencias directas y dependencias de estas. Usar versiones resueltas, no rangos. Incluir dependencias opcionales o pares cuando formen parte de la resolución propuesta; indicar las exclusiones por plataforma. Se incluyen también las dependencias de esas capas que ya estén presentes en el proyecto, aunque su versión no cambie. Una combinación nombre/versión puede revisarse una vez y conservar sus relaciones en el resumen.
3. Obtener el árbol del lockfile existente cuando corresponda. Si la versión propuesta no figura en él, consultar los metadatos del registro y documentar la resolución exacta prevista, sin instalar ni ejecutar el paquete. Si no se puede determinar una parte del árbol, señalarla como incompleta; no inventar versiones ni dar esa capa por revisada.
4. Consultar Socket para las versiones identificadas. Registrar por separado campañas, alertas y las cinco estadísticas disponibles: supply chain, vulnerabilidad, calidad, mantenimiento y licencia. Señalar cada puntuación inferior a 50 sobre 100 y cada dato ausente.
5. Usar las herramientas según su cobertura: `depscore` para estadísticas; `organizations` para descubrir la organización; `alerts` para avisos en paquetes monitorizados por esa organización. No deducir alertas o campañas de una puntuación. No tratar una búsqueda organizativa vacía como un informe completo sobre cualquier versión del paquete. Si la respuesta ofrece un cursor para más resultados, recorrer las páginas hasta agotarlas antes de considerar completa esa consulta. Si no se termina, registrar la consulta como parcial; completar la paginación no amplía la cobertura de la fuente.
6. Para alertas por versión que el MCP no cubra, usar el informe de esa versión o la consulta oficial de paquetes por PURL descrita abajo, una vez probado el acceso. No presentar esta alternativa como operativa solo por estar documentada. Un resultado pendingScan, notFound, incompleto o sin correspondencia con la versión solicitada sigue sin comprobar. No filtrar solo por gravedad alta ni solo por alertas reparables.
7. Registrar en el plan el árbol, fecha, consultas/fuentes, resultados, limitaciones y decisión humana. Solo afirmar «comprobado sin avisos» para el criterio, versión y cobertura que la fuente realmente permita comprobar. Si falta cobertura de campañas o alertas, decir «no comprobado» y explicar el motivo.
8. Presentar los avisos y la información incompleta a quien aprueba el plan. Esperar su decisión antes de instalar o incorporar la dependencia. Una aceptación excepcional vale para la propuesta revisada, no para todos los paquetes futuros. Aprobar este plan documental no acepta por adelantado los riesgos de futuras dependencias.
9. Después de una instalación autorizada, comparar las versiones y relaciones resueltas en el lockfile con las tres capas revisadas. Si aparece o cambia un paquete o versión dentro de esas capas, comprobarlo con Socket y actualizar el resumen. Presentar las diferencias, avisos y limitaciones y esperar la aprobación del plan actualizado antes de continuar la implementación o darla por terminada. No editar el lockfile a mano para hacerlo coincidir ni ampliar la revisión más allá de la tercera capa.

No se exige auditar por separado todos los paquetes existentes cuya versión no cambia. Esa exclusión no permite saltarse una dependencia incluida en las tres capas de un paquete nuevo o actualizado. Quedan fuera paquetes ajenos a Node y la cuarta capa en adelante. Los paquetes sin cambios usados como ejemplo aquí no se convierten en una auditoría retrospectiva obligatoria.

Para versiones nuevas, las consultas de metadatos no sustituyen Socket. Las herramientas disponibles pueden cambiar: si una fuente permite comprobar una versión concreta, usarla y registrar su cobertura; si no, mantener el dato pendiente. No se exige adquirir un plan de pago ni configurar monitorización como parte de esta tarea.

## Cobertura comprobada · 2026-10-27

Consultas reales de solo lectura realizadas durante la preparación del plan:

| Consulta | Resultado | Qué demuestra |
| --- | --- | --- |
| `organizations({})` | Devuelve la organización `neoland`, plan `free`. | La conexión está autenticada y permite descubrir esa organización. |
| `depscore`, npm `cli-table3@0.6.5` | Devuelve las cinco estadísticas en escala 0–100. | Permite solicitar estadísticas para una versión exacta; no devuelve alertas individuales ni campañas. |
| `alerts`, organización `neoland`, npm, nombre `cli-table3`, cinco resultados por página | `items: []`, `endCursor: null`; la respuesta confirma filtros por nombre y ecosistema, con estado abierto por defecto. | La consulta funciona, pero no acredita que esa versión esté monitorizada. No hay filtro de versión en el contrato disponible. No demuestra ausencia de alertas para `0.6.5`. |
| `threat_feed`, organización `neoland`, npm `cli-table3@0.6.5` | Error 403, `threat_feed_not_entitled`: el feed no está habilitado para la organización. | Ese feed no es utilizable con el acceso actual. Tampoco se equipara un feed de amenazas a una comprobación completa de campañas. |

El MCP disponible no expone una consulta específica de campañas ni la consulta de paquetes por PURL. Eso limita este MCP, no demuestra que Socket carezca de esas funciones. Esas consultas iniciales no comprobaron alertas por versión ni campañas; la investigación posterior y la decisión de cobertura se registran en los apartados siguientes.

## Consulta por versión verificada · 2026-10-27

La [API de paquetes por PURL de Socket](https://docs.socket.dev/reference/batchpackagefetchbyorg) permite `POST /v0/orgs/neoland/purl?alerts=true&poll=true&timeoutSec=20`. El cuerpo contiene únicamente los PURL de las versiones revisadas. Se probó con un token local de lectura con `packages:list`; no se guardan credenciales en el proyecto ni se muestran en comandos o resultados. No hace falta instalar el CLI ni añadir una dependencia.

La petición sin filtros de gravedad, acciones o alertas reparables devolvió HTTP 200 para las seis versiones del ejemplo y un control con `chalk@5.6.1`. Se comprobaron las correspondencias `inputPurl`, versión y `verdictRevision`; ninguna respuesta contenía pendingScan o notFound.

- `@colors/colors@1.5.0`: alerta `envVars`, gravedad baja, acción de política `ignore`. Significa que el paquete accede a variables de entorno; por sí sola no demuestra robo de datos. Se muestra al revisor aunque la política diga ignore.
- Las otras cinco versiones del ejemplo devolvieron una lista de alertas vacía en esa consulta. Esto describe el resultado y fecha de esa fuente, no una garantía de seguridad ni una comprobación de campañas.
- Control `chalk@5.6.1`: alerta `malware` crítica y `networkAccess` de gravedad media. El aviso conocido está documentado por [Socket](https://socket.dev/glossary/github-advisory-database). El control confirma que el procedimiento devuelve avisos reales. No se descargó ni ejecutó ese paquete.

La primera prueba utilizó respuesta compacta; la comprobación final anterior utilizó la respuesta completa, que incluye explícitamente `alerts`, `inputPurl` y revisión. Solo se conservaron resúmenes sin credenciales. Las consultas consumen cuota; no se hacen reintentos ilimitados.

### Campañas: bloqueo confirmado

Se encontró la [API específica de campañas](https://docs.socket.dev/reference/get_v1-orgs-org-slug-threat-campaigns), distinta del feed de amenazas. Se probó `GET https://api.socket.dev/v1/orgs/neoland/threat-campaigns/?ecosystem=npm&per_page=5` con el token creado con `threat-campaigns:list`.

Resultado: HTTP 403, «Threat campaigns are not enabled for this organization. Please contact sales for information on enabling this feature.» La documentación exige Enterprise con el complemento Threat Feed. Añadir el permiso al token no habilita esa prestación. No se contratará un plan ni se modificarán permisos para intentar eludirlo.

El informe web de la versión también devolvió 403 al cliente HTTPS. Eso no demuestra que Miguel no pueda leerlo en su navegador. Una revisión manual puede registrar coincidencias de campañas con sus versiones; si no cubre todas las campañas pertinentes, no permite concluir «sin campañas».

La captura aportada por Miguel el 2026-10-27 de la pestaña Campañas confirma el aviso «Está viendo un conjunto limitado de campañas de ataque» y muestra dos campañas. El panel anterior mostraba cero dependencias monitorizadas. Sus indicadores «Not Detected» no acreditan la revisión de nuestras versiones ni amplían esa cobertura.

**Decisión aprobada por Miguel el 2026-10-27:** usar la consulta de alertas por versión verificada y documentar en cada futura revisión «campañas: cobertura limitada por el plan», indicando las fuentes efectivamente consultadas. No contratar un plan ni desarrollar herramientas nuevas. No afirmar ausencia de campañas. Esta aceptación permite completar la tarea documental; no aprueba riesgos ni información incompleta de paquetes futuros por adelantado.

El procedimiento habitual sigue siendo consultar herramientas existentes y escribir un resumen corto. No se añade código de consulta a la app ni un servicio de auditoría.

### Ejemplo de las tres capas

Se leyó el lockfile actual sin modificarlo. Para `cli-table3@0.6.5` contiene:

| Capa | Paquetes |
| --- | --- |
| 1 | `cli-table3@0.6.5` |
| 2 | `string-width@4.2.3`; opcional `@colors/colors@1.5.0` |
| 3 | `emoji-regex@8.0.0`, `is-fullwidth-code-point@3.0.0`, `strip-ansi@6.0.1` |

`strip-ansi@6.0.1` depende de `ansi-regex@5.0.1`: este último queda en la cuarta capa y no entra en este ejemplo. Se incluyó la dependencia opcional resuelta; no se ejecutó código de ningún paquete.

`depscore` respondió para las seis versiones del ejemplo:

| Paquete | Supply chain | Vulnerabilidad | Calidad | Mantenimiento | Licencia |
| --- | --- | --- | --- | --- | --- |
| cli-table3@0.6.5 | 100 | 100 | 100 | 81 | 100 |
| string-width@4.2.3 | 100 | 100 | 81 | 85 | 100 |
| @colors/colors@1.5.0 | 100 | 100 | 100 | 82 | 100 |
| emoji-regex@8.0.0 | 100 | 100 | 91 | 84 | 100 |
| is-fullwidth-code-point@3.0.0 | 100 | 100 | 77 | 79 | 100 |
| strip-ansi@6.0.1 | 100 | 100 | 74 | 80 | 100 |

Ninguna puntuación del ejemplo está por debajo de 50. La comprobación posterior de alertas cubrió las seis versiones, con los resultados del apartado anterior. La alerta envVars de @colors/colors muestra por qué una puntuación alta no equivale a ausencia de alertas. No hay una conclusión de seguridad global ni una solicitud de aprobación de estos paquetes.

## Verificación tras implementar

- Leer los dos documentos finales contra la spec y la issue: momento de validación, tres capas totales, campañas, alertas, estadísticas, información ausente y decisión humana.
- Comprobar que la regla fundamental remite al procedimiento sin duplicarlo y que las reglas previas y sus aprobaciones permanecen.
- Contrastar la documentación de cobertura con las consultas reales y separar los resultados del MCP de la API o informe por versión. Un resultado vacío, pendingScan, notFound o un 403 no pueden transformarse en «sin alertas/campañas». Comprobar el caso con un aviso real cuando el acceso permita realizarlo.
- Recorrer el ejemplo del lockfile para comprobar que la cuarta capa queda fuera. Comprobar documentalmente los límites de 49 y 50 y un dato no disponible; no atribuir esas puntuaciones inventadas a una consulta real.
- Recorrer dos casos documentales: una dependencia de segunda capa ya presente sigue dentro de la revisión; si la instalación autorizada resuelve una versión distinta de la revisada, se actualiza la comprobación y se espera la aprobación del plan actualizado. Si las tres capas coinciden, no se exige otra aprobación por esa comparación. No ejecutar instalaciones para simular estos casos en esta tarea.
- Revisar los archivos modificados y nuevos: solo los documentos previstos. Comprobar que código, datos, dependencias y otras specs no cambian por esta tarea.

No hacen falta pruebas nuevas, ejecutar la aplicación ni abrir bases de datos para este cambio documental. Los resultados de implementación se registrarán en tasks.md después de aprobar el plan y las tareas.

## Revisión del plan

Se contrastó con la spec aprobada, #435, el ejemplo de capas explicado por Ventura y los contratos reales de las herramientas. El plan conserva las aprobaciones separadas y no convierte la excepción de Ventura sobre datos incompletos en una aceptación automática. La exclusión de auditorías retrospectivas no excluye dependencias de las tres capas. Una resolución posterior distinta exige revisar y aprobar las diferencias antes de continuar; una resolución coincidente no añade otra aprobación. Se mantiene la separación entre escribir la regla y comprobar que una futura dependencia cumple esa regla.

La revisión detectó que la conclusión anterior era prematura: comprobar límites del MCP no agotaba las alternativas de Socket. Se corrigió el procedimiento y se dejó una consulta oficial concreta para probar, sin desarrollar infraestructura propia.

**Resultado de la investigación:** alertas por versión y control con aviso real comprobados mediante HTTP 200; campañas bloqueadas mediante HTTP 403 explícito de la organización y cobertura limitada confirmada en el panel. Miguel aprobó el plan y la decisión sobre ese límite el 2026-10-27. Las tareas fueron aprobadas por Miguel el 2026-10-27. La implementación documental está completada y verificada en tasks.md, pendiente de revisión final de Miguel. No se instalaron paquetes ni cambiaron dependencias, datos o GitHub.
