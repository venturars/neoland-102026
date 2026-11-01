# Spec: Capas dentro de `src/`

Issue: #716.

## Qué queremos conseguir
Que quien abre la app encuentre el código (clientes, reglas, consultas y base de datos) junto, dentro de `src/`. En la raíz quedan la documentación, la configuración y el flujo de git. La app hace lo mismo.

## Cómo se usa
- Los comandos de la terminal están en `src/clients/terminal/` y se siguen pegando desde `first-app/`.
- Los notebooks están en `src/clients/jupyter/` y se ejecutan igual.
- `pnpm format` y `pnpm lint` se lanzan igual, desde `first-app/`.

## Reglas de negocio
- Se mueven `clients/`, `logic/`, `queries/` y `db/`. Las rutas entre ellas no cambian: `logic/` sigue importando `../queries/users.js` y `queries/` sigue importando `../db/connection.js`.
- `db/users.sqlite` se mueve con su carpeta a `src/db/users.sqlite`. Es el mismo fichero, con los mismos datos, y sigue fuera de git.
- La app no se ejecuta hasta que `users.sqlite` está en su sitio nuevo: si no lo encuentra, la conexión crea uno vacío.
- Mismos resultados y mismos mensajes que antes, sin ninguna diferencia.

## Ejemplo
Se pega `src/clients/terminal/list-users.txt` desde `first-app/`. Salen Ana y Pedro, como antes.

## Fuera de alcance
- Cambiar el código de `logic/`, `queries/` o `db/`, más allá de las rutas.
- Cambiar la tabla o los datos.
- Mover `docs/`, el flujo de git o la configuración.
- Reescribir las specs de tareas anteriores.
