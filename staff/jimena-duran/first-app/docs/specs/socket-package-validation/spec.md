# Validación de paquetes con Socket

Antes de aprobar un plan que incorpore un paquete de Node o cambie su
versión, quien prepara el cambio valida con el MCP de Socket esa versión
y sus dependencias hasta tres capas.

El plan incluye un resumen por paquete y versión: presencia en campañas,
alertas y puntuaciones inferiores a 50. Los mismos criterios se aplican a
las dependencias revisadas.

Las alertas se comentan con quien aprueba el plan. Esa persona decide si
las acepta; el agente no toma la decisión en su lugar.

Quedan excluidos los paquetes que no sean de Node, los paquetes existentes
cuya versión no cambie y las dependencias más allá de la tercera capa.

## Criterios de aceptación

- La constitución exige validar con Socket los paquetes de Node nuevos
  y los cambios de versión.
- Las instrucciones del agente especifican el momento de validación,
  los criterios, las tres capas y el resumen previo a aprobar el plan.
- Las instrucciones recogen las exclusiones y la decisión humana sobre
  las alertas.

