# Socket: conexión y revisión de paquetes

Socket se usa durante la preparación de un cambio de dependencias. No forma parte de la aplicación ni recibe los usuarios guardados en su base. Las reglas comunes están en la [constitución](CONSTITUTIONS.md#paquetes) y la evidencia de cada revisión se registra en el plan del desarrollo correspondiente.

## Conexión y token privado

El servidor público es `https://mcp.socket.dev/`. La [documentación oficial](https://docs.socket.dev/docs/remote-socket-mcp) indica autenticación mediante OAuth: el cliente MCP abre el acceso a Socket y conserva el permiso en su almacenamiento privado. No hace falta copiar una API key al proyecto para esa conexión pública.

El [ejemplo de configuración](../.mcp.example.json) contiene únicamente el endpoint y utiliza el formato `mcpServers`, aceptado por clientes como Cursor. Es una referencia, no una configuración activa. Otros clientes deben usar su formato equivalente o la conexión que ya tengan configurada.

Antes de añadir una conexión, comprobar si ya existe. Conservar los otros servidores y la configuración personal. Si la sesión necesita acceso, usar la acción de autenticación que ofrezca el cliente y repetir la comprobación. No asumir que hay una herramienta llamada `mcp_auth` ni cambiar archivos globales por iniciativa del agente.

El token no se imprime, no se copia de la configuración y no se guarda en Git, una spec, un notebook, una variable de ejemplo o una captura. El ejemplo no contiene cabeceras ni un token ficticio que parezca una credencial utilizable.

La primera comprobación es llamar a `organizations`. Una respuesta válida identifica las organizaciones accesibles y sus `slug`. Tener una URL configurada o un archivo de referencia no demuestra que la autenticación funcione.

La conexión de esta sesión respondió el 2026-10-30 con la organización `neoland`, slug `neoland-dfnsq`, plan Free. Esa evidencia confirma el acceso de esta sesión; no garantiza que otro equipo o cliente ya tenga el mismo permiso.

## Qué se revisa

Antes de aceptar un plan que añade un paquete de Node o cambia su versión:

1. Identificar la versión exacta del paquete directo, nivel 0.
2. Resolver sus dependencias transitivas hasta los niveles 1, 2 y 3, incluidas las opcionales instaladas. Usar el lockfile para las versiones ya resueltas; cuando falte una versión, resolver el rango desde el registro y registrar la elegida.
3. Consultar cada combinación de nombre y versión una sola vez, aunque aparezca en más de un camino.
4. Separar puntuaciones, alertas y campañas. Cada resultado indica la fuente y su cobertura.

No entran paquetes de Python, versiones que el cambio no modifica ni niveles posteriores al tercero. Los comandos de ejecución de la aplicación se consultan en la [constitución](CONSTITUTIONS.md#ejecución).

## Herramientas del servidor

El nombre completo de cada herramienta puede cambiar con el alias de la conexión. El agente debe localizar la herramienta que realmente publica su cliente y leer sus argumentos actuales.

### Organizaciones

`organizations` no recibe argumentos en la conexión actual. Devuelve los `slug` que necesitan las herramientas de organización. No se inventa uno a partir del nombre visible.

### Puntuaciones

`depscore` recibe una lista `packages` con nombres y versiones exactas. Este ejemplo de argumentos muestra la estructura actual; el comentario explicativo queda fuera del JSON para mantenerlo válido:

```json
{
  "packages": [
    {
      "ecosystem": "npm",
      "depname": "cli-table3",
      "version": "0.6.5"
    }
  ],
  "platform": "win32-x64"
}
```

Se anotan las puntuaciones disponibles de licencia, mantenimiento, calidad, cadena de suministro y vulnerabilidades. Una puntuación menor de 50 es un aviso: 49 está por debajo del umbral y 50 no. Un campo ausente se registra como no disponible. Las puntuaciones no enumeran alertas ni sustituyen su consulta.

### Alertas

`alerts` recibe el `org_slug` obtenido, `artifact_type: npm`, `artifact_name` con el nombre del paquete y `status: open`. Si devuelve `endCursor`, repetir la consulta con ese valor en `cursor` hasta agotar las páginas.

La herramienta actual filtra por nombre, no por versión. Una lista vacía de una organización no equivale a un informe global de la versión instalada. Si la respuesta permite asociar una alerta a la versión revisada, registrar esa relación; si no, señalar la limitación.

Las alertas relevantes se explican en lenguaje claro: paquete y versión, tipo, severidad si viene, qué conducta detecta y qué parte del cambio afecta. La persona responsable decide si las acepta. Una autorización general de trabajo no significa aceptar por adelantado una alerta que todavía no conoce.

### Campañas

`threat_feed`, cuando el plan lo permite, recibe `org_slug`, `ecosystem: npm`, `name` y `version`. Si hay páginas adicionales, usar `nextPageCursor` como `cursor`.

Un error de autenticación, un permiso insuficiente o `threat_feed_not_entitled` se documenta con su código y alcance. No se interpreta como una búsqueda sin coincidencias. Si el servicio confirma que la capacidad no está habilitada para la organización, no hace falta repetir la misma comprobación de acceso para cada dependencia; las consultas no realizadas siguen constando como no comprobadas.

## Informe y decisión

El plan del desarrollo contiene una sección de validación con una fila por nombre y versión:

| Dato | Qué se registra |
| --- | --- |
| Paquete y nivel | Nombre, versión exacta, nivel 0–3 y si es opcional instalado. |
| Puntuaciones | Los cinco valores disponibles y cuáles son menores de 50. |
| Alertas | Hallazgos, filtro usado, organización y páginas revisadas; limitación de versión cuando exista. |
| Campañas | Coincidencias o resultado de la consulta; si no pudo hacerse, motivo y código del error. |
| Evidencia | Fecha, herramientas y fuentes, quién hizo las consultas y decisión de la persona responsable cuando sea necesaria. |

Una consulta sin acceso o sin cobertura se marca pendiente. No se inventa un resumen para aceptar un paquete nuevo ni se cambia de fuente en silencio. Las alertas abiertas o la cobertura incompleta se presentan para su decisión antes de incorporar la dependencia. Se conserva la distinción entre una comprobación realizada por el agente y una aprobación de la persona.

La [revisión registrada de esta aplicación](specs/socket-package-validation/plan.md#validación-socket-del-30-de-octubre-de-2026) contiene siete versiones sin puntuaciones inferiores a 50, siete consultas de alertas organizativas vacías y un intento de campañas rechazado porque la organización no tiene esa capacidad. Las campañas siguen sin comprobarse; esta actualización de guías no añade ni cambia paquetes.
