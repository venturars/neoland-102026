# Tareas de Swagger UI en NestJS

Issue: #1090

Spec, plan y tareas aprobados el 5 de noviembre de 2026.
La persona autoriza instalar, implementar y comprobar Swagger UI.
Las 21 tareas están completadas; la evidencia real figura en `plan.md`.
Los scripts pnpm de esta ocasión se ejecutaron con las dos excepciones CLI documentadas en el plan; no se guardó configuración persistente.
Trabajar en `1090-feat-nest-swagger-ui`; commit local autorizado para la #1090. Push y cambios en la PR requieren una autorización adicional.

1. [x] Revalidar la resolución aislada del plan con manifiesto y lockfile copiados, sin instalar ni ejecutar scripts.
   Aplicar solo por CLI la excepción autorizada para `electron-to-chromium@1.5.477` y `regexpu-core@6.5.4`; conservar versiones y política para el resto.
   Resultado comprobado: resolución aislada completada con salida 0, sin instalar ni ejecutar scripts; evidencia en el plan.

2. [x] Comparar el árbol resuelto con las ocho versiones nuevas y las versiones existentes del plan.
   Si aparecen paquetes nuevos o versiones distintas, revisar Socket hasta tres capas y solicitar aprobación del plan actualizado antes de continuar.
   Resultado comprobado: exactamente ocho paquetes y versiones nuevos aprobados; el 403 de campañas se registra como limitación de acceso.

3. [x] Añadir `@nestjs/swagger` fijado en `12.1.0` a `dependencies` de `package.json`.
   Resultado: esa única incorporación al manifiesto, conservando las versiones existentes y el script `nest`.

4. [x] Actualizar `pnpm-lock.yaml` e instalar el árbol aprobado sin ejecutar scripts nuevos de dependencias.
   Resultado: árbol idéntico al validado, sin peers opcionales nuevos, con la excepción CLI limitada a las dos versiones autorizadas y sin configuración global nueva.
   Si la resolución se desvía, detenerse y volver a la revisión de dependencias.

5. [x] Añadir en `src/clients/nest/main.js`, antes de escuchar, el documento `Users`, versión `0.0.0`, y `SwaggerModule.setup("", app, document)`.
   Resultado: Swagger UI publicada en la raíz del mismo origen, conservando `ORIGIN`, el puerto y el mensaje de arranque.

6. [x] Añadir `ApiBody` al POST de `src/clients/nest/users-controller.js` con `name` y `email` strings obligatorios y ejemplos Ana y ana@example.com.
   Resultado: el documento permite introducir el cuerpo de creación sin cambiar el método ni sus validaciones actuales.

7. [x] Añadir `ApiBody` al PATCH del mismo controlador con `name` y `email` strings opcionales y ejemplo que envía solo el nombre.
   Resultado: el documento permite omitir el email sin cambiar el comportamiento de actualización parcial.

8. [x] Añadir `ApiParam` para `id` obligatorio, schema string y ejemplo `"1"`, en GET por id, PATCH y DELETE.
   Resultado: las tres operaciones permiten introducir el id, conservando rutas, `@Bind`, `@HttpCode` y cuerpos de los métodos.

9. [x] Actualizar `README.md` con Swagger UI en `http://127.0.0.1:3003/` y la secuencia CRUD desde el navegador.
   Resultado: instrucciones Windows/PowerShell con `corepack pnpm server` y `corepack pnpm nest` en terminales separadas.

10. [x] Actualizar `docs/ARCHITECTURE.md` para describir la página en el cliente NestJS existente.
    Resultado: arquitectura acorde con el plan; comprobar que `docs/TREE.md` sigue representando los archivos sin cambio estructural.

11. [x] Preparar una copia desechable con base ficticia según `docs/DATABASE.md` y arrancar SQL en 3000 y NestJS en 3003.
    Resultado: entorno de comprobación operativo sin usar ni reemplazar `src/db/users.sqlite` de trabajo.

12. [x] Comprobar HTTP 200 de `/` y de los recursos de Swagger UI, y revisar el documento generado.
    Resultado: exactamente las cinco rutas de usuarios actuales, cuerpos de POST/PATCH y parámetros id visibles, sin rutas de negocio nuevas.

13. [x] Abrir la raíz en navegador y crear Ana con un email ficticio único; listar y consultar el id recibido.
    Resultado: creación 201, lista y consulta 200, con los mismos cinco campos; comprobar también una lista vacía en la base ficticia.

14. [x] Desde Swagger UI, modificar solo el nombre, solo el email y ambos campos usando el id recibido.
    Resultado: respuestas 200 con el usuario actualizado y conservación de cada campo omitido.

15. [x] Desde Swagger UI, borrar el usuario y volver a consultarlo y listarlo.
    Resultado: 204 sin cuerpo, ausencia en la lista y consulta 404 con `User not found`.

16. [x] Desde Swagger UI, probar nombre vacío, email inválido, email duplicado e id inexistente.
    Resultado: estados y mensajes actuales 400, 409 y 404 según spec, sin cambios en el filtro de errores.

17. [x] Detener SQL y ejecutar desde Swagger UI las cinco operaciones de usuarios.
    Resultado: los cinco errores 500 y mensajes de operación del plan; restablecer el entorno al terminar la comprobación.

18. [x] Arrancar Express en 3001 con `corepack pnpm http` y consultar los mismos datos durante un ciclo de usuarios.
    Resultado: Express conserva su comportamiento y comparte los datos con NestJS; confirmar el alcance de los demás clientes por revisión de cambios.

19. [x] Ejecutar `corepack pnpm format` y revisar los archivos modificados.
    Resultado: formato aplicado sin cambios ajenos al alcance aprobado.

20. [x] Ejecutar `corepack pnpm lint`.
    Resultado: revisión ESLint terminada correctamente.

21. [x] Registrar resultados reales, separando peticiones HTTP de acciones efectivamente ejecutadas en el navegador.
    Resultado: evidencia de las comprobaciones y de la preservación de lógica, consultas, servicio, módulo, filtro, datos locales y otros clientes.
