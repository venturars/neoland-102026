Issue: #601

# Reorganizar la aplicación bajo src

Jimena necesita encontrar las capas de la aplicación juntas bajo `src/`, manteniendo su funcionamiento en Windows, PowerShell y Jupyter.

## Criterios de aceptación

1. Las carpetas `db/`, `clients/`, `logic/` y `queries/` pasan a `src/` conservando su contenido y sus responsabilidades. La automatización de Git permanece fuera de esa carpeta y sigue funcionando.
2. Crear, consultar por ID, correo y nombre, listar, actualizar, borrar y contar por género conservan resultados, validaciones y errores. No se cambian consultas ni reglas de negocio.
3. Los nueve clientes de terminal se ejecutan desde first-app con PowerShell. Jupyter abre los mismos nueve documentos desde first-app o src y localiza exclusivamente la aplicación de Jimena, sin seleccionar la carpeta logic de otro alumno.
4. SQLite conserva los datos existentes y continúa fuera de Git, incluidos sus archivos auxiliares. Se documenta el traslado manual de la base ignorada que permanece en db al actualizar otro checkout; no se sobrescribe un destino existente ni se usa una base vacía como sustituto. Las verificaciones se realizan con una copia y una base desechable.
5. Solo se ajustan rutas, imports, comandos, scripts y documentación vigentes afectados. Las specs históricas quedan intactas. No se añaden paquetes, Socket ni funcionalidades.

## Separación y revisión

La dependencia de la PR #600 está resuelta: se integró staging mediante `db267b51`, conservando la implementación `b62abae3`. ChromaDB y los demás datos locales se conservan sin incorporarlos al trabajo.

Spec, plan y tareas T01–T18 aprobados por Jimena. Implementación y comprobaciones realizadas; resultados y límites en [verification.md](verification.md). La restricción inicial de commit, push y PR correspondía a la preparación: Jimena autorizó después la publicación y se creó [#670](https://github.com/venturars/neoland-102026/pull/670) en draft contra staging, sin revisores ni merge. Tras revisar las correcciones, Jimena autorizó expresamente su commit selectivo y push, incluidos los nueve notebooks y la documentación afectada, y actualizar la descripción de #670 sin cambiar revisores ni hacer merge.
