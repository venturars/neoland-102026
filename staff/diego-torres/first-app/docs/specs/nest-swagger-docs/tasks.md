Issue: #1138

# Tareas — página de documentación de la API de Nest

Todos los comentarios son frases sencillas, fáciles de leer y sin palabras técnicas sin explicar. Van por bloques y también encima de cada import. Las líneas de código son cortas.

1. Abre `package.json`.
   Añade `@nestjs/swagger` con la versión fija `12.1.0` en `dependencies` y lanza `pnpm install`. `pnpm-lock.yaml` queda actualizado y pnpm avisa de que no ha ejecutado el script de `@scarf/scarf`. No lo permitas.

2. Abre `src/clients/nest/main.js`.
   Importa `DocumentBuilder` y `SwaggerModule`, y monta la página en `/docs`, después de `app.use(comprobarPeticion)` y antes de `app.listen`. Con `pnpm start` y `pnpm nest` en marcha, `http://127.0.0.1:3003/docs` abre la página y `/docs-json` devuelve el documento. Si no arranca con Babel, para y avisa a Diego.

3. Sigue en `src/clients/nest/main.js`.
   Añade la constante `ORIGEN_API`. `comprobarPeticion` responde 403 si llega un `Origin` distinto de ese. El aviso de arranque añade la dirección de la documentación.

4. Prueba las peticiones que no se atienden.
   `Origin: https://ejemplo.com` da 403. `Host: otro` da 403. `http://localhost:3003/docs` da 403. `curl http://127.0.0.1:3003/users` responde como antes.

5. Crea `src/clients/nest/users.swagger.js`.
   Exporta `USUARIO`, `LISTA_USUARIOS`, `CREAR_USUARIO`, `MODIFICAR_USUARIO`, `RECUENTO` y `ERROR` como objetos sencillos. No uses clases.

6. Abre `src/clients/nest/users.controller.js`.
   Importa los decoradores y los esquemas. Pon `@ApiTags("users")` en la clase y, en cada ruta, lo que dice la tabla «Decoradores por ruta» del plan. Las funciones no cambian. La página muestra las 8 rutas con sus esquemas.

7. Mira cada ruta en la página.
   Cada parámetro sale una sola vez. Si `@Bind` lo repite junto a `@ApiParam` o `@ApiQuery`, corrígelo sin cambiar lo que hace la ruta.

8. Prueba desde «Try it out», con un usuario de prueba.
   Crear da 201. Ver, buscar por email, buscar por nombre y modificar dan 200. Borrar da 204. No queda en la base.

9. Prueba los fallos desde «Try it out».
   Crear dos veces con el mismo email da 409 con `{ message }`. Un id que no existe da 404. Un email sin forma de email da 400. Borra lo que hayas creado.

10. Con Ollama en marcha, prueba `GET /users/gender-count`.
    Responde con `women`, `men` y `genderUndefined`. Sin Ollama, da 500 con `Could not classify the users`.

11. Prueba lo que ya había.
    `GET /no-existe` da 404 sin cuerpo. Un JSON mal escrito da 400 sin cuerpo.

12. Abre `AGENTS.md`.
    Añade `@nestjs/swagger` a la lista de dependencias y a los paquetes de la API de Nest, y `/docs` en la línea de `pnpm nest`.

13. Abre `docs/ARCHITECTURE.md`.
    En la fila de `src/clients/nest/*`, cuenta la página de `/docs` y que solo acepta el `Origin` de la propia API.

14. Abre `docs/TREE.md`.
    Añade `users.swagger.js` a la línea de `nest/`.

15. Abre `docs/specs/nest-client/spec.md` y `docs/specs/nest-client/plan.md`.
    Añade al principio una nota: la página propia y el `Origin` de la API cambian en `docs/specs/nest-swagger-docs/`. El resto no se toca.

16. Lanza `pnpm format` y `pnpm lint`.
    Los dos pasan. Relee los comentarios nuevos: cada uno se entiende sin saber de Nest.
