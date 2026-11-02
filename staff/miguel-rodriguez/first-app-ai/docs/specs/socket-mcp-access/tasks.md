# Tareas — acceso a Socket y cobertura de alertas

Issue: #664 · PR: #665.
Estado: aprobadas por Miguel el 2026-10-30.
Referencias: [spec aprobada](spec.md) y [plan aprobado](plan.md).

Implementar solo después de aprobar estas tareas y recibir la petición de hacerlo.
Las consultas son de lectura; no modificar autenticación ni leer tokens locales.
No confundir verificar el acceso con aprobar riesgos de una dependencia.

## Preparación y consultas reales

- [x] **T01 · Inventario y alcance — CA-05, CA-06.** Confirmar rama664 y estado
  Git. Guardar inventario/hashes de fuentes, identificando los documentos de esta
  tarea aún sin seguimiento. Revisar AGENTS y los archivos previstos por el plan.
  Resultado: punto de comparación que permite detectar cualquier cambio ajeno.
- [x] **T02 · Referencia oficial — CA-01, CA-02.** Consultar la documentación
  oficial remota de Socket indicada en el plan. Confirmar su descripción de OAuth
  y dirección del servidor; registrar fecha y fuente. No copiar configuración
  privada ni abrir/leer el token local. Resultado: referencia pública y afirmaciones
  de acceso respaldadas, sin sustituir la conexión existente.
- [x] **T03 · Organización accesible — CA-02, CA-04.** Llamar realmente a
  organizations({}). Registrar organización, slug, plan y resultado o error sin
  secretos. Si neoland no aparece, detener las consultas dependientes y comunicar
  el impedimento; no usar ai-engineering ni otro slug para simular éxito.
  Resultado: organización de esta cuenta identificada o verificación pendiente.
- [x] **T04 · Alertas abiertas — CA-03, CA-04.** Consultar alerts con
  org_slug neoland, per_page100 y status open explícito, sin filtros de gravedad,
  categoría, artefacto o repositorio. Seguir endCursor hasta null; si se interrumpe,
  registrar cobertura parcial. Resultado: fecha, parámetros, filtros efectivos,
  estado, páginas y resultados o error; ningún vacío se interpreta como ausencia
  de alertas por versión o en estados no consultados.
- [x] **T05 · Alertas cleared — CA-03, CA-04.** Repetir por separado la consulta
  con status cleared y la misma paginación. Resultado: registros separados de
  abiertas y cleared, sin presentar cleared como hallazgos abiertos actuales ni
  ambos estados como cobertura de cualquier otro API.
- [x] **T06 · Fuente de puntuaciones — CA-03, CA-04.** Confirmar en package.json
  que openai sigue fijado a7.39.0. Consultar depscore para npm/openai7.39.0 como
  comprobación de esa fuente, sin auditar el resto del lockfile. Registrar identidad,
  cinco puntuaciones disponibles, valores inferiores a50 y datos ausentes;
  distinguirlos de alertas/campañas. Si la versión no coincide, revisar la selección
  antes de consultar. Resultado: evidencia limitada a esas puntuaciones; ninguna
  aceptación de riesgos ni instalación.
- [x] **T07 · Acceso al feed — CA-03, CA-04.** Consultar threat_feed con
  org_slug neoland, ecosystem npm y per_page1. Registrar filtro mal por defecto y
  demás parámetros efectivos conocidos. Si devuelve403, anotar el código y motivo
  una vez, sin reintentos ni cambios de plan. Si responde, registrar la muestra y
  cursor recibidos sin afirmar cobertura completa. Resultado: disponibilidad y
  alcance observados, separados de una comprobación de campañas.
- [x] **T08 · Consolidar diagnóstico — CA-03, CA-04.** Conservar la observación
  inicial del30 de octubre de2026 y registrar aparte las consultas de T03–T07 con
  fecha, fuentes, parámetros, alcance, paginación, hallazgos y errores. Si cambian
  los resultados, registrar el cambio sin exigir lista vacía o403 para pasar.
  Indicar expresamente que la API de alertas por versión y las fuentes completas
  de campañas no se verificaron en esta tarea. Resultado: ningún resultado ajeno
  atribuido al MCP y ninguna carencia convertida en ausencia de hallazgos.

## Documentación

- [x] **T09 · Referencia pública — CA-01, CA-02.** Crear
  MCPS/socket-mcp/mcp.txt con la URL oficial del plan. Resultado: referencia legible,
  sin secretos, tokens, headers privados ni configuración del portátil.
