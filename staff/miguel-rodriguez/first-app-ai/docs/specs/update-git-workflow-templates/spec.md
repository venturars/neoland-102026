# Actualizar las plantillas del flujo Git

Issue: #749 · PR: #750.
Estado: aprobada por Miguel el 2026-11-02.

Corrección de review solicitada por Miguel el 2026-11-03: las reglas editoriales
de título y tipo pertenecen a las plantillas, sin duplicación en agentes/skills
de creación ni normalización obligatoria a seis tipos.

## Referencia

Se adapta `exercises/git-workflow-agent-template` en la revisión
`25208d23157626954906ffe7da32757c58d9a66e`
(«docs: add per-type templates and drop duplicate rules»).

## Propósito

Quien trabaja en first-app-ai necesita describir y revisar cada tarea con la
plantilla adecuada a su tipo, siguiendo la actualización del Git template de
Ventura sin perder las adaptaciones que ya funcionan en Codex.

## Entrada y resultado

La entrada es una tarea concreta y su tipo. Las seis plantillas disponibles
no constituyen una lista cerrada impuesta por agentes o skills. La documentación del flujo indica qué plantilla corresponde y qué
información debe aportar quien crea la issue o la PR. Si el tipo no tiene una
plantilla específica, se utiliza la más cercana a la intención de la tarea.

El resultado es una issue o una PR con la estructura del tipo elegido, título
en inglés y cuerpo en español. Una funcionalidad explica la necesidad y el
comportamiento esperado; una corrección describe el fallo y su reproducción;
los demás tipos describen el cambio y su comprobación según su plantilla.
No se atribuyen verificaciones ni cambios que todavía no se hayan realizado.

Las instrucciones de enlace distinguen entre relacionar la issue y cerrarla:
Closes #N y Development vinculan la PR con la tarea, sin cerrar la issue mediante
una llamada explícita a la API. El cierre automático corresponde al merge en la
rama predeterminada real del repositorio. No se presupone que esa rama sea main
ni se cambia la base de una PR para provocar el cierre.

## Comportamiento que se conserva

- Las tareas nuevas parten de staging actualizado y las PRs apuntan a staging
  desde su creación. No se incorporan ramas dependientes desde otras bases.
- Al empezar se abre la PR en draft. El enlace con la issue corresponde al
  orquestador después de la creación; no se delega al creador de PRs.
- Se conservan las aprobaciones independientes de spec, plan y tareas antes de
  implementar, y las protecciones frente a duplicados y fallos parciales.
- No se cambian commits, base ni estado de una PR ya revisada sin petición
  expresa. No se solicitan revisores que Miguel no haya nombrado.
- Permanecen los scripts actuales y la adaptación MCP de Codex.

## Criterios de aceptación

- **CA-01:** Hay una plantilla de issue y otra de PR para cada uno de los seis
  tipos. Cada una conserva la información y comprobaciones propias de ese tipo
  en la versión del template utilizada como referencia.
- **CA-02:** Los agentes y skills afectados indican cómo seleccionar la plantilla
  por tipo y usar la más cercana si no existe una específica. Las referencias
  activas apuntan a plantillas existentes; las retiradas no siguen siendo la
  instrucción vigente. Las specs históricas conservan su contenido.
- **CA-03:** Los títulos siguen en inglés y los cuerpos en español. En una PR
  draft se distingue el trabajo previsto del realizado y las casillas permanecen
  sin marcar. Al solicitar revisión, se marcan únicamente las comprobaciones
  efectivamente verificadas; solicitar revisión no acredita por sí solo su cumplimiento.
- **CA-04:** Las instrucciones de enlace y cierre son coherentes con la rama
  predeterminada real y conservan Closes #N y Development, sin cerrar la issue
  mediante API ni cambiar la base staging.
- **CA-05:** Se mantienen las reglas anteriores del SDD, Codex y protección de
  revisiones. Los scripts, el código de la aplicación, los datos y las
  dependencias no cambian.
- **CA-06:** El árbol y las responsabilidades documentadas reflejan las plantillas
  y referencias resultantes. Las comprobaciones de formato y lint pasan.

## Ejemplos de comprobación

1. Una tarea feat utiliza las plantillas de funcionalidad y permite identificar
   qué necesita la persona usuaria y cómo comprobar el comportamiento nuevo.
2. Una tarea fix utiliza las plantillas de corrección y permite reproducir el
   fallo y comprobar su solución.
3. Las tareas docs, refactor, test y chore tienen su propia estructura. Un tipo
   sin plantilla específica utiliza la más cercana sin bloquear el flujo solo
   por la falta de una plantilla idéntica.
4. Si staging es la rama predeterminada, las instrucciones reconocen el cierre
   automático al fusionar allí. Si la configuración cambia, describen la
   condición real sin exigir mover la PR a main.

## Fuera de alcance

Implementar el cliente web, modificar AsistenciApp u otros proyectos, cambiar
scripts o configuración privada del MCP, añadir dependencias, crear automatismos
nuevos, modificar las reglas SDD o reescribir evidencias históricas. No es necesario
publicar issues o PRs de prueba para comprobar esta actualización documental.
