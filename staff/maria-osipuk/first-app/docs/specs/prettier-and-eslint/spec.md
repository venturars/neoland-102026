# Formato y comprobación del código

Issue: #484.

## Qué se pide

Al terminar una tarea, el código de `first-app` debe quedar con un formato común y pasar una comprobación estática antes de darse por terminado.

## A quién obliga

A cualquier persona que cambie el código de `first-app` y a quien revise ese cambio.

## La regla

- Se aplica el formato estándar antes de cerrar una tarea.
- Se comprueba que el código no tenga errores de sintaxis ni incumpla las reglas configuradas.
- Si alguna comprobación falla, la tarea todavía no está terminada.

## Ejemplo correcto

Una persona termina un cambio, aplica el formato y ejecuta la comprobación. Los dos pasos terminan correctamente y el código queda listo para revisión.

## Ejemplo que no se sigue

La tarea se da por terminada sin aplicar el formato, o la comprobación encuentra un error y se ignora.

## Cómo se comprueba

- El comando de formato termina correctamente y deja el código con el formato estándar.
- El comando de comprobación termina correctamente cuando el código es válido.
- Un error de sintaxis hace fallar la comprobación.
