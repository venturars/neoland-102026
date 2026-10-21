# Guía de trabajo

## Antes de empezar

1. Leer [la constitución](docs/CONSTITUTIONS.md), que contiene las reglas comunes
   y las instrucciones de ejecución.
2. Leer spec.md, plan.md y tasks.md de la funcionalidad afectada:
   [usuarios](docs/specs/users/spec.md) o [clasificador](docs/specs/classifier/spec.md).
   Si el cambio afecta a ambas, revisar los dos tríos.
3. Actualizar las specs antes de cambiar comportamiento. Una funcionalidad nueva
   con alcance propio recibe su trío; una ampliación pequeña actualiza el existente.
   Una corrección menor no requiere tres archivos nuevos.

## Durante el trabajo

- Respetar la constitución y los contratos de cada funcionalidad sin duplicarlos aquí.
- Mantener la estructura actual. Añadir carpetas de specs cuando el alcance lo justifique.
- No añadir capas, dependencias ni archivos sin necesidad para la tarea.
- Mantener los ejemplos de terminal sencillos y remitir a la constitución para ejecutarlos.
- Conservar UTF-8, los comentarios breves, los cambios ajenos y los datos existentes.
- No crear tests ni restaurar su directorio sin petición de Diego.

## Comprobación y entrega

- Seguir la preparación y los comandos de [ejecución](docs/CONSTITUTIONS.md#ejecución).
- Comprobar operaciones en una copia temporal del código sin copiar la base personal.
- Revisar resultados y lo que corresponda al cambio: imports, enlaces, sintaxis y UTF-8.
  Un cambio solo documental no exige ejecutar la app.
- Marcar tareas solo con evidencia. Conservar el historial y añadir tareas para cada
  iteración. Distinguir las llamadas a IA real de las respuestas simuladas.
- Entregar qué cambió, qué se comprobó y qué queda pendiente. No subir bases,
  credenciales ni archivos generados.
