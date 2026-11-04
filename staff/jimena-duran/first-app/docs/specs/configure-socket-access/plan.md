Issue: #674

# Plan de acceso a Socket

Estado: aprobado e implementado conforme a las [tareas](tasks.md) autorizadas.

## Procedimiento

1. Conservar el MCP remoto `https://mcp.socket.dev/` con OAuth.
2. Obtener la organización de la configuración vigente sin leer secretos y contrastarla con `organizations` del MCP remoto. Usar el slug correspondiente al proyecto; si no se identifica de forma inequívoca, solicitar ese dato antes de consultar.
3. Leer `dependencies` y `devDependencies` de `package.json` y obtener las versiones exactas del importador correspondiente en `pnpm-lock.yaml`. Construir los PURL de esos paquetes directos con codificación de nombres scoped. Los valores se derivan de los archivos actuales, sin fijar un inventario en la documentación.
4. Enviar `POST https://api.socket.dev/v0/orgs/{org_slug}/purl?alerts=true&poll=false&summary=true`, sustituyendo `{org_slug}` por el dato obtenido. El cuerpo contiene `components`, una lista de objetos con el campo `purl`. El encabezado `Authorization: Bearer` se construye en memoria desde `SOCKET_API_TOKEN`; nunca se imprime ni se guarda.
5. Decodificar UTF-8 y procesar los registros NDJSON y el resumen. Presentar paquete, versión, estado y alertas relevantes con tipo, severidad, cantidad y acción de la organización.

## Interpretación

- Separar análisis completado, `pendingScan`, `notFound` y errores de consulta o acceso; los tres últimos no significan «sin alertas».
- Conservar los hallazgos con acción `ignore`: esa política no equivale a aceptación humana del riesgo.
- Identificar la cobertura como paquetes directos, sin atribuirle revisión de tres capas de dependencias ni campañas.

## Documentación y verificación

- Crear `MCPS/socket-mcp/mcp.txt` con la referencia al MCP remoto y OAuth.
- Crear `docs/SOCKET.md` con el procedimiento PURL y su interpretación, ejemplos parametrizados sin secretos ni rutas personales y enlaces a las reglas de paquetes de [AGENTS.md](../../../AGENTS.md) y [CONSTITUTIONS.md](../../CONSTITUTIONS.md).
- Actualizar [TREE.md](../../TREE.md) y [ARCHITECTURE.md](../../ARCHITECTURE.md) para reflejar los documentos nuevos. Seguir el formato vigente de ambos como referencia.
- Verificar UTF-8, enlaces, whitespace, correspondencia con las fuentes oficiales y ausencia de secretos, rutas personales y valores de la comprobación fijados como requisitos.

La implementación documental está completada para revisión.

## Fuentes oficiales

- [MCP remoto y OAuth](https://docs.socket.dev/docs/remote-socket-mcp).
- [PURL por organización, parámetros y estados](https://docs.socket.dev/reference/batchpackagefetchbyorg).
- [Formato PURL](https://docs.socket.dev/reference/socket-package-urls-purl).
- [Autenticación de API](https://docs.socket.dev/reference/authentication).
