# Tareas — página para consumir los usuarios

1. Abre `package.json`.
   Añade en `dependencies` `@nestjs/swagger` en `12.1.0`.
   Las dependencias que ya estaban no cambian de versión.
   El script `nest` no cambia.

2. Instala en `first-app` con `pnpm install`.
   `pnpm-lock.yaml` cambia.
   Esa versión queda fijada.
   No se instala `typescript`, `class-validator`, `class-transformer` ni `@fastify/static`.

3. Abre `pnpm-lock.yaml`.
   Las versiones de ese paquete y de sus dependencias, hasta 3 capas, son las del plan.
   `path-to-regexp` sigue en `8.4.2` y `@standard-schema/spec` sigue en `1.1.0`.
   Si una versión no coincide, se para y esa versión vuelve a Socket.

4. Abre `docs/ARCHITECTURE.md`, en el punto de `src/clients/nest/`.
   Ese cliente se compila con Babel, `node` arranca `dist/clients/nest/main.js`, llama a `src/logic/` a través de esa copia y abre la página en `http://127.0.0.1:3003`.
   No repite sus reglas. No sustituye a `src/clients/http/`, ni a `src/clients/chrome/`, ni a `src/db/server.js`.
   `docs/TREE.md`, `docs/STYLE.md` y `docs/ERRORS.md` no cambian.

5. Abre `src/clients/nest/main.js`.
   Antes de `listen`, construye el documento con `DocumentBuilder`: título `Users`, versión `0.0.0`.
   Lo publica con `SwaggerModule.setup` y el camino `""`.
   `ORIGIN` y el `console.log` no cambian.

6. Abre `src/clients/nest/users.controller.js`, en crear y modificar.
   Crear lleva `@ApiBody`. El schema es un objeto. Hacen falta `name` y `email`, los dos cadenas. El ejemplo es Ada y ada@example.com.
   Modificar lleva `@ApiBody`. El schema es un objeto. `name` y `email` son cadenas y ninguno hace falta. El ejemplo del nombre es Ada Lovelace y el del email es ada@example.com.
   Las rutas y el cuerpo que leen no cambian.

7. Abre `src/clients/nest/users.controller.js`, en ver, modificar y borrar.
   Las tres llevan `@ApiParam`. El `name` es `id`, `required` es true, el schema es una cadena y el ejemplo es `1`.
   Las rutas y el id que leen no cambian.
   El filtro, el servicio y el módulo no cambian.

8. En `first-app`, lanza `pnpm format` y `pnpm lint`.
   `pnpm format` escribe los `.js` de `src/clients/nest/`.
   `pnpm lint` termina bien.
   No cambia `src/logic/` ni `src/queries/`.

9. Arranca la base con el comando que ya existe y el cliente con `pnpm nest`.
   El cliente escribe `http://127.0.0.1:3003`.
   `GET /` responde 200 y el HTML trae el título `Swagger UI`.
   `GET /users` responde 200 y JSON.

10. Abre `http://127.0.0.1:3003` en el navegador.
    Se ve Swagger UI con crear, listar, ver, modificar y borrar.
    Crear pide nombre y email. Ver, modificar y borrar piden el id.
    Modificar pide el nombre, el email o los dos.

11. Desde esa página, crea Ada con ada@example.com.
    La respuesta es 201.
    El cuerpo tiene el id, el nombre Ada, el email ada@example.com y las dos fechas.
    Al listar, ese usuario sale con los mismos datos.

12. Desde esa página, ábrelo con su id.
    Se ven el mismo id, nombre, email y fechas.
    Cámbiale el nombre a Ada Lovelace y deja el correo.
    Se ve el id 1, el nombre Ada Lovelace y el email ada@example.com.

13. Desde esa página, bórralo.
    La respuesta es 204 y no trae cuerpo.
    Al volver a abrirlo con el mismo id, la respuesta es 404 y el mensaje es `User not found`.
    No cambia el resto de clientes.
