# Plan — acceso a Socket y cobertura de alertas

Issue: #664 · PR: #665.
Estado: aprobado por Miguel el 2026-10-30.
Referencia: [spec aprobada](spec.md).

## Enfoque

Completar la referencia y explicación de acceso de first-app-ai, sin cambiar el
procedimiento de validación ya aprobado. El MCP remoto funciona mediante OAuth;
no añadir un bearer token a esa conexión ni leer el token local existente.

Referencia de clase: `socket-mcp-reference` de Ventura (#583), adaptada a nuestra
organización `neoland` y a las reglas propias. No copiar su organización
`ai-engineering` ni su simplificación de revisiones. La fuente pública consultada
es https://docs.socket.dev/docs/remote-socket-mcp, que describe OAuth para el MCP
remoto. Una API separada puede requerir credenciales distintas.

No hay función, firma, consulta SQL, dependencia ni error de aplicación nuevo.
Este desarrollo no incorpora paquetes; no requiere auditar sus tres capas para
aprobar este plan ni supone aceptar hallazgos de futuras propuestas.

## Archivos — CA-01, CA-02, CA-03, CA-05, CA-06

Rutas relativas a `staff/miguel-rodriguez/first-app-ai/`:

| Archivo | Cambio permitido |
| --- | --- |
| `MCPS/socket-mcp/mcp.txt` | Crear con la URL oficial de la documentación remota, sin token, headers privados ni configuración local. |
| `docs/CONSTITUTIONS.md` | Añadir una subsección breve bajo dependencias: enlace a la referencia, acceso OAuth, fuentes y límites descritos abajo; remitir al procedimiento detallado existente de AGENTS. |
| `docs/ARCHITECTURE.md` | Añadir la responsabilidad de la referencia Socket junto a la de GitHub; aclarar que es documentación, no una conexión instalada ni un almacén de credenciales. |
| `docs/TREE.md` | Añadir la referencia Socket y spec/plan/tasks de este desarrollo al inventario de fuentes. |
| `docs/specs/socket-mcp-access/` | Spec aprobada, este plan y, tras aprobarlo, las tareas con su evidencia fechada. |

Mantener intactos AGENTS y sus nueve pasos Socket, README, src, scripts, tools,
skills, agentes, plantillas, GitHub MCP, ignore, lint, package, lockfile,
requirements y specs históricas. No modificar configuración de Codex ni otras
aplicaciones. Si se descubre un conflicto que exige ampliar estos archivos,
volver a revisar el plan antes de hacerlo.

## Texto y responsabilidades — CA-01, CA-02, CA-03, CA-05

La constitución conserva las reglas de paquetes y el enlace actual a AGENTS.
Añadir únicamente la explicación necesaria para usar e interpretar las fuentes:

- Referencia relativa `../MCPS/socket-mcp/mcp.txt`, que apunta a la documentación
  oficial. El servidor remoto es `https://mcp.socket.dev/`; el acceso actual usa
  OAuth en Codex, sin exigir una API key adicional para ese MCP.
- `organizations` identifica las organizaciones accesibles. `neoland` es el slug
  observado en esta cuenta, no una constante universal ni un permiso garantizado.
- `depscore` informa puntuaciones de versiones exactas. Separar puntuaciones de
  alertas y campañas; conservar cinco dimensiones, escala y umbral inferior a50.
- `alerts` informa de paquetes monitorizados en una organización. Registrar
  filtros, estados y paginación; una lista vacía solo acredita lo consultado.
- La comprobación por versión mantiene la API o informe verificado y el alcance
  de AGENTS. Su autenticación es independiente del OAuth MCP; no se valida en esta
  tarea ni se deducen permisos de la existencia de un archivo local.
- `threat_feed` tiene su propia cobertura y permisos. Un403
  `threat_feed_not_entitled` significa que el feed no está incluido; no demuestra
  ausencia de campañas. Conservar la distinción entre feed y fuentes de campañas,
  la cobertura limitada y la decisión humana de la propuesta concreta.
- Un error, una página incompleta o un dato ausente se registra con su motivo;
  no equivale a un resultado sin hallazgos.

No duplicar el algoritmo de revisión de tres capas ni trasladarlo desde AGENTS.
La subsección nueva no altera sus reglas de paquetes ya presentes, resolución
exacta, alertas sin ocultar, límites de campañas, aceptación humana y comparación
posterior del lockfile. Las observaciones cambiantes quedan en la evidencia de
este desarrollo; la constitución explica cómo interpretarlas.

## Diagnóstico anterior — CA-04

Observado el30 de octubre de2026 en esta conversación, antes de esta entrega:

| Fuente y consulta | Resultado observado | Límite |
| --- | --- | --- |
| `organizations({})` | neoland, id373697, plan free | Identifica acceso organizativo; no prueba alertas por versión. |
| `alerts({org_slug:"neoland",per_page:100})` | items[], endCursor null; metadata alertStatus open | Solo alertas abiertas. No prueba estados no consultados ni cualquier versión. |
| `threat_feed({org_slug:"neoland",ecosystem:"npm",per_page:1})` |403, código threat_feed_not_entitled | Acceso al feed denegado; no ausencia de amenazas o campañas. |

La documentación oficial remota describe OAuth. En la preparación se comprobó
solo que había un archivo local de token no vacío; no se leyó su contenido ni se
probó autenticación API con él. No usar esa comprobación como evidencia de permisos.

## Verificación de fuentes — CA-02, CA-03, CA-04

Durante la implementación repetir lecturas reales del MCP y registrar fecha,
parámetros, metadata útil, resultados, errores y cobertura. No modificar la
conexión ni provocar resultados. Si la sesión ya no responde, conservar el fallo
como bloqueo de la verificación, sin sustituir autenticación por otra vía.

1. Llamar a `organizations({})`. Confirmar acceso a neoland; si no aparece,
   informar y detener las consultas dependientes, sin usar el slug de Ventura.
2. Consultar `alerts` con org_slug neoland, per_page100 y status open explícito.
   No filtrar gravedad, categoría, artefacto ni repo. Seguir endCursor hasta null;
   una interrupción queda como cobertura parcial, no como consulta completa.
3. Repetir para status cleared por separado. Mantener ambos resultados separados:
   no presentar esos dos estados como todos los estados posibles de otros APIs.
   Una alerta cleared no equivale a un hallazgo abierto actual.
4. Consultar una versión exacta existente, `openai@7.39.0` (npm), con depscore
   como comprobación de la fuente, sin auditar todo el lockfile ni aprobar riesgos.
   Registrar las puntuaciones disponibles y campos ausentes; no atribuirle alertas
   o campañas. Si package.json ya no coincide, revisar la selección antes de llamar.
5. Consultar threat_feed con org_slug neoland, ecosystem npm y per_page1. Registrar
   también el filtro efectivo de la herramienta (mal por defecto). Si sigue
   devolviendo403, registrar código y motivo una vez, sin reintentos ni cambios
   de plan de pago. Si responde, registrar únicamente la muestra/paginación
   realmente consultada, no una revisión completa del feed o de campañas.

La API por versión y las fuentes completas de campañas se describen conforme al
procedimiento vigente, pero no se llaman para realizar una auditoría de paquetes
sin propuesta ni se leen tokens para hacerlo. Escribir expresamente «no verificado
en esta tarea» para esas fuentes. Preservar la regla de cobertura limitada de
campañas; el403 observado del feed no se presenta como una nueva comprobación de
la API de campañas ni de su dashboard.

Si la lista o los permisos cambian, la comprobación puede pasar cuando el resultado
se haya interpretado y registrado correctamente. No exigir items[] ni403 como
condición de éxito. Esta tarea verifica acceso y explicación, no seguridad total.

## Revisión de documentos y conservación — CA-01, CA-05, CA-06

Antes de editar, guardar inventario y hashes de fuentes; el único añadido actual
es la spec de este desarrollo. Comparar después los archivos protegidos y el
estado Git para asegurar que no hay cambios fuera de los documentos enumerados.

Comprobar que los enlaces relativos desde constitución, arquitectura y árbol
llegan a la referencia correcta; TREE puede representarla como entrada de árbol.
Abrir la referencia oficial y confirmar que no se ha sustituido por un enlace de
inicio de sesión, configuración privada o API con credenciales.

Releer la nueva explicación frente a los nueve pasos de AGENTS: versiones exactas,
tres capas totales con paquetes existentes dentro de ellas, cinco puntuaciones,
valores inferiores a50, alertas no ocultadas, carencias expresas, aceptación
específica y comparación posterior del lockfile. AGENTS queda byte a byte igual;
las aprobaciones SDD siguen siendo separadas.

En una copia desechable sin base ni secretos, con las dependencias exactas
existentes, ejecutar pnpm format y después pnpm lint. No instalar paquetes ni
cambiar versiones para una tarea documental. Comparar el código antes y después
del formateo: no incorporar modificaciones de aplicación a esta entrega.
Registrar comandos y resultados reales en tasks y retirar la copia temporal.

## Cierre de preparación

Revisado contra #664 y la spec: alcance documental y consultas de lectura,
autenticación conservada y resultados con cobertura explícita. El plan no promete
resolver las restricciones de la cuenta ni acreditar alertas de cada versión.
Las tareas requieren su aprobación independiente antes de implementar.

La PR #665 conserva staging como base. Commits, push y solicitudes de revisión
solo se ejecutan cuando Miguel pida el momento correspondiente del flujo Git.