- [x] **T10 · Constitución — CA-01, CA-02, CA-03, CA-05.** Añadir la subsección
  breve prevista en dependencias, con enlace relativo a la referencia, OAuth
  actual, distinción de fuentes y sus límites. Mantener el enlace a AGENTS y no
  duplicar ni sustituir sus nueve pasos. Resultado: explicación coherente sin
  reemplazar OAuth, exigir API key MCP ni declarar verificados permisos API.
- [x] **T11 · Arquitectura — CA-01, CA-06.** Añadir junto a la referencia GitHub
  la responsabilidad de la de Socket. Resultado: se entiende que es documentación,
  no una conexión instalada ni almacén de credenciales; resto del documento intacto.
- [x] **T12 · Árbol — CA-01, CA-06.** Añadir la referencia Socket y los tres
  documentos de este desarrollo a TREE, sin inventariar datos o archivos locales.
  Resultado: rutas reales del cambio incluidas; estructura restante conservada.

## Revisión y verificación

- [x] **T13 · Enlaces y fuentes — CA-01, CA-02.** Comprobar las rutas desde
  constitución, arquitectura y árbol a la referencia y su URL pública. La entrada
  de árbol puede representarla sin un enlace Markdown. Resultado: referencias
  válidas, sin URL de login, API privada ni credenciales.
- [x] **T14 · Política e interpretación — CA-03, CA-05.** Contrastar el texto
  nuevo con los nueve pasos intactos de AGENTS: versiones exactas, tres capas con
  paquetes existentes dentro de ellas, puntuaciones y umbral inferior a50,
  cobertura de alertas sin ocultar, campañas limitadas, decisión humana específica
  y comparación posterior del lockfile. Revisar los casos de lista abierta vacía,
  cleared, puntuación ausente,403 y paginación parcial. Resultado: fuentes y límites
  separados, ninguna reducción de controles ni aprobación de riesgos futuros.
- [x] **T15 · Formato y lint — CA-06.** En copia desechable sin base ni secretos,
  reutilizar las dependencias exactas existentes sin escribir en su instalación
  original. Ejecutar pnpm format y después pnpm lint; no instalar paquetes ni
  modificar versiones. Comparar el código antes/después del formateo. Resultado:
  ambos pasan y ningún cambio ejecutable se incorpora a la entrega.
- [x] **T16 · Comparación final — CA-01 a CA-06.** Comparar inventario, hashes
  y estado con T01. Solo cambian los documentos enumerados en el plan. Confirmar
  AGENTS byte a byte igual y conservación de src, dependencias, lockfile,
  requirements, autenticación, flujo Git y specs históricas. Resultado: alcance
  documental íntegro, sin datos ni secretos incorporados.
- [x] **T17 · Evidencia y limpieza — CA-01 a CA-06.** Completar el registro
  siguiente con resultados reales, incluyendo fuentes no verificadas y fallos.
  Retirar la copia de herramientas y temporales propios; preservar instalaciones
  y configuración originales. Resultado: distinguir comprobado, pendiente y
  bloqueado; no marcar consultas fallidas como verificación satisfactoria del acceso.

## Entrega posterior

- [ ] **T18 · Publicación autorizada — CA-06.** Solo cuando Miguel pida guardar
  y publicar, delegar commits pequeños y push de los archivos explícitos de esta
  tarea. Actualizar #665 con alcance, resultados y límites reales; conservar base
  staging y Closes #664/Development. Resultado: entrega publicada y comprobada.
  No solicitar revisores hasta que Miguel los indique, ni cambiar base, fusionar
  o cerrar automáticamente. No añadir un commit posterior solo para marcar casillas
  después de recibir aprobaciones.

## Evidencia

Implementación documental y verificación completadas el 2026-10-30; publicación
pendiente. Las consultas anteriores que figuran en el plan son
un diagnóstico de preparación; no acreditan la repetición de T03–T07 ni una
comprobación de API por versión o campañas en esta tarea.

Registrar para cada consulta fecha, herramienta, parámetros y filtros efectivos,
organización cuando corresponda, páginas/cursor y resultado o error. No guardar
credenciales ni volcar configuración privada. Registrar también las comprobaciones
de documentación, conservación y herramientas con sus comandos y resultados.
La publicación posterior se acredita con sus registros y GitHub.

### Ejecución y resultados — 2026-10-30

T01: rama664, HEAD b3c06c02, tres documentos SDD de esta tarea como único trabajo
previo sin seguimiento. Inventario y SHA-256 de115 archivos versionados. No se
leyeron credenciales ni configuración privada durante esta implementación.

T02: consultada https://docs.socket.dev/docs/remote-socket-mcp el30 de octubre
de2026. Describe autenticación OAuth y servidor https://mcp.socket.dev/, sin
exigir una API key adicional para ese MCP. Se conservó la conexión existente.

T03–T08: consultas reales mediante el MCP socket-mcp, separadas del diagnóstico
inicial del plan; resultados observados en esta ejecución:

