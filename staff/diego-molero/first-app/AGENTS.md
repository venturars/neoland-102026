# Guía de trabajo

## Antes de empezar

1. Leer la [constitución](docs/CONSTITUTIONS.md) y las guías que enlaza.
2. Leer spec.md, plan.md y tasks.md de los desarrollos afectados en docs/specs/.
3. Actualizar las specs antes de cambiar comportamiento. Un alcance propio recibe su trío; las ampliaciones pequeñas actualizan el existente.

El flujo Git del repositorio va primero. Una spec no sustituye la issue, la rama ni la PR.

## Durante el trabajo

- Mantener las responsabilidades de [arquitectura](docs/ARCHITECTURE.md), los contratos y el [estilo](docs/STYLE.md).
- No añadir capas, dependencias ni archivos que no requiera la tarea.
- Mantener ejemplos de terminal sencillos y notebooks que llamen a las operaciones actuales.
- Si se añaden o eliminan ficheros, actualizar TREE.md y ARCHITECTURE.md.
- Conservar UTF-8, comentarios breves, trabajo ajeno y datos existentes.
- No crear tests ni restaurar su directorio sin petición de Diego.

## Paquetes

Antes de aceptar un plan que añade o actualiza un paquete Node, revisar con Socket su versión exacta y las dependencias resueltas hasta tres niveles, incluidas las opcionales instaladas.

El resumen del plan indica campañas, alertas y cualquier puntuación inferior a 50 de cada versión. Las puntuaciones por sí solas no enumeran alertas. Comentar las alertas para que la persona responsable decida si las acepta; no decidir por ella.

La falta de acceso o de información se registra como pendiente. No equivale a una revisión sin alertas. Quedan fuera paquetes no Node, versiones sin cambios y niveles posteriores al tercero.

## Comprobación y entrega

- Seguir los comandos de [ejecución](docs/CONSTITUTIONS.md#ejecución).
- Comprobar operaciones y notebooks en una copia temporal sin la base personal.
- Revisar resultados, imports, enlaces, sintaxis y UTF-8. Un cambio solo documental no exige ejecutar la app.
- Marcar tareas solo con evidencia y conservar el historial. Distinguir IA real de respuestas simuladas y sistemas ejecutados de no comprobados.
- Entregar qué cambió, qué se comprobó y qué queda pendiente. No subir bases, credenciales, entornos ni salidas de notebooks.
