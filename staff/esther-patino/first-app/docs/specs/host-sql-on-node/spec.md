# Base en un servidor

Issue: #818.

Quien usa first-app sigue creando un usuario, listándolos, buscando uno, cambiándolo, borrándolo y contando los usuarios ya guardados según el sexo que sugiere su nombre. Lo que se ve no cambia. Los usuarios ya guardados siguen ahí.

La base de datos pasa a atenderse desde un programa encendido en este equipo. Quien pide los datos ya no abre la base por su cuenta: se los pide a ese programa. El texto de cada consulta sigue aparte de quien la usa. Quien llama a una regla espera la respuesta. Así, en un trabajo posterior, se podrá usar la app desde el navegador con JavaScript del navegador. Ese cliente no entra aquí. Tampoco entra una puerta entre las reglas de negocio y ese cliente.

Lo usa quien trabaja con la app desde la terminal, quien la comprueba desde Jupyter y quien ya elige, cambia y borra un usuario en las tres pantallas.

Entran las mismas acciones de ahora. No entra un dato nuevo ni una acción nueva.

Sale lo mismo que ahora:

- Un usuario es un objeto con `id`, `name`, `email`, `createdAt` y `updatedAt`, y ningún otro campo. El `id` y las fechas los pone la base de datos. El email queda en minúsculas.
- Listar devuelve esos usuarios. Si no hay ninguno, la lista va vacía.
- Buscar por email o por id devuelve ese usuario.
- Buscar por nombre devuelve los usuarios con ese nombre.
- Cambiar devuelve el usuario ya cambiado.
- Borrar no devuelve el usuario.
- El recuento es un objeto con `women`, `men` y `undefinedUser`, y ningún otro campo. Si no hay usuarios, los tres números son 0. El sexo no se guarda.

Ejemplo: se crea un usuario con el nombre `Ada` y el email `ada@example.com`. Vuelve el usuario con el nombre `Ada`, el email `ada@example.com`, un `id` y las dos fechas. Listarlo, buscarlo, cambiarlo, borrarlo y contar el sexo del nombre dan el mismo tipo de resultado que antes. Los usuarios que ya estaban siguen pudiéndose leer. Esos datos siguen ahí al abrir la aplicación otra vez.

Si el nombre no vale, se ve `Name is empty`. Si el email no vale, se ve `Email is invalid`. Si ese email ya está en otro usuario, se ve `Email is already used`. Si el id no vale, se ve `Invalid id`. Si se busca, se cambia o se borra alguien que no está, se ve `User not found`. Si falla la búsqueda por nombre, se ve `Could not find the user`. Si la cuenta del sexo no puede hacerse, se ve `Could not classify the users`. Un mensaje distinto no se acepta.

Si una acción deja de hacer lo que hace ahora, no se acepta. Si los usuarios ya guardados desaparecen, no se acepta. Si quien pide los datos sigue abriendo la base por su cuenta, no se acepta.

Queda fuera el cliente de JavaScript del navegador de un trabajo posterior, una puerta entre las reglas y ese cliente, pedir contraseña, crear un usuario desde las pantallas, la pantalla de notas, añadir una acción, cambiar las frases de error y añadir un paquete.
