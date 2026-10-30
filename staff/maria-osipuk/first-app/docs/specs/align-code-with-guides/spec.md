# Alinear el código con las guías

## Qué se pide

El código de `first-app` debe seguir las reglas de arquitectura y estilo que ya están escritas en las guías, y debe seguir haciendo exactamente lo mismo que hace hoy.

## A quién obliga

A quien cambie el código de `first-app` y a quien revise ese cambio.

## Alcance

Entra todo el código JavaScript de la aplicación: las operaciones de usuario, el recuento por género, la ejecución de consultas y la conexión a la base.

No entran los SQL, los clientes de terminal, los cuadernos Jupyter ni `run_logic.py`. Las funciones no se mueven de fichero y no se crean ficheros nuevos.

## La regla

- El comportamiento no cambia: mismas entradas, mismas salidas, mismos errores y mismos mensajes.
- Cada línea hace una sola acción, como pide la guía de estilo.
- Una comprobación con varias condiciones se escribe en pasos visibles, con un nombre para cada paso. Se usan banderas e `if` anidados, sin `&&`, `||` ni ternarios dentro de una condición, con la misma forma que la `first-app` de Ventura Rodríguez.
- La validación del `id` se queda como está hoy, con `!Number.isInteger(id) || id <= 0`. Es la única excepción a la regla anterior.
- Solo se copia la forma. Las validaciones, los mensajes de error y las firmas de María no cambian.
- Las constantes se escriben en mayúsculas.
- Los exports son con nombre.
- El formato es el estándar de Prettier y la comprobación estática pasa.

## Ejemplo correcto

Se crea un usuario con nombre «Ada» y email «ada@example.com». Se obtiene el mismo usuario que antes del cambio. El código que lo hace se lee en pasos cortos.

## Ejemplo que no se sigue

Un email inválido deja de lanzar `User email is invalid`, o un mensaje de error cambia de texto.

## Cómo se comprueba

- Cada cliente de terminal da el mismo resultado que antes, tanto en el caso correcto como en un caso incorrecto.
- `pnpm format` y `pnpm lint` terminan sin errores.
- No hay ficheros nuevos ni borrados en el diff.
