# Plan — validar paquetes de node con socket

Añadir la regla breve a la constitución y el procedimiento al AGENTS.md. Registrar aquí las versiones concretas, las puntuaciones y el alcance de la revisión. No se añaden llamadas a Socket al código de negocio.

## Revisión del 27 de octubre de 2026

Puntuaciones obtenidas con Socket depscore antes de instalar. Orden: licencia, mantenimiento, calidad, cadena de suministro, vulnerabilidades.

| Paquete | Nivel | Puntuaciones |
| --- | --- | --- |
| cli-table3@0.6.5 | 0 | 100 / 81 / 100 / 100 / 100 |
| string-width@4.2.3 | 1 | 100 / 85 / 81 / 100 / 100 |
| @colors/colors@1.5.0 (opcional) | 1 | 100 / 82 / 100 / 100 / 100 |
| emoji-regex@8.0.0 | 2 | 100 / 84 / 91 / 100 / 100 |
| is-fullwidth-code-point@3.0.0 | 2 | 100 / 79 / 77 / 100 / 100 |
| strip-ansi@6.0.1 | 2 | 100 / 80 / 74 / 100 / 100 |
| ansi-regex@5.0.1 | 3 | 100 / 85 / 90 / 100 / 100 |

No hay puntuaciones inferiores a 50 en esta consulta. Las siete versiones coinciden con el lockfile instalado.

## Alertas y campañas

Tras autenticar Socket, la consulta de alertas abiertas de cada nombre de paquete en la organización disponible devolvió una lista vacía, sin páginas adicionales. El filtro de esta herramienta no selecciona versión: este resultado describe la organización consultada y no garantiza ausencia de alertas globales en cada versión.

Para los siete paquetes, la consulta de campañas por nombre y versión devolvió HTTP 403 con código threat_feed_not_entitled: la función no está habilitada en el plan actual de la organización. No se ha comprobado su pertenencia a campañas. Esta parte de la revisión permanece pendiente; las puntuaciones no la sustituyen.

## Iteración del 30 de octubre de 2026 · Plan autorizado

Issue: [#663](https://github.com/venturars/neoland-102026/issues/663). La autorización anticipada de Diego cubre documentación, implementación y comprobación de esta ampliación. Se conserva íntegramente la evidencia anterior.

### Archivos y responsabilidades

- Crear `docs/SOCKET.md` como procedimiento detallado de conexión y revisión. AGENTS y la constitución enlazan esa guía; el agente principal coordina esos documentos compartidos.
- Crear `MCPS/socket-mcp/mcp.txt` con la dirección del servicio y su referencia oficial.
- Crear `.mcp.example.json`, un ejemplo de `mcpServers` sin credenciales para clientes que aceptan ese formato. No es una configuración activa ni se copia sobre configuraciones personales existentes.
- Ampliar este trío con los criterios y resultados de la nueva iteración. No se modifican `package.json`, el lockfile, la lógica ni las credenciales del cliente.

### Autenticación y herramientas

El servidor público oficial es `https://mcp.socket.dev/` y utiliza OAuth del cliente. El token se gestiona en el almacenamiento privado de ese cliente. Se reutiliza la conexión ya autenticada y no se extrae el token, se copia a Git ni se inventa una variable de entorno que la aplicación no lea.

El procedimiento usa las herramientas que realmente publique la conexión: `organizations`, `depscore`, `alerts` y, cuando esté disponible, `threat_feed`. La invocación actual de `depscore` recibe una lista `packages`, con `ecosystem`, `depname` y `version`; no recibe esos tres campos sueltos en la raíz. La autenticación se recupera con la acción disponible del cliente; no se prescribe una herramienta `mcp_auth` inexistente en esta sesión.

Para alertas se utiliza la organización obtenida de `organizations`, el ecosistema, el nombre del paquete y el estado abierto. Se siguen todas las páginas mediante `endCursor`. La consulta no ofrece filtro por versión: un resultado vacío describe el inventario de la organización y no demuestra ausencia global de alertas para esa versión.

### Validación Socket del 30 de octubre de 2026

Consultas reales realizadas por el agente principal en esta sesión, con `platform: win32-x64` para las puntuaciones. La organización devuelta fue `neoland`, slug `neoland-dfnsq`, ID `374037`, plan Free. La respuesta de `organizations` confirma una conexión autenticada; no se inspeccionaron ni copiaron sus credenciales.

Las siguientes versiones y niveles se verifican contra `pnpm-lock.yaml`. El nivel 0 es la dependencia directa; los niveles 1, 2 y 3 son sus dependencias transitivas. La dependencia opcional instalada también se incluye.

| Paquete | Nivel | Licencia | Mantenimiento | Calidad | Cadena de suministro | Vulnerabilidades | Stats < 50 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| cli-table3@0.6.5 | 0 | 100 | 81 | 100 | 100 | 100 | Ninguna |
| string-width@4.2.3 | 1 | 100 | 85 | 81 | 100 | 100 | Ninguna |
| @colors/colors@1.5.0 · opcional | 1 | 100 | 82 | 100 | 100 | 100 | Ninguna |
| emoji-regex@8.0.0 | 2 | 100 | 84 | 91 | 100 | 100 | Ninguna |
| is-fullwidth-code-point@3.0.0 | 2 | 100 | 79 | 77 | 100 | 100 | Ninguna |
| strip-ansi@6.0.1 | 2 | 100 | 80 | 74 | 100 | 100 | Ninguna |
| ansi-regex@5.0.1 | 3 | 100 | 88 | 90 | 100 | 100 | Ninguna |

Alertas: el principal consultó cada uno de los siete nombres con `status: open`, `artifact_type: npm` y `org_slug: neoland-dfnsq`. Las siete respuestas devolvieron `items: []` y `endCursor: null`. No hubo alertas abiertas que comentar en ese inventario; la cobertura no es global ni filtra por versión.

Campañas: una consulta de `threat_feed` para `cli-table3@0.6.5` devolvió HTTP 403 y código `threat_feed_not_entitled`. La capacidad no está habilitada para la organización Free. No se repitió la consulta para las otras seis versiones; no se declara revisada la pertenencia a campañas de ninguna de las siete.

No hay puntuaciones inferiores a 50. La falta de acceso a campañas se mantiene pendiente, sin sustituirla por las puntuaciones o por las alertas organizativas. Como no se añade ni cambia ninguna dependencia, este límite no impide reorganizar las carpetas o completar la guía de conexión. No constituye una aceptación anticipada de futuras dependencias o alertas.

Fuentes: respuestas de las herramientas Socket de esta sesión, el lockfile local y la [documentación oficial del servidor remoto](https://docs.socket.dev/docs/remote-socket-mcp), consultada por el agente principal el 2026-10-30. Las consultas no se atribuyen a Diego.

### Comprobación prevista

1. Validar el JSON del ejemplo y confirmar que contiene solo la conexión pública sin cabeceras de autenticación ni secretos.
2. Revisar UTF-8, enlaces locales y concordancia del árbol de dependencias con el lockfile.
3. Comprobar que la guía diferencia autenticación, puntuaciones, alertas organizativas y campañas pendientes.
4. Comparar con la versión anterior para confirmar que los resultados del 27 de octubre permanecen intactos y no cambian paquetes, lockfile, código o datos por este bloque.

No se instala un paquete ni se ejecuta el cliente de negocio por esta ampliación documental. Los comandos de ejecución de la aplicación siguen en la constitución.
