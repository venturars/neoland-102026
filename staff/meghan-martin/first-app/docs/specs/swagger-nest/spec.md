# Spec — página Swagger del cliente Nest

Issue: #1083.

Quien prueba el cliente Nest quiere ver y lanzar las peticiones desde el navegador, sin escribirlas a mano.

Lo usa quien ya prueba crear, listar, ver, cambiar y borrar personas en `http://127.0.0.1:3003`.

Se deja la base en marcha y se arranca el cliente Nest desde `first-app`. En el mismo programa hay una página en `http://127.0.0.1:3003`. Muestra las cinco acciones que ese cliente ya tiene. Se elige una, se rellenan los datos y se envía. La respuesta se ve en la página.

Las acciones son las de siempre:

- Crear entra el nombre y el email.
- Listar no entra nada.
- Ver uno entra el id.
- Cambiar entra el id y el nombre, el email o los dos. Lo que no entra conserva el valor guardado.
- Borrar entra el id.

Sale lo mismo que ya devuelve el cliente Nest. La persona trae el id, el nombre, el email y las dos fechas. Al listar, sale la lista. Al borrar, no sale una persona.

Ejemplo. Con la base y el cliente Nest en marcha, se abre la página. Se crea Ada con `ada@example.com`. La respuesta es 201 y trae el id, el nombre Ada, el email y las dos fechas. Desde la misma página se lista, se pide ese id, se cambia el nombre a Ada Lovelace y se borra. Cada respuesta coincide con la del cliente Nest sin la página.

Un nombre vacío se ve `Name is empty`, con 400.

Un email que no vale se ve `Email is invalid`, con 400.

Un email de otra persona se ve `Email is already used`, con 409.

Un id que no está se ve `User not found`, con 404.

Si no se llega a la base, se ve el `Could not` de esa acción, con 500. Un id que no es un entero mayor o igual que 1 también se ve como ese `Could not`, con 500. Es lo que el cliente Nest ya hace.

Si no hay personas, la lista está vacía. No es un fallo.

Otra ruta del programa sigue respondiendo 404, sin cuerpo.

No cambian las reglas de las personas. Esta página solo muestra y prueba la API que ya existe. No sustituye al programa del puerto 3001 ni a la base.

Queda fuera la contraseña, contar por género, buscar por nombre, buscar por email, una pantalla propia de la app, una regla nueva, una frase nueva y cambiar lo que ya hacen los otros clientes. Las guías de estilo y de errores siguen igual.
