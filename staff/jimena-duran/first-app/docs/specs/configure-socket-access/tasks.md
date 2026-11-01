Issue: #674

# Tareas de acceso a Socket

Estado: aprobadas e implementadas; verificación documental completada. Cambio disponible para revisión.
Rama: `674-chore-configure-socket-access`.
Referencias: [spec aprobada](spec.md) y [plan aprobado](plan.md).

1. Inspeccionar la documentación vigente y las fuentes oficiales del plan para confirmar los puntos de integración del procedimiento.
   Resultado: ubicaciones y referencias necesarias identificadas sin duplicar reglas existentes.
2. Crear `MCPS/socket-mcp/mcp.txt` con la referencia oficial del MCP remoto y su acceso OAuth.
   Resultado: referencia portable sin secretos ni rutas personales.
3. Crear `docs/SOCKET.md` con el procedimiento PURL, organización e inventario derivados de la configuración y archivos actuales, e interpretación de estados y alertas.
   Resultado: guía reproducible con ejemplos parametrizados y los límites definidos en la spec.
4. Actualizar `docs/TREE.md` y `docs/ARCHITECTURE.md` con los documentos incorporados.
   Resultado: documentación de estructura y arquitectura coherente con los archivos nuevos.
5. Verificar los documentos del cambio contra la spec, el plan y las fuentes oficiales, incluidos UTF-8, enlaces, whitespace y ejemplos sin secretos ni rutas personales.
   Resultado: comprobación documental satisfactoria, sin valores particulares convertidos en requisitos universales.
