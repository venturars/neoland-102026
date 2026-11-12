# Plan — validación de paquetes con Socket

## Archivos y cambios

- `docs/CONSTITUTIONS.md`: añadir una sección «Paquetes» después de
  «Documentación de funcionalidades». Establecer la obligación de validar
  con Socket los paquetes de Node nuevos y los cambios de versión.
- `AGENTS.md` de esta app: añadir una sección «Paquetes» después de
  «Reglas de trabajo». Describir la revisión con el MCP de Socket antes
  de aprobar el plan, para la versión propuesta y sus dependencias hasta
  tres capas. El resumen por paquete y versión recoge campañas, alertas
  y puntuaciones inferiores a 50, con iguales criterios en todas las capas.
  Incluir las alertas comentadas y su aceptación por quien aprueba el plan,
  sin que el agente decida por esa persona. Excluir paquetes ajenos a Node,
  paquetes existentes sin cambio de versión y dependencias más allá de
  tres capas.

## Límites

Solo se modificarán esos dos documentos. No se añaden paquetes ni se
cambian versiones, por lo que esta tarea no requiere consultar Socket.

## Verificación

Contrastar los documentos con los criterios de aceptación de `spec.md`
y comprobar que el diff respeta el alcance.

Cada fase del flujo spec → plan → tasks → implementación requiere
aprobación. No se hará commit, push ni se abrirá una PR.
