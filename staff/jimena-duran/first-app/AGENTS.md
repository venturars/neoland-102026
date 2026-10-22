# AGENTS.md — first-app

## Contexto del proyecto

La aplicación usa Node.js con módulos ES (`"type": "module"`) y una base SQLite gestionada por `node:sqlite`. La base está en `db/users.sqlite`; las reglas generales se encuentran en `docs/CONSTITUTIONS.md`.

## Comandos disponibles

- Ejecución: todavía no existe un comando de ejecución.
- Pruebas: aún no hay tests automatizados; el script `test` de `package.json` es solo el marcador de pnpm.
- Formato: se sigue Prettier con su configuración predeterminada. No hay scripts propios de lint o formato.

## Convenciones de código

El código fuente se redacta en inglés. Los comentarios de los clientes de terminal pueden estar en español para facilitar el aprendizaje de alumnos hispanohablantes.

Usa nombres de fichero en kebab-case, variables y funciones en camelCase, exportaciones con nombre e imports ESM que incluyan `.js`. Las consultas SQL reciben parámetros nombrados como `:id`, `:name` y `:email`. Las interfaces de `logic/` y los errores válidos están definidos en `docs/CONSTITUTIONS.md`.

El flujo debe poder leerse de principio a fin. Prefiere condicionales claros y nombres descriptivos. No añadas envoltorios de resultados, jerarquías de errores, helpers genéricos ni abstracciones que oculten los pasos que un principiante necesita ver.

Aplica el formato estándar de Prettier: comillas dobles, punto y coma, coma final, dos espacios de indentación y líneas de hasta 80 columnas.

## Reglas de trabajo

- Antes de editar código, lee `docs/CONSTITUTIONS.md` y la spec que esté activa.
- Trabaja con temperatura cercana a cero: sigue la spec y el plan, sin inventar requisitos.
- Investiga primero, revisa si existe una tarea semejante ya resuelta y respeta las convenciones del código existente.
- Si la constitución, el código, una spec o esta guía ofrecen instrucciones incompatibles, detén la implementación. Registra la duda en el plan y solicita decidir qué fuente debe prevalecer, incluyendo si hace falta actualizar la documentación.
- No presentes una solución que no haya sido comprobada.

## Cierre de una tarea

- Cada funcionalidad nueva debe incluir su primer cliente en `clients/terminal/`. Es un archivo `.txt` que se ejecuta desde la carpeta `first-app`, importa la función de `logic/` y muestra su resultado con `console.log`.
- Antes de cerrar el trabajo, ejecuta ese fragmento y confirma que la funcionalidad funciona.
