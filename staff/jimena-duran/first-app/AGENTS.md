# AGENTS.md — first-app

## Guías del proyecto

Las reglas generales y los enlaces a las guías por tema están en [CONSTITUTIONS.md](docs/CONSTITUTIONS.md). Para escribir código, sigue [STYLE.md](docs/STYLE.md).

## Comandos disponibles

- Ejecución: todavía no existe un comando de ejecución.
- Pruebas: aún no hay tests automatizados; el script `test` de `package.json` es solo el marcador de pnpm.
- Formato: no hay scripts propios de lint o formato; las reglas están en [STYLE.md](docs/STYLE.md).

## Reglas de trabajo

- Antes de editar código, lee `docs/CONSTITUTIONS.md` y la spec que esté activa.
- Trabaja con temperatura cercana a cero: sigue la spec y el plan, sin inventar requisitos.
- Investiga primero, revisa si existe una tarea semejante ya resuelta y respeta las convenciones del código existente.
- Si la constitución, el código, una spec o esta guía ofrecen instrucciones incompatibles, detén la implementación. Registra la duda en el plan y solicita decidir qué fuente debe prevalecer, incluyendo si hace falta actualizar la documentación.
- No presentes una solución que no haya sido comprobada.

## Cierre de una tarea

- Cada funcionalidad nueva debe incluir su primer cliente en `clients/terminal/`. Es un archivo `.txt` que se ejecuta desde la carpeta `first-app`, importa la función de `logic/` y muestra su resultado con `console.log`.
- Antes de cerrar el trabajo, ejecuta ese fragmento y confirma que la funcionalidad funciona.
