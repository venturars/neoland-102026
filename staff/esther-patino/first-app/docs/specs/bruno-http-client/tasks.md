# Tareas — colección Bruno del cliente HTTP

1. Abre `package.json`.
   Añade en `devDependencies` `@usebruno/cli` en `4.3.0`.
   Añade el script `bruno` para Windows desde `first-app`, apuntando a
   `src/clients/http/bruno/01-sql-online` con recursión.
   El resto de dependencias y scripts no cambia de versión.

2. Instala en `first-app` con `pnpm install`.
   `pnpm-lock.yaml` cambia.
   `@usebruno/cli` queda en `4.3.0`.

3. Abre `pnpm-lock.yaml`.
   Las versiones de ese paquete y de sus dependencias, hasta 3 capas, se
   confirman con Socket. Si una no coincide con lo aceptado en el plan,
   se para.

4. Abre `docs/ARCHITECTURE.md`, en el punto de `src/clients/http/`.
   Ese cliente tiene la guía y la colección Bruno y se lanza con
   `pnpm bruno`. El paquete es `@usebruno/cli`. No sustituye a
   `src/db/server.js`.

5. Abre `docs/tree.md`, en `src/clients/http/`.
   Entra `bruno.md` y `bruno/`.
   Entra `bruno-http-client/` en `docs/specs/` si aún no está.

6. Abre `docs/style.md`.
   Añade `pnpm bruno` en Comandos.

7. Crea `src/clients/http/bruno/bruno.json`, `collection.bru`, las
   carpetas `01-sql-online` y `02-sql-offline` y las peticiones del
   plan.

8. Crea `src/clients/http/bruno.md` con los pasos del plan.

9. En `first-app`, lanza `pnpm format` y `pnpm lint`.
   No cambia `src/logic/`, ni `src/queries/`, ni
   `src/clients/http/app.js`.

10. Arranca la base con `pnpm server` y el cliente con `pnpm http`.
    La lista está vacía.

11. Desde `first-app`, lanza `pnpm bruno`.
    Pasan los casos de `01-sql-online` de la spec.

12. Para solo el SQL y deja el cliente HTTP abierto.
    Lanza la carpeta `02-sql-offline` como dice `bruno.md`.
    Los cinco responden 500 y el `Could not` de cada acción.
