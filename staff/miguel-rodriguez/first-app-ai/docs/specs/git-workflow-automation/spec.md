# Automatización de Git para first-app-ai

Issue: #602.
Estado: aprobada por Miguel el 2026-10-30.

## Propósito

Quien construye first-app-ai con IA necesita un flujo propio para escribir una tarea, empezar su trabajo, guardar cambios y pedir revisión. Debe poder seguirlo sin mezclar instrucciones de otras aplicaciones ni perder las aprobaciones del proceso SDD.

## Entrada y resultado

Entra una petición de Miguel y el estado real del trabajo. El flujo reconoce si se quiere pensar una tarea, dejarla escrita, empezarla, guardar un trozo o pedir revisión.

Una petición expresa autoriza los pasos de ese momento: el flujo los completa sin pedir un sí entre cada uno. No inicia momentos posteriores por su cuenta. Se mantienen las confirmaciones exigidas por las herramientas, las decisiones sobre datos faltantes y las aprobaciones SDD descritas abajo.

La automatización usa delegación real: el orquestador reconoce el momento y encarga a los subagentes de Git las responsabilidades que les corresponden. El agente principal no sustituye esas delegaciones ejecutando por su cuenta el trabajo asignado a un subagente. Leer sus instrucciones en la conversación principal no equivale a lanzarlo. El plan concretará el reparto entre orquestador, subagentes, skills y herramientas conforme al flujo del curso.

- Pensar una tarea aclara qué se necesita y cómo comprobarlo, usando el contexto del proyecto cuando corresponda.
- Dejarla escrita crea una issue asignada al usuario autenticado, con título en inglés y descripción en español que explique qué hacer y cómo probarlo.
- Empezarla actualiza staging sin sobrescribir trabajo local, abre una rama identificada por el número de issue, tipo y descripción breve en inglés, guarda el commit vacío de apertura y publica una PR en draft hacia staging. La PR queda asignada al usuario autenticado y relacionada con la issue tanto en su descripción como en Development. La issue sigue abierta.
- Guardar un trozo incorpora únicamente los archivos elegidos en uno o varios commits pequeños, con mensajes en inglés, y los publica en su rama.
- Pedir revisión requiere que Miguel indique las personas. Se resuelven sus cuentas dentro del repositorio, se excluye al autor, se solicitan las revisiones y la PR sale de draft. No se eligen revisores por su cuenta.

La descripción de la PR está en español y explica el cambio realmente presente y cómo comprobarlo. Una apertura sin implementación se identifica como tal; no afirma resultados todavía no obtenidos. Una petición repetida no duplica una issue inequívocamente existente ni una PR de la misma rama; si hay ambigüedad, se pide la decisión antes de publicar.

## Aprobaciones y conservación

La issue existe antes de preparar su especificación. Miguel revisa y aprueba por separado spec, plan y tareas, en ese orden. Crear la rama o la PR no aprueba esos documentos. La implementación empieza después de aprobar las tareas y pedirla expresamente.

La instrucción actual que reserva todas las acciones de Git y publicación a Miguel se sustituirá por este flujo: el agente podrá ejecutar las acciones del momento expresamente solicitado, con los límites de esta spec. La documentación deberá reflejar esa autorización sin conservar la prohibición anterior como una regla contradictoria.

El trabajo normal se realiza en una rama nueva desde staging actualizado; todas sus PRs apuntan a staging desde su creación. No se crean ramas dependientes de otra tarea como parte de este flujo. No se cambia la base ni se añaden cambios después de recibir aprobaciones sin una petición expresa. No se fusionan PRs, se cierran issues ni se borran ramas automáticamente. El flujo no garantiza que GitHub conserve aprobaciones si cambia la comparación revisada.

Los cambios locales ajenos se conservan y no se incorporan a los commits. Si impiden actualizar staging o abrir la rama, se informa antes de continuar; no se borran ni se guardan provisionalmente sin autorización. No se fuerzan publicaciones ni se reescribe el historial remoto.

## Conexión y fallos visibles

La conexión de GitHub utilizada en Codex debe permitir las acciones necesarias y mostrar las confirmaciones que requieran intervención humana. Se comprueba la conexión del entorno que ejecuta el flujo.

En Codex también se comprueba que el flujo lanza realmente los subagentes previstos y recibe sus resultados. La evidencia identifica el encargo y su resultado mediante los registros de ejecución disponibles; no basta que el agente diga que ha delegado ni que existan los documentos. Si el entorno no permite lanzar o verificar un subagente necesario, se informa del bloqueo y no se sustituye silenciosamente por una ejecución del agente principal.

Si falta información necesaria, una cuenta no puede identificarse o una acción falla por conexión, permisos o confirmación inaccesible, se explica la operación afectada y se detiene el flujo hasta resolverla. Se distingue lo que ya terminó de lo que no se hizo. No se inventan números, enlaces, revisores ni éxitos y no se repiten publicaciones para ocultar un fallo.

