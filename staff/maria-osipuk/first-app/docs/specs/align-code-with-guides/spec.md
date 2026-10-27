# Alinear el código con las guías

## Qué se pide

El código de `first-app` debe seguir las reglas de arquitectura y estilo que ya están escritas en las guías, y debe seguir haciendo exactamente lo mismo que hace hoy.

## A quién obliga

A quien cambie el código de `first-app` y a quien revise ese cambio.

## Alcance

Se alinea el código de las operaciones de usuario y de la conexión a la base.

No se toca la función `classifyNames` ni el módulo que ejecuta las consultas. Se dejan como están por decisión de María.

## La regla

- El comportamiento no cambia: mismas entradas, mismas salidas, mismos errores y mismos mensajes.
- Cada línea hace una sola acción, como pide la guía de estilo.
- Las comprobaciones de validación se leen de arriba abajo, en pasos visibles.
- Las constantes se escriben en mayúsculas.
- El formato es el estándar de Prettier y la comprobación estática pasa.

## Ejemplo correcto

Se crea un usuario con nombre «Ada» y email «ada@example.com». Se obtiene el mismo usuario que antes del cambio. El código que lo hace se lee en pasos cortos.

## Ejemplo que no se sigue

Un email inválido deja de lanzar `User email is invalid`, o un mensaje de error cambia de texto.

## Cómo se comprueba

- Cada cliente de terminal da el mismo resultado que antes, tanto en el caso correcto como en un caso incorrecto.
- `pnpm format` y `pnpm lint` terminan sin errores.
- Los ficheros que no están en el alcance no aparecen en el diff.
