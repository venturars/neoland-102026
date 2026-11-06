Issue: #1160

# Tareas — API con el HTTP de Node documentada en Jupyter

Todos los comentarios son frases sencillas, fáciles de leer y sin palabras técnicas sin explicar. Van por bloques y también encima de cada import. Las líneas de código son cortas.

1. Abre `package.json`.
   Añade los scripts `node-http` (`node src/clients/node-http/app.js`) y `jupyter-node-http` (`node scripts/jupyter.js src/clients/node-http/jupyter`), y `src/clients/node-http/**/*.js` en `format`. `pnpm-lock.yaml` no cambia.

2. Crea `src/clients/node-http/app.js`.
   Pon `HOST`, `PORT`, `LIMITE_CUERPO`, `ESTADOS`, `responderJson`, `responderVacio` y `responderError`, y arranca la API con el aviso de puerto ocupado. Por ahora, `atenderPeticion` responde 404 sin cuerpo. Con `pnpm node-http` en marcha, la consola muestra `http://127.0.0.1:3004` y `GET /no-existe` da 404 sin cuerpo.

3. Sigue en `src/clients/node-http/app.js`.
   Añade `esPeticionPermitida` y úsala al principio de `atenderPeticion`. `Host: localhost:3004` da 403. `Origin: https://ejemplo.com` da 403.

4. Sigue en `src/clients/node-http/app.js`.
   Añade `leerCuerpo` y `convertirCuerpo`, y úsalas después de la comprobación. Un JSON mal escrito da 400 sin cuerpo. Un valor suelto, como `"hola"`, da 400 sin cuerpo. Un cuerpo de más de 100 KB da 500 sin cuerpo.

5. Sigue en `src/clients/node-http/app.js`.
   Añade `POST /users` y `GET /users`. Con `pnpm start` en marcha, crear a Ada con `curl` da 201 con el usuario, y listar devuelve la lista con Ada.

6. Sigue en `src/clients/node-http/app.js`.
   Añade `GET /users/by-email`, `GET /users/by-name` y `GET /users/gender-count`, y convierte con `?? undefined` el parámetro que falte. Ada se encuentra por su email y por su nombre.

7. Sigue en `src/clients/node-http/app.js`.
   Añade `sacarId` y las rutas `GET`, `PATCH` y `DELETE` de `/users/:id`, después de las rutas fijas. `by-email` no se toma por un id. Se ve a Ada por su id, se le cambia el nombre y el email sigue igual. Al borrarla da 204 sin cuerpo, y volver a verla da 404 con `User not found`. Un id mal codificado, como `/users/%E0%A4%A`, da 400 sin cuerpo.

8. Con `pnpm http` y `pnpm node-http` en marcha, lanza con `curl` los casos del paso 4 de la comprobación del plan contra los puertos 3001 y 3004.
   Cada caso da el mismo estado y el mismo cuerpo. Mira también qué responde Express a un id mal codificado. Si da otra cosa que 400, se mantiene el 400 y avisa a Diego. Si otro caso no coincide, corrige `app.js`.

9. Para solo `pnpm start`.
   Cada una de las ocho rutas da 500 con su mensaje de la tabla del plan. Vuelve a lanzar `pnpm start`.

10. Con otro proceso en el puerto 3004, lanza `pnpm node-http`.
    Sale el aviso de puerto ocupado y termina con error.

11. Abre `scripts/jupyter.js`.
    Añade la constante `carpeta` con el argumento recibido y úsala en la llamada a `notebook`. `pnpm jupyter` sigue abriendo `src/clients/jupyter/`. `pnpm jupyter-node-http` abre `src/clients/node-http/jupyter/`, todavía vacía si la carpeta ya existe.

12. Crea `src/clients/node-http/jupyter/create-user.ipynb`.
    Escribe la celda de markdown y la de código como dice el plan. Con la base y la API en marcha, crea a Ada y pinta la tabla. Si se ejecuta otra vez, muestra el estado 409 y `Email is already used`, sin tabla.

13. Crea `list-users.ipynb`, `find-user-by-id.ipynb`, `find-user-by-email.ipynb` y `find-user-by-name.ipynb`, en esa carpeta.
    Cada uno muestra su petición, su estado y su tabla. `find-user-by-id` lleva `id` arriba y avisa de que hay que cambiarlo. Con un id que no existe, muestra el estado 404 y `User not found`, sin tabla.

14. Crea `update-user.ipynb` y `delete-user.ipynb`, en esa carpeta.
    Los dos llevan `id` arriba. `update-user` cambia el nombre a Ada Lovelace y pinta la tabla. `delete-user` muestra el estado 204 y no falla por venir sin cuerpo.

15. Crea `users-gender-count.ipynb`, en esa carpeta.
    Su markdown dice que necesita Ollama con `llama3.2`. Con Ollama en marcha, pinta los tres recuentos. Sin Ollama y con usuarios en la base, muestra el estado 500 y `Could not classify the users`.

16. Ejecuta los ocho cuadernos en el orden de la comprobación del plan, con la API en marcha.
    Ninguno da un error que no esté en el plan. Limpia las salidas antes de guardar: los `.ipynb` no llevan datos de la base local.

17. Abre `AGENTS.md`.
    Añade los comandos `pnpm node-http` y `pnpm jupyter-node-http`, la API en la lista de clientes que necesitan `pnpm start` y en la de los que usan `openai`, y `src/clients/node-http/` en `pnpm format`.

18. Abre `docs/ARCHITECTURE.md`.
    Añade la fila de `src/clients/node-http/*` y nombra esta API donde se nombran los clientes de `src/logic/`.

19. Abre `docs/TREE.md`.
    Añade `node-http/` a `clients/`, con `app.js` y `jupyter/`.

20. Lanza `pnpm format` y `pnpm lint`.
    Los dos pasan. Relee los comentarios nuevos: cada uno se entiende sin saber cómo funciona `node:http`.
