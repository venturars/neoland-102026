Issue: #674

# Acceso a Socket y alertas por versión

Estado: aprobado e implementado conforme a las [tareas](tasks.md) autorizadas.

El proyecto necesita un procedimiento portable para conservar el MCP remoto con OAuth y consultar alertas por paquete y versión mediante PURL con `SOCKET_API_TOKEN`.

## Criterios de aceptación

1. El MCP remoto conserva su autorización OAuth. La API PURL utiliza `SOCKET_API_TOKEN` solo en memoria, sin mostrarlo ni guardarlo en archivos o Git.
2. La organización se obtiene de la configuración vigente y se contrasta con las organizaciones accesibles. Los paquetes directos y sus versiones exactas se obtienen del manifiesto y del archivo de bloqueo actuales.
3. El resultado identifica organización, paquete, versión, estado y alertas relevantes, incluidas severidad y acción de la organización.
4. `pendingScan`, `notFound` y los errores de consulta o acceso no se presentan como «sin alertas». La acción `ignore` no equivale a aceptación humana del riesgo.
5. Revisar paquetes directos no acredita una revisión hasta tres capas de dependencias ni cobertura de campañas.
6. La documentación usa fuentes oficiales y ejemplos sin secretos ni rutas personales. Enlaza las reglas existentes sin duplicarlas y actualiza la estructura y arquitectura por los documentos incorporados.

## Alcance y aprobación

El alcance es documentación del procedimiento funcional. Spec, plan y tareas están aprobados; la documentación está implementada para revisión.
