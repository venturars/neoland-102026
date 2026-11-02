Issue: #751

# Resultados de la spec 008

T01–T55 completadas en `751-chore-asistenciapp-git-five-stages`, con implementación, enmienda 3.1 y ensayos locales expresamente autorizados. Commit selectivo, push de esta rama y PR draft contra staging autorizados; publicación pendiente. Sin revisores ni merge. Al cerrar las comprobaciones de implementación, HEAD seguía en `50094711`, sin cambios preparados ni publicación de esta entrega.

## Diff de la entrega

53 archivos de AsistenciApp: 4 existentes modificados y 49 nuevos, incluidos los cuatro documentos de la 008. Ningún cambio de contenido fuera de la aplicación.

- Siete agentes, quince skills y referencia MCP con alternativa gh; lectura explícita de reglas, delegación real cuando se utilice el flujo y autorizaciones separadas.
- Ocho archivos de herramientas PowerShell y un ensayo aislado. Controles de rama, avance rápido, worktrees, colisiones, índice temporal, hooks y errores nativos. Tipos de rama sin lista fija ni exigencia de plantilla existente.
- Doce plantillas idénticas a la fuente fijada en `50094711`. No quedan referencias genéricas en los componentes operativos.
- Constitución 3.1, guía de agentes, arquitectura y guía de automatización actualizadas. Se conservan P1–P6, stack, calidad, seguridad y entradas anteriores de la constitución.
- Ajuste mínimo de las puertas SDD y versión constitucional en `tests/test_sdd_rules.py`; se añaden comprobaciones de orden y de las invariantes conservadas. No se eliminan ni se saltan pruebas.

## Comprobaciones ejecutadas

| Comprobación                                                                                             | Resultado                                                                                                                                                                      |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `.venv/Scripts/python.exe -m pytest tests/test_sdd_rules.py -k "sdd_gates or constitution_amendment" -q` | 11 aprobadas; 29 casos no seleccionados por estar fuera de las comprobaciones afectadas. No es una ejecución de la suite funcional.                                            |
| `powershell.exe -NoProfile -ExecutionPolicy Bypass -File tools/tests/test-git-automation.ps1`            | 64 comprobaciones aprobadas, exclusivamente en repositorios desechables con remoto local. Repositorios conservados para inspección.                                            |
| Parser PowerShell sobre tools y tools/tests                                                              | 9 archivos aceptados. UTF-8 con BOM en scripts para Windows PowerShell 5.1; validación localizada comprobada después del ajuste de codificación.                               |
| check-status desde raíz y desde AsistenciApp                                                             | Salida 0 y rama correcta; sin fetch ni mutaciones. La ejecución desde una ruta con espacios también está incluida en el ensayo desechable.                                     |
| Comparación de plantillas y estructura                                                                   | 12 coincidencias byte a byte; seis parejas con secciones, dos casillas sin marcar en cada PR y marcador de cierre retirable localmente.                                        |
| Conservación                                                                                             | Hashes de 191 archivos protegidos, incluidas las pruebas funcionales, las specs anteriores, otra aplicación y las bases locales, sin cambios.                                  |
| ChromaDB                                                                                                 | 27.292 archivos conservan nombres, tamaños y fechas. Ese inventario no es un hash del contenido. Continúa sin seguimiento.                                                     |
| Pruebas existentes conservadas                                                                           | AST de las tres funciones de ámbito e integridad y las expectativas de hashes de specs anteriores idénticos a la base; no se ejecutaron por ser ajenas al cambio.              |
| Documentos y alcance                                                                                     | Revisión del formato nuevo, enlaces y espacios del diff, incluidos archivos nuevos. Se conserva el formato de secciones preexistentes ajenas para evitar cambios innecesarios. |

El ensayo local verifica aislamiento del repositorio real y rechazo de rutas externas y remotos de red. Comprueba nombres de rama con tipo sin plantilla y nombre explícito, inputs inválidos, recuperación local y remota, otra base y ramas protegidas. Comprueba avance rápido conservando la rama actual, divergencia, otro worktree, cambios versionados, operación Git pendiente y colisiones ignoradas y sin seguimiento con conservación de bytes.

Los commits de ensayo comprueban apertura vacía, selección de archivo con espacios y conservación del índice ajeno. Se rechazan ampliaciones de rutas, ramas inesperadas y hooks activos sin ejecutarlos o desactivarlos. El push local confirma upstream y SHA; un remoto adelantado produce rechazo sin fuerza ni reescritura. Los errores nativos se propagan.

## Revisión estática y límites

Se recorrieron los siete agentes y las quince skills en lectura para los cinco momentos y sus pausas. Para feat, fix, docs, refactor, test y chore se usa su plantilla; para mantenimiento con un tipo sin plantilla se elige la más cercana sin introducir una regla de renombrado. La generación local con `maintenance` está probada por separado.

Create-pr usa el título de la issue, draft contra staging y casillas sin marcar; retira el marcador antes del alta. El orquestador añade después una referencia real única y verifica Development por separado. La revisión comprueba responsabilidades, relectura tras errores, identidad y alternativa autenticada, pero no acredita ejecución integral de agentes ni escrituras remotas.

No se crearon issues, PR ni solicitudes de revisión de prueba, ni se modificaron conexiones, credenciales o configuración personal. No se ejecutaron pruebas funcionales, ejemplos ni servidores, ni se abrieron las bases reales. No hay comprobaciones pendientes del alcance local autorizado; estos resultados no acreditan una interacción integral con GitHub.

## Autorización de publicación

Se autorizó guardar y publicar selectivamente la entrega en su rama existente y abrir una PR draft contra staging, usando la plantilla chore, casillas sin marcar y una única referencia real de cierre. El resultado del cuerpo y de Development se verificará por relectura y se registrará después de la publicación. No se autorizaron revisores ni merge. Los ajustes de estado documental se comprueban en formato y diff; no se repiten las pruebas satisfactorias de implementación.
