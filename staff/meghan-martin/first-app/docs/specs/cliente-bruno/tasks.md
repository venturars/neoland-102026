# Tareas — personas en Bruno

1. Abre `package.json`.
   Añade `@usebruno/cli` `4.3.0` en `devDependencies`.
   Añade el script `bruno`. Entra en `src/clients/rest/bruno` y lanza `bru run 01-sql-online -r`.
   El resto de dependencias no cambia de versión.

2. En `first-app`, instala con `npm install`.
   `package-lock.json` cambia.
   `@usebruno/cli` queda en `4.3.0`.
   `cli-table3`, `debug` y `qs` siguen en su versión.

3. Abre `docs/ARCHITECTURE.md`, en el punto de `src/clients/rest/server.js`.
   Ese cliente sigue en el puerto 3001 y ahora tiene la guía y la colección Bruno.
   Se lanza con `npm run bruno`. El paquete es `@usebruno/cli`.
   No sustituye a la base del puerto 3000.

4. Abre `docs/TREE.md`, en `src/clients/rest/`.
   Entran `bruno.md` y `bruno/`.
   El resto del árbol no cambia.

5. Abre `AGENTS.md`, en los comandos.
   Añade `npm run bruno` desde `first-app`.
   El programa JSON y la base del ensayo tienen que estar en marcha.

6. Crea `src/clients/rest/bruno/bruno.json`.
   `version` es `1`, `name` es `first-app REST users` y `type` es `collection`.

7. Crea `src/clients/rest/bruno/collection.bru`.
   `baseUrl` es `http://127.0.0.1:3001`.
   `missingId` es `999999`.

8. Crea las carpetas `01-sql-online` y `02-sql-offline`.
   Cada `folder.bru` lleva su `name` y su `seq`.
   La primera carpeta es la de la base en marcha.

9. Crea las peticiones de `01-sql-online` que lista el plan.
   Cada una espera el estado y el cuerpo de ese plan.
   Crear Ada guarda `userId`. Borrar responde 200 y ese número.

10. Crea las cinco peticiones de `02-sql-offline`.
    Cada una espera 503 y `Database is not running. Start it with npm run db.`
    El cuerpo es `{ "error": "frase" }`.

11. Crea `src/clients/rest/bruno.md`.
    Dice cómo hacer la copia del ensayo en el Mac y en Windows.
    La base del puerto 3000 no se para y no se copia `users.sqlite`.

12. Prepara el ensayo con la lista vacía y el programa JSON en el puerto 3001.
    Lanza `npm run bruno` desde `first-app`.
    Crear responde 201, borrar responde 200 y al final la lista está vacía.
    Se ven 400, 409 y 404 con las frases del plan.

13. Para solo el SQL del ensayo y deja el programa JSON abierto.
    Desde `src/clients/rest/bruno`, lanza `bru run 02-sql-offline -r`.
    Las cinco responden 503 y la frase de la base parada.

14. En `first-app`, lanza `npm run format` y `npm run lint`.
    `npm run lint` termina bien.
    No cambia `src/logic/`, ni `src/queries/`, ni `src/clients/rest/server.js`.
