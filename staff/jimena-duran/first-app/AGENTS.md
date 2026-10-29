# AGENTS.md — first-app

El flujo de Git entra por [agents/git-workflow-agent.md](agents/git-workflow-agent.md). La guía de uso está en [docs/GIT-AUTOMATION.md](docs/GIT-AUTOMATION.md). Las autorizaciones y las pausas de esta app prevalecen sobre cualquier secuencia automática.

## Orden

1. El orquestador reconoce el momento y lanza al subagente correspondiente como agente real, con las instrucciones de su archivo. El padre coordina; no sustituye al agente de ese momento. Si no hay delegación disponible, informa y se detiene para acordar cómo continuar.
2. La issue existe antes de crear `docs/specs/<nombre>/`, con `<nombre>` en kebab-case. La spec abre con `Issue: #N`.
3. Con la issue, preparar únicamente `spec.md` y `plan.md`. Detenerse para revisión humana. Si las fuentes discrepan, registrar la duda al final del plan; no crear tareas ni implementar.
4. Tras aprobar spec y plan, preparar `tasks.md` y detenerse otra vez para su revisión. La implementación comienza solo cuando la persona la autoriza; ejecuta las tareas aprobadas sin inventar otras.
5. La rama se toma de cada tarea y de su autorización. No fijar nombres de ramas personales en componentes reutilizables. Un permiso para implementar no autoriza por sí solo commit, push, PR ni merge.

## Guías del proyecto

Las reglas generales y los enlaces a las guías por tema están en [CONSTITUTIONS.md](docs/CONSTITUTIONS.md). Para escribir código, sigue [STYLE.md](docs/STYLE.md).

## Comandos disponibles

- Ejecución: todavía no existe un comando de ejecución.
- Pruebas de la aplicación: el script `test` de `package.json` es solo el marcador de pnpm. Las comprobaciones aisladas de Git están en `tools/tests/`; requieren autorización para los commits y publicaciones en sus repositorios temporales, según [GIT-AUTOMATION.md](docs/GIT-AUTOMATION.md).
- Formato: `pnpm format` ejecuta Prettier con sus opciones predeterminadas; las reglas están en [STYLE.md](docs/STYLE.md). `pnpm lint` revisa el JavaScript con ESLint.

## Reglas de trabajo

- Antes de editar código, lee `docs/CONSTITUTIONS.md` y la spec que esté activa.
- Trabaja con temperatura cercana a cero: sigue la spec y el plan, sin inventar requisitos.
- Investiga primero y revisa si existe una tarea semejante ya resuelta. El código existente sirve de referencia para encontrar operaciones parecidas; el estilo se toma de [STYLE.md](docs/STYLE.md). Las diferencias de estilo del código existente no bloquean una nueva spec.
- Si un desarrollo añade o elimina archivos, su spec debe contemplar la actualización de [TREE.md](docs/TREE.md) y [ARCHITECTURE.md](docs/ARCHITECTURE.md).
- Si la constitución, el código, una spec o esta guía ofrecen instrucciones incompatibles, detén la implementación. Registra la duda en el plan y solicita decidir qué fuente debe prevalecer, incluyendo si hace falta actualizar la documentación.
- No presentes una solución que no haya sido comprobada.

## Paquetes

Antes de aprobar un plan que añada un paquete de Node o cambie su versión,
valida con el MCP de Socket la versión propuesta y sus dependencias hasta
tres capas. Aplica los mismos criterios a todos los paquetes revisados.

Incluye en el plan un resumen por paquete y versión que indique si aparece
en campañas, si presenta alertas y si alguna puntuación es inferior a 50.
Comenta las alertas con quien aprueba el plan: esa persona decide si las
acepta. El agente no decide en su lugar.

Quedan fuera los paquetes que no sean de Node, los paquetes existentes cuya
versión no cambie y las dependencias más allá de la tercera capa.

## Cierre de una tarea

- Cada funcionalidad nueva debe incluir su primer cliente en `clients/terminal/`. Es un archivo `.txt` que se ejecuta desde la carpeta `first-app`, importa la función de `logic/` y muestra su resultado con `console.log`.
- Antes de cerrar el trabajo, ejecuta ese fragmento y confirma que la funcionalidad funciona.
- Ejecuta `pnpm format` antes de dar la tarea por terminada.
- Ejecuta `pnpm lint` antes de dar la tarea por terminada.
