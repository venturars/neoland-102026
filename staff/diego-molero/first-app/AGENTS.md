# Guía de trabajo

## Antes de empezar

1. Leer este manual, la [constitución](docs/CONSTITUTIONS.md) y las guías que enlaza.
2. Seguir el [orquestador de Git](agents/git-workflow-agent.md) para identificar el momento del trabajo y el subagente responsable. Las instrucciones de cada rol se entregan a un subagente real mediante la herramienta disponible en el cliente de IA.
3. Leer spec.md, plan.md y tasks.md de los desarrollos afectados en docs/specs/.
4. Actualizar las specs antes de cambiar comportamiento. Un alcance propio recibe su trío; las ampliaciones pequeñas actualizan el existente.

El flujo Git de esta carpeta va primero: concretar la tarea, crear la issue, preparar rama y PR en borrador, guardar avances y solicitar la revisión que se haya pedido. Una spec no sustituye la issue, la rama ni la PR. El orquestador delega las acciones concretas y recoge sus resultados; no presenta una operación como ejecutada sin su resultado real.

## Autorizaciones y delegación

- Sin una autorización anticipada, se presentan primero la spec y el plan; después se preparan las tareas y se implementan cuando la persona lo pide. Una autorización explícita para completar una tarea permite recorrer esas fases y su entrega sin volver a pedir permiso para cada paso. Se registra su alcance y no se atribuye una revisión individual de documentos que no ocurrió.
- Cada subagente recibe el rol de `agents/`, el objetivo, los archivos permitidos y el resultado esperado. Los archivos Markdown definen instrucciones; el cliente de IA ejecuta la delegación. No se simula un subagente cambiando solo el nombre del agente principal.
- Las skills de `skills/` se leen desde las referencias del procedimiento. Su ubicación no garantiza que el cliente las descubra automáticamente. Los comandos efectivos viven en `tools/` y las plantillas de contenido en `templates/`.
- Las operaciones Git se limitan a los archivos del encargo. Se conservan cambios y archivos preparados ajenos. No se fuerza un push ni se fusiona una PR a `staging` por iniciativa propia.
- Los revisores se asignan solo si la persona los ha indicado. No se inventan usuarios ni autorizaciones y no se consideran aprobados los checks que siguen pendientes.

## Durante el trabajo

- Mantener las responsabilidades de [arquitectura](docs/ARCHITECTURE.md), los contratos y el [estilo](docs/STYLE.md).
- No añadir capas, dependencias ni archivos que no requiera la tarea.
- Mantener ejemplos de terminal sencillos y notebooks que llamen a las operaciones actuales.
- Si se añaden o eliminan ficheros, actualizar TREE.md y ARCHITECTURE.md.
- Conservar UTF-8, comentarios breves, trabajo ajeno y datos existentes.
- No crear tests ni restaurar su directorio sin petición de Diego.

## Paquetes

Antes de aceptar un plan que añade o actualiza un paquete Node, seguir la [guía de Socket](docs/SOCKET.md): revisar su versión exacta y las dependencias resueltas hasta tres niveles, incluidas las opcionales instaladas. Las referencias de conexión están en [MCPS/socket-mcp/mcp.txt](MCPS/socket-mcp/mcp.txt); el ejemplo público no contiene credenciales.

El resumen del plan indica campañas, alertas y cualquier puntuación inferior a 50 de cada versión. Las puntuaciones por sí solas no enumeran alertas. Comentar las alertas para que la persona responsable decida si las acepta; no decidir por ella.

La falta de acceso o de información se registra como pendiente. No equivale a una revisión sin alertas. La autenticación se realiza en el cliente de IA y su token permanece fuera de Git. Una autorización general de trabajo no equivale a aceptar una alerta nueva de un paquete. Quedan fuera paquetes no Node, versiones sin cambios y niveles posteriores al tercero.

## Comprobación y entrega

- Seguir los comandos de [ejecución](docs/CONSTITUTIONS.md#ejecución).
- Comprobar operaciones y notebooks en una copia temporal sin la base personal.
- Revisar resultados, imports, enlaces, sintaxis y UTF-8. Un cambio solo documental no exige ejecutar la app.
- Marcar tareas solo con evidencia y conservar el historial. Distinguir IA real de respuestas simuladas y sistemas ejecutados de no comprobados.
- Entregar qué cambió, qué se comprobó y qué queda pendiente. No subir bases, credenciales, entornos ni salidas de notebooks.