| Herramienta y parámetros enviados | Resultado | Cobertura |
| --- | --- | --- |
| organizations({}) | neoland, id373697, plan free | Organización accesible; no prueba permisos de una API independiente. |
| alerts({org_slug:"neoland",per_page:100,status:"open"}) | items[], endCursor null, metadata alertStatus [open]; una página | Alertas abiertas monitorizadas por esa organización, sin filtros adicionales de gravedad/categoría/artefacto/repo. |
| alerts({org_slug:"neoland",per_page:100,status:"cleared"}) | items[], endCursor null, metadata alertStatus [cleared]; una página | Estado cleared consultado por separado; no equivale a alertas abiertas ni a todos los estados de cualquier API. |
| depscore({packages:[{depname:"openai",ecosystem:"npm",version:"7.39.0"}]}) | pkg:npm/openai@7.39.0; supplyChain75, vulnerability100, quality100, maintenance100, license100 | Cinco puntuaciones disponibles, ninguna inferior a50. No aporta alertas ni campañas ni acepta riesgos. Versión contrastada con package.json sin cambiarlo. |
| threat_feed({org_slug:"neoland",ecosystem:"npm",per_page:1}) |403 threat_feed_not_entitled; mensaje: el threat feed no está habilitado para esta organización | Filtro mal por defecto según la herramienta. Consulta denegada, sin resultados/cursor; acceso al feed no acreditado y sin reintentos. |

En alerts, endCursor null agotó la paginación de cada consulta en una página;
no hizo falta otra llamada. El error del feed está registrado como restricción,
no como acceso satisfactorio ni resultado sin hallazgos. T07 está completada como
comprobación de disponibilidad: su resultado fue denegado. No se compraron permisos
ni se cambió la autenticación. El enlace informativo devuelto por depscore fue
https://socket.dev/npm/package/openai; su URL no fija versión, por lo que la
identidad exacta se acredita por la respuesta pkg:npm/openai@7.39.0, no por esa URL.

API de alertas por versión: no verificada en esta tarea. Fuentes completas de
campañas y dashboard: no verificados en esta tarea. Se mantiene
«campaigns: coverage limited by the Socket plan». El403 del feed no acredita
una consulta de la API de campañas ni ausencia de campañas. No se auditó todo
el lockfile, se incorporaron paquetes ni se aprobaron riesgos de una propuesta.

T09–T14: creada la referencia pública con una sola URL; enlaces relativos desde
constitución y arquitectura válidos, referencia y desarrollo presentes en TREE.
La nueva subsección de constitución distingue OAuth/fuentes sin duplicar el
procedimiento de AGENTS. Al quitar esa subsección se recupera exactamente el
texto original. AGENTS y sus nueve pasos conservados byte a byte, incluidas tres
capas, paquetes presentes dentro de ellas, versiones exactas, umbral inferior a50,
alertas sin ocultar, carencias, decisión humana y comparación del lockfile.

T15: `python3 /tmp/neoland-664/check.py` preparó una copia sin datos ni secretos
y con las dependencias existentes copiadas. Ejecutó, en orden,
`pnpm --config.verifyDepsBeforeRun=false format` y
`pnpm --config.verifyDepsBeforeRun=false lint`: salida0 en ambos. Esa opción
evita una reinstalación automática en la copia; no altera configuración ni
versiones. Los13 archivos JS conservaron sus hashes después de formatear.

T16–T17: de115 originales solo cambiaron docs/CONSTITUTIONS.md,
docs/ARCHITECTURE.md y docs/TREE.md; los otros112 son idénticos. Añadidos: una
referencia pública y los tres documentos SDD de esta tarea. Código, dependencias,
lockfile, requirements, Git, Socket en AGENTS y specs históricas intactos.
git diff --check correcto. Copia de formato, inventario y ejecutor temporal
retirados tras registrar los resultados. No hubo commits, push, solicitudes de
revisión ni cambios de base. T18 queda pendiente de autorización de publicación.

### Revisión final y publicación solicitada — 2026-10-30

Miguel pidió revisar y guardar la entrega; solicitará de nuevo las revisiones
después. Revisión final sin bloqueos:112 originales protegidos idénticos y solo
las tres guías previstas modificadas, referencia y enlaces válidos, constitución
original recuperable al retirar la subsección añadida. Formato/lint ya pasaron
sin cambios posteriores de código. #665 conserva base staging; antes de esta
publicación no tenía reviews completadas, aunque ya había solicitudes y estaba
fuera de draft. Se conservan base y estado, sin nuevas solicitudes. La ejecución
de commits/push quedará acreditada por los registros reales, sin otro commit
solo para cambiar casillas.
