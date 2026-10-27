# Formato y revisión de código

Issue: #422.

Quien desarrolla first-app puede ejecutar `pnpm format` para aplicar
Prettier y `pnpm lint` para revisar el JavaScript con ESLint, respetando
las reglas actuales del proyecto y sus módulos ES.

## Criterios de aceptación

- Desde first-app, `pnpm format` aplica el formato establecido y una segunda
  ejecución sobre los mismos archivos no produce cambios adicionales.
- `pnpm lint` revisa el código de la app, informa de los errores detectados
  y termina correctamente cuando no los hay.
- La documentación de comandos y cierre de tareas recoge ambas herramientas
  y exige ejecutar las comprobaciones antes de dar una tarea por terminada.
- Antes de aprobar el plan, sus paquetes y versiones se validan con el MCP
  de Socket, incluidas las dependencias hasta tres capas. El plan resume por
  paquete y versión las campañas, alertas y puntuaciones inferiores a 50.
  Las alertas se comentan y quien aprueba el plan decide si las acepta.

## Dependencias y límites

Antes de implementar, el plan debe respetar las reglas vigentes de validación de paquetes, arquitectura y estilo, sin duplicar documentación ni perder requisitos.
El alcance se limita a las herramientas, sus comandos y la documentación
de first-app. No se cambian comportamientos de negocio ni la base de datos
local, ni se copian archivos ajenos. No se revisan paquetes ajenos a Node,
paquetes existentes sin cambios de versión ni dependencias más allá de
tres capas. Se mantiene la aprobación entre spec, plan, tareas e
implementación.
