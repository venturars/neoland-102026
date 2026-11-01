# Plan: Ejecutar las tareas aprobadas sin paradas

Implementa [spec.md](spec.md). Cambia [CONSTITUTIONS.md](../../CONSTITUTIONS.md) con el permiso explícito del usuario, que lo ha pedido.

## Archivos
```
docs/CONSTITUTIONS.md   principio 6, su motivo, versión y fecha
AGENTS.md               «Límites»: Siempre y Preguntar antes
```
No se toca nada más.

## `docs/CONSTITUTIONS.md`
En «6. Cambios acotados», la línea:

> Los cambios se hacen de uno en uno y se enseñan antes de continuar.

pasa a dos líneas:

> - Antes del código, el usuario lee y aprueba `spec.md`, `plan.md` y `tasks.md`. Lo que está en un `tasks.md` aprobado cuenta como pedido.
> - Con ese visto bueno, `tasks.md` se ejecuta entero, sin paradas entre tareas, y el resultado se enseña al final.

El motivo:

> *Motivo:* el usuario revisa el proyecto paso a paso y debe poder seguir cada cambio.

pasa a:

> *Motivo:* el usuario decide qué se hace al aprobar los documentos y revisa el resultado entero al final.

La versión pasa de 1.2.0 a 1.3.0 y la última modificación a 2026-10-31.

## `AGENTS.md`
En «Siempre», la línea:

> Hacer cambios pequeños, de un archivo cada vez, y enseñar el resultado antes de seguir.

pasa a:

> Antes del código, enseñar `spec.md`, `plan.md` y `tasks.md` y esperar el visto bueno. Después, ejecutar `tasks.md` entero y enseñar el resultado al final.

En «Preguntar antes», se añade al principio:

> Lo que está en un `tasks.md` aprobado ya está pedido. Lo demás de esta lista necesita permiso.

## Cómo se prueba
Leyendo los dos documentos y comprobando que dicen lo mismo.
