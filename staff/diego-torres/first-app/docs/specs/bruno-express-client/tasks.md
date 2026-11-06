Issue: #1153

# Tareas — API de Express con colección de Bruno

Todos los comentarios son frases sencillas, fáciles de leer y sin palabras técnicas sin explicar. Van por bloques y también encima de cada import. Las líneas de código son cortas.

1. Abre `package.json`.
   Añade `express` con la versión fija `5.3.0` en `dependencies` y `@usebruno/cli` con la versión fija `4.3.0` en `devDependencies`. Lanza `pnpm install`. `pnpm-lock.yaml` queda actualizado y pnpm avisa de que no ha ejecutado el script de `protobufjs`. No lo permitas.

2. Sigue en `package.json`.
   Añade los scripts `http` (`node src/clients/http/server.js`) y `bruno` (`node scripts/bruno.js`), y `src/clients/http/**/*.js` en `format`.

3. Crea `src/clients/http/server.js`.
   Pon `HOST`, `PORT`, `ESTADOS` y `responderError`, y arranca la API como dice el plan, con el aviso de puerto ocupado. Con `pnpm http` en marcha, `GET /no-existe` da 404 sin cuerpo.

4. Sigue en `src/clients/http/server.js`.
   Añade `comprobarPeticion`, `express.json()` y el manejador de errores. `Host: localhost:3001` da 403. `Origin: https://ejemplo.com` da 403. Un JSON mal escrito da 400 sin cuerpo.

5. Sigue en `src/clients/http/server.js`.
   Añade las 8 rutas de la tabla del plan, con las tres rutas fijas antes que `/users/:id`. Con `pnpm start` en marcha, `curl http://127.0.0.1:3001/users` devuelve la lista.

6. Crea `scripts/bruno.js`.
   Elige la carpeta por el argumento, lanza el CLI con `spawnSync` y termina con su código de salida. Con un argumento que no existe, avisa y termina con error.

7. Crea `src/clients/http/bruno/bruno.json` y `collection.bru`.
   `collection.bru` lleva `baseUrl` y `missingId`.

8. Crea `src/clients/http/bruno/01-sql-online/`.
   Escribe `folder.bru` y las peticiones en el orden del plan, con sus tests. Con `pnpm start` y `pnpm http` en marcha, `pnpm bruno` pasa en verde y termina con código 0. Si `bru run` o un script de la colección no funcionan como dice el plan, para y avisa a Diego.

9. Lanza `pnpm bruno` otra vez.
   Sigue en verde. `curl http://127.0.0.1:3001/users` da la misma lista que antes de la primera ejecución.

10. Rompe un test a propósito y lanza `pnpm bruno`.
    Termina con un código distinto de 0. Deshaz el cambio.

11. Crea `src/clients/http/bruno/02-sql-offline/`.
    Escribe `folder.bru` y una petición por operación, cada una con su 500 y su mensaje. Para solo `pnpm start`. `pnpm bruno offline` pasa en verde. Vuelve a lanzar `pnpm start`.

12. Crea `src/clients/http/bruno/03-ai/`.
    Escribe `folder.bru` y `gender-count`. Con Ollama y `llama3.2` en marcha, `pnpm bruno ai` da 200 con `women`, `men` y `genderUndefined`.

13. Abre la colección en la app de Bruno y lanza una petición.
    Responde igual que desde el CLI. Si da 403, para y avisa a Diego.

14. Con otro proceso en el puerto 3001, lanza `pnpm http`.
    Sale el aviso de puerto ocupado.

15. Abre `AGENTS.md`.
    Añade los dos paquetes a sus listas, los comandos `pnpm http` y `pnpm bruno`, y la API de Express en la lista de clientes que necesitan `pnpm start`. Explica para qué sirve cada paquete.

16. Abre `docs/ARCHITECTURE.md`.
    Añade las filas de `src/clients/http/*` y `scripts/bruno.js`, y la API de Express donde se nombran los clientes de `src/logic/`.

17. Abre `docs/TREE.md`.
    Añade `bruno.js` a `scripts/` y `http/` a `clients/`.

18. Lanza `pnpm format` y `pnpm lint`.
    Los dos pasan. Relee los comentarios nuevos: cada uno se entiende sin saber de Express.