Un enlace escrito en la descripción no acredita el enlace de Development. Si solo se consigue uno de ellos, se informa del pendiente. No se atribuye un fallo al token sin comprobarlo ni se desactivan confirmaciones como solución genérica. Las credenciales permanecen fuera del repositorio, los argumentos de comandos y los informes.

Estos fallos pertenecen al flujo de trabajo; no añaden mensajes de error a las operaciones de contactos.

## Criterios de aceptación

- **CA-01:** Las instrucciones propias de first-app-ai permiten reconocer y completar los cinco momentos descritos, con rutas válidas de nuestra app y del repositorio. Las guías de trabajo, árbol y arquitectura describen el mismo procedimiento y sus responsabilidades. La antigua reserva de todas las acciones de Git a Miguel queda sustituida por la autorización limitada al momento solicitado.
- **CA-02:** Una tarea autorizada queda escrita con la asignación, los idiomas y el contenido indicados. Empezarla produce una rama desde staging actualizado, el commit de apertura y una PR asignada, en draft, con destino staging y ambos enlaces a la issue, que continúa abierta.
- **CA-03:** Guardar cambios incluye solo los archivos elegidos. Pedir revisión usa únicamente las personas indicadas por Miguel, excluye al autor y deja la PR lista para revisión. Las repeticiones y los fallos no generan duplicados ni éxitos ficticios.
- **CA-04:** El momento expresamente solicitado se completa sin confirmaciones repetidas entre sus pasos ni inicio automático de momentos posteriores. Se mantienen las confirmaciones de herramientas y las decisiones necesarias. Las aprobaciones de spec, plan y tareas siguen siendo independientes y previas a implementar. No hay ramas dependientes, cambios de base, fusiones, cierres ni borrados automáticos; se respetan las protecciones sobre trabajo local, historial y aprobaciones descritas arriba.
- **CA-05:** En Codex se verifican el acceso de GitHub, las confirmaciones necesarias y la delegación real a los subagentes previstos. La evidencia de ejecución permite identificar sus encargos y resultados, sin exponer credenciales. Los documentos o la afirmación del agente principal no prueban la delegación. Un bloqueo de conexión, permisos, lanzamiento o verificación deja este criterio pendiente; no se presenta como una comprobación satisfactoria.
- **CA-06:** Las comprobaciones del flujo se hacen sobre trabajo autorizado o copias desechables. No se publican tareas o PRs de prueba adicionales sin autorización. Las operaciones, clientes, dependencias y datos de la aplicación se conservan y las comprobaciones de formato y lint siguen pasando.

## Ejemplo

Miguel pide organizar una tarea de first-app-ai. Se aclara y se crea su issue. Al pedir empezar, se abre la rama desde staging actualizado y una PR en draft hacia staging, con la issue enlazada. Miguel aprueba primero la spec, después el plan y después las tareas. Se implementa y se guardan únicamente los archivos de ese trabajo. Cuando Miguel nombra a los revisores, se solicita su revisión. Fusionar y cerrar la issue quedan fuera de esa ejecución automática.

Si la publicación de la rama funciona pero abrir la PR falla, se informa de la rama publicada y del fallo de la PR; no se afirma que el recorrido está completo ni se crea otra rama.

## Fuera de alcance

- Trasladar las carpetas de la aplicación a src o cambiar sus importaciones.
- Cambiar Socket, sus reglas de validación o su configuración.
- Añadir dependencias o cambiar sus versiones.
- Cambiar los contratos, las operaciones, los clientes o los datos de contactos.
- Modificar otras aplicaciones, la automatización compartida o las specs históricas.
- Añadir ejecución automática de desarrolladores y testers, ciclos de reintentos o infraestructura adicional.

## Ajuste autorizado — 2026-10-30

Miguel indicó «Dont use Cursor, you do it». La ejecución y verificación pasan a Codex con subagentes reales y sus herramientas disponibles. Cursor deja de ser un requisito de aceptación; sus entradas existentes pueden conservarse como compatibilidad sin afirmar que se ha probado su ejecución. Se mantienen el alcance, las paradas SDD y las autorizaciones específicas para publicaciones de prueba y entrega.

## Arreglo de Ventura autorizado — 2026-10-30

Miguel pidió adaptar el arreglo 30149d61 de exercises/git-workflow-agent-template, disponible en staging 42462132. Se usa Closes #N en la plantilla y el enlace de descripción, manteniendo Development, base staging e issue abierta durante la apertura. No se cierra mediante API como parte del flujo. GitHub solo aplica ese cierre al integrarse en la rama por defecto; staging no se sustituye por main.

Se documenta mcp_apps_disable_form_deferral: header en el servidor remoto o --features en el servidor local stdio de Codex. La configuración privada no se versiona. La instrucción específica autoriza esa opción para evitar el formulario diferido; no elimina otras confirmaciones ni autoriza cambiar permisos o cliente. Si persiste una confirmación inaccesible, se registra el bloqueo. Se conserva el reparto de subagentes y las paradas SDD. Este ajuste sustituye las referencias anteriores a Related to y la prohibición general de headers públicos; las credenciales siguen excluidas.
