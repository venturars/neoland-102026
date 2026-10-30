Issue: #601

# Reorganizar la aplicación bajo src

Jimena necesita encontrar las capas de la aplicación juntas bajo `src/`, manteniendo su funcionamiento en Windows, PowerShell y Jupyter.

## Criterios de aceptación

1. Las carpetas `db/`, `clients/`, `logic/` y `queries/` pasan a `src/` conservando su contenido y sus responsabilidades. La automatización de Git permanece fuera de esa carpeta y sigue funcionando.
2. Crear, consultar por ID, correo y nombre, listar, actualizar, borrar y contar por género conservan resultados, validaciones y errores. No se cambian consultas ni reglas de negocio.
3. Los nueve clientes de terminal se ejecutan desde first-app con PowerShell. Jupyter abre los mismos nueve documentos y conserva su funcionamiento.
4. SQLite conserva los datos existentes y continúa fuera de Git, incluidos sus archivos auxiliares. No se crea una base vacía que sustituya la personal; las verificaciones se realizan con una copia y una base desechable.
5. Solo se ajustan rutas, imports, comandos, scripts y documentación vigentes afectados. Las specs históricas quedan intactas. No se añaden paquetes, Socket ni funcionalidades.

## Separación y revisión

Esta entrega depende de la automatización pendiente de la PR #600 y se prepara en una rama distinta. ChromaDB y los demás datos locales se conservan sin incorporarlos al trabajo.

Spec, plan y tareas T01–T18 aprobados por Jimena. Implementación y comprobaciones realizadas; resultados y límites en [verification.md](verification.md). No se autoriza commit, push, PR ni merge en esta fase.
