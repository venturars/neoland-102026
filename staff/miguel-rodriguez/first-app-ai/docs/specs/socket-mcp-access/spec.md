# Acceso a Socket y cobertura de alertas

Issue: #664 · PR: #665.
Estado: aprobada por Miguel el 2026-10-30.

## Propósito

Quien desarrolla first-app-ai con IA y quien acepta un plan de dependencias
necesitan encontrar la referencia oficial de Socket y entender qué permite
comprobar la conexión actual. Las alertas, puntuaciones y campañas no deben
confundirse ni darse por revisadas cuando una fuente no responde.

Esta tarea completa la documentación de acceso y alertas del tercer punto de
las prioridades de Ventura. Conserva el procedimiento de validación que nuestra
app ya tiene aprobado.

## Entrada y resultado

Entran la conexión disponible en Codex, la organización accesible, las respuestas
reales de Socket y las reglas vigentes. En una revisión de dependencias también
entran los nombres y versiones exactas correspondientes al alcance aprobado.

Sale una referencia pública de Socket accesible desde la constitución, la
arquitectura y el árbol del proyecto, junto a la referencia existente de GitHub.
La documentación permite distinguir las fuentes, el acceso que requieren y los
límites de sus resultados, sin copiar credenciales ni configuración privada.

Se describe el acceso OAuth del MCP que ya funciona en Codex, sin exigir un token
API adicional para esa conexión. Las credenciales que pueda requerir una API o
informe independiente se tratan por separado: tener un archivo local de token
no demuestra que sus permisos ni esa operación se hayan comprobado. Esta tarea
no lee tokens locales ni cambia la autenticación.

## Fuentes y significado de los resultados

- **Puntuaciones:** corresponden al paquete y la versión exacta consultados. No
  prueban por sí solas que no existan alertas o campañas. Se conservan las cinco
  dimensiones actuales, la escala de 0 a 100 y el aviso de valores inferiores a
  50; 50 no está por debajo del umbral. Los datos ausentes siguen siendo desconocidos.
- **Alertas de organización:** describen los paquetes monitorizados y los filtros,
  estados y páginas consultados. Una lista vacía con paginación agotada solo
  acredita ese alcance. No demuestra ausencia de alertas para cualquier versión
  ni para estados que no se hayan consultado.
- **Alertas por versión:** requieren la API o informe verificado previsto por las
  reglas actuales y cobertura de esa versión exacta. No se sustituyen por una
  lista organizativa vacía. Una comprobación incompleta se declara como tal.
- **Feed de amenazas y campañas:** son fuentes distintas, con permisos y cobertura
  propios. La falta de acceso a una no acredita la ausencia de amenazas ni de
  campañas, y el feed no sustituye una comprobación completa de campañas.

Cada comprobación conserva fecha, fuente, organización cuando corresponda,
consulta, filtros, estados, paginación y resultado o error observado. Se distingue
entre resultado vacío, acceso denegado y cobertura parcial. Si una fuente no
contesta, se escribe el motivo disponible; no se inventa una respuesta ni se
reintenta indefinidamente.

## Diagnóstico que debe conservarse

El diagnóstico real del 30 de octubre de 2026 identificó `neoland`, plan free.
La consulta de alertas abiertas devolvió `items: []` y `endCursor: null`.
El feed de amenazas devolvió 403 `threat_feed_not_entitled`.

Estos resultados quedan fechados como observaciones, no como garantías futuras.
Se vuelven a realizar consultas de solo lectura al verificar la entrega y se
registran sus resultados reales aunque difieran. No se debe exigir que una lista
siga vacía ni provocar un fallo para reproducir el diagnóstico anterior.

## Reglas que se conservan

Las revisiones de Node siguen usando versiones exactas y tres capas totales:
paquete propuesto, dependencias directas y dependencias de estas. Se mantienen
las reglas actuales sobre paquetes ya presentes dentro de esas capas, resolución,
alertas sin ocultar por gravedad o política y comparación posterior del lockfile.

Los hallazgos y carencias de cobertura se presentan a Miguel antes de incorporar
un paquete. La aceptación de riesgos sigue siendo humana y específica para la
propuesta. Se conserva la exposición expresa de la cobertura limitada de campañas.
La sesión de Git no sustituye las aprobaciones independientes de spec, plan y tareas.

## Criterios de aceptación

- **CA-01:** La referencia oficial de Socket se encuentra en el proyecto y tiene
  enlaces válidos desde constitución, arquitectura y árbol, sin credenciales.
- **CA-02:** La documentación distingue el OAuth actual del MCP y la autenticación
  de fuentes independientes. No exige reemplazar la conexión que funciona ni lee
  tokens locales para demostrar acceso.
- **CA-03:** Puntuaciones, alertas organizativas, alertas por versión, feed y
  campañas conservan significados y coberturas distintos; una fuente no acredita
  resultados de otra.
- **CA-04:** Las consultas reales de solo lectura y el diagnóstico anterior quedan
  fechados con su alcance, paginación y resultados o errores. Las limitaciones no
  se presentan como ausencia de hallazgos; no se publican secretos.
- **CA-05:** Se conservan las reglas de validación y aceptación humana descritas
  arriba, sin relajar el alcance de tres capas ni los controles existentes.
- **CA-06:** El cambio se limita a la documentación de first-app-ai. Formato y lint
  siguen pasando; aplicación, datos, dependencias, autenticación y flujo Git quedan
  intactos. Se conservan las specs históricas.

## Ejemplo

La conexión identifica `neoland` y devuelve cero alertas abiertas con la paginación
agotada. El resumen dice exactamente eso; no dice que cada versión esté libre de
alertas. Si el feed devuelve `threat_feed_not_entitled`, registra esa restricción
sin convertirla en «no hay campañas». Miguel decide sobre los hallazgos y límites
de la propuesta concreta, sin una aceptación automática.

## Fuera de alcance

- Añadir o actualizar paquetes, auditar todo el lockfile sin una propuesta o
  cambiar el funcionamiento de la aplicación.
- Modificar credenciales, permisos, autenticación, planes de pago o controles de
  seguridad; leer el token local o publicarlo en documentos y registros.
- Construir un scanner, cliente API, panel o mecanismo de reintentos.
- Cambiar el flujo Git, otras aplicaciones, configuración compartida o specs
  históricas, o dar por aprobados futuros riesgos de dependencias.
