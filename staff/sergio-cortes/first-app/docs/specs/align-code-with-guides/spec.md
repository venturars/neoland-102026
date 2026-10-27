# Alinear el código con las guías

Issue: #513.

## Qué se pide

Quien construye la app ve en el código la misma forma que en las guías de arquitectura y estilo. El funcionamiento observable no cambia.

## Quién lo usa

Quien escribe un desarrollo con IA y quien comprueba que el código cabe en las guías antes de dar la tarea por terminada.

## Entrada

El código JavaScript de `db/`, `queries/` y `logic/` tal como está ahora. Las guías en `docs/ARCHITECTURE.md`, `docs/CONSTITUTIONS.md` y `docs/STYLE.md`.

## Salida

Para cada operación que la app ya hace — crear, cambiar, borrar, listar, buscar por id, email o nombre, y contar por género — el resultado y los mensajes de error son los mismos que antes.

Cada línea deja una sola acción en un nombre. Una llamada y una comprobación no comparten línea. Un fallo de la lista se comprueba con `if` y `throw` de la clase que toca, cada uno en su propia línea.

Ejemplo: se crea un usuario con el mismo nombre y email que antes. Sale el mismo objeto de usuario. El código que valida el nombre no junta comprobar el tipo y recortar espacios en la misma línea.

## Fallo

No hay un fallo nuevo de la lista «Errores».

Si un resultado cambia, si un mensaje cambia, o si una línea sigue con dos acciones, el desarrollo no está hecho.

## Fuera

- Una funcionalidad nueva o un mensaje de error nuevo.
- Cambiar el SQL o el esquema de la base de datos.
- Añadir o quitar paquetes de Node.
- Cambiar las guías (`docs/ARCHITECTURE.md`, `docs/CONSTITUTIONS.md`, `docs/STYLE.md`, `docs/TREE.md`, `docs/DATABASE.md`, `docs/ERRORS.md`).
- Reescribir los cuadernos Jupyter ni los `.txt` de `clients/terminal/`, salvo que el plan diga lo contrario para una línea concreta.
- Cambiar `eslint.config.js`, `package.json` ni `AGENTS.MD`.
