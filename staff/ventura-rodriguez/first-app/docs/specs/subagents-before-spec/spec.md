# Subagentes antes de la spec

Issue: #575.

Quien pide un cambio en esta app ve primero al subagente de ese
momento. La tarea queda escrita antes de la spec.

Lo usa quien construye la app con IA.

Entra un cambio de esta app. Sale la tarea escrita, con el título en
inglés y el cuerpo en español, asignada a quien está autenticado. En
el chat se ve qué subagente ha corrido y el número, el título y la
URL. La spec no existe todavía.

Ejemplo: se pide un cambio. Lo primero es el subagente que deja la
tarea escrita. La spec, cuando se escriba, abre con el número de esa
tarea. Después se para.

Las dos paradas se quedan. La primera es antes de crear las tareas:
una persona revisa la spec y el plan. La segunda es al crear las
tareas. No se implementa en esas paradas.

No hay un fallo de la lista «Errores». Si la spec aparece antes de la
tarea escrita, si el padre hace el trabajo del subagente, o si no se
ve qué subagente ha corrido, el orden no está arreglado.

Queda fuera la issue #574, cambiar las reglas de negocio, la base de
datos, los clientes y los paquetes.
