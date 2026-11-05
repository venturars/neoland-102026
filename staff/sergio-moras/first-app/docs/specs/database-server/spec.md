# Spec: Base de datos en un servidor local

Issue: #819.

## Qué queremos conseguir
Que la base de datos la atienda un único proceso local y que las operaciones de usuarios le pidan lo que necesitan, en lugar de abrir el fichero ellas mismas. Así las reglas de `logic/` pueden funcionar también donde no se puede abrir el fichero, como el navegador, que llegará en otra tarea.

Quien usa la app no ve nada nuevo: los comandos de terminal y los documentos de Jupyter dan el mismo resultado y los mismos errores que hoy. Lo único nuevo es que antes hay que arrancar la base.

## Cómo se usa
1. Desde `first-app/`, se arranca la base con un comando. Escribe en la terminal la dirección en la que escucha y se queda en marcha hasta que se para con Ctrl+C.
2. En otra terminal, los comandos de `src/clients/terminal/` y los documentos de `src/clients/jupyter/` se usan igual que hoy.

## Qué hace el proceso de la base
- Es el único que abre `src/db/users.sqlite`. Si la tabla no existe, la crea, igual que hoy.
- Solo atiende peticiones de este equipo.
- Solo ejecuta las consultas que la app ya tiene, por su nombre. Una consulta que no conoce no se ejecuta.

## Errores
- Los de las operaciones no cambian: los mismos mensajes de [ERRORS.md](../../ERRORS.md), en los mismos casos.
- Si la base no está arrancada, cualquier operación termina con:
  `Error: Database is not running. Start it with pnpm db.`
  - En `classifyGender`, que envuelve sus fallos, sale como `Error: Users could not be classified: Database is not running. Start it with pnpm db.`

## Ejemplo
Guardados: Ana (`ana@hotmail.com`, id 2) y Pedro (id 18).
- Con la base parada, `list-users.txt` escribe `Error: Database is not running. Start it with pnpm db.` y no cambia nada.
- Con la base en marcha, `list-users.txt` muestra la misma tabla que antes del cambio.
- `update-user.txt` con el id 2 y el email de Pedro escribe `Error: Email already exists: <email de Pedro>`, igual que hoy, y Ana no cambia.
- `delete-user.txt` con un id que no existe escribe `Error: User not found: id <id>`, igual que hoy.

## Fuera de alcance
- El cliente de navegador: es otra tarea.
- Operaciones nuevas, cambiar las reglas de `logic/` o los mensajes que ya existen.
- Cambiar la tabla o los datos guardados.
- Acceso a la base desde otro equipo.
