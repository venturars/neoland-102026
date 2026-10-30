# Validar paquetes de Node con Socket

Antes de añadir un paquete de Node o actualizarlo se revisa su versión exacta y sus dependencias hasta tres niveles.

El plan registra campañas conocidas, alertas y puntuaciones inferiores a 50. Las alertas se explican para que la persona responsable decida. La ausencia de acceso o de información se registra como pendiente, nunca como ausencia de riesgo.

Quedan fuera paquetes de Python, versiones sin cambios y dependencias más allá del tercer nivel.

## Iteración del 30 de octubre de 2026 · Conexión y evidencia

Issue: [#663](https://github.com/venturars/neoland-102026/issues/663).

Diego ha autorizado anticipadamente preparar las especificaciones, implementar, comprobar y entregar esta actualización. La autorización no se presenta como una revisión individual de cada documento ni permite inventar consultas o aceptar alertas por su cuenta.

### Necesidad

Quien trabaja con el agente necesita una referencia concreta para conectar Socket, conservar su permiso fuera del repositorio y distinguir las puntuaciones de las alertas y de las campañas. El procedimiento debe poder seguirse con las herramientas disponibles en el cliente, sin depender de un nombre de autenticación que este no ofrezca.

### Criterios de aceptación

- **CA-01**: La guía explica cómo identificar una conexión autenticada y cómo recuperar el acceso mediante la autenticación del cliente cuando falte, sin copiar ni publicar credenciales.
- **CA-02**: Existe un ejemplo de conexión sin secretos, con la dirección oficial del servicio y una explicación de dónde queda el permiso privado.
- **CA-03**: El procedimiento revisa versiones exactas y sus dependencias hasta tres niveles, incluidas las opcionales instaladas, y evita consultar dos veces una misma versión.
- **CA-04**: El informe separa puntuaciones, alertas y campañas; describe filtros y paginación, explica las alertas para la decisión humana y nunca convierte un dato inaccesible en un resultado sin incidencias.
- **CA-05**: Se conserva la revisión del 27 de octubre y se añade una comprobación fechada con las versiones actuales, la organización consultada, los resultados obtenidos y los límites del servicio.
- **CA-06**: No se modifican dependencias, reglas de negocio ni datos, y no se guarda ningún token real en los documentos o ejemplos.

La integración y la guía pueden quedar comprobadas aunque una capacidad del plan de la organización no esté disponible. En ese caso, esa consulta sigue pendiente. Una dependencia nueva o actualizada requiere revisar esa falta de cobertura antes de aceptarla; esta iteración no añade ni actualiza paquetes.
