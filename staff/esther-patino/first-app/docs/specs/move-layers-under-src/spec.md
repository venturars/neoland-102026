# Capas dentro de src

Issue: #594.

Quien usa first-app sigue creando un usuario, listándolos, buscando uno, cambiándolo, borrándolo y contando los usuarios ya guardados según el sexo que sugiere su nombre. Los datos, las consultas, las reglas y las formas de probarlo pasan a vivir juntos en una carpeta llamada src. Lo que se ve no cambia. Los usuarios ya guardados siguen ahí.

Lo usa quien trabaja con la app desde la terminal y quien la comprueba desde Jupyter.

Entran las mismas acciones de ahora. No entra un dato nuevo ni una acción nueva.

Sale lo mismo que ahora:

- Un usuario es un objeto con `id`, `name`, `email`, `createdAt` y `updatedAt`, y ningún otro campo. El `id` y las fechas los pone la base de datos. El email queda en minúsculas.
- Listar devuelve esos usuarios. Si no hay ninguno, la lista va vacía.
- Buscar por email o por id devuelve ese usuario.
- Buscar por nombre devuelve los usuarios con ese nombre.
- Cambiar devuelve el usuario ya cambiado.
- Borrar no devuelve el usuario.
- El recuento es un objeto con `women`, `men` y `undefinedUser`, y ningún otro campo. Si no hay usuarios, los tres números son 0. El sexo no se guarda.

Ejemplo: se crea un usuario con el nombre `Ada` y el email `ada@example.com`. Vuelve el usuario con el nombre `Ada`, el email `ada@example.com`, un `id` y las dos fechas. Listarlo, buscarlo, cambiarlo, borrarlo y contar el sexo del nombre dan el mismo tipo de resultado que antes. Los usuarios que ya estaban siguen pudiéndose leer.

Si el nombre no vale, se ve `Name is empty`. Si el email no vale, se ve `Email is invalid`. Si ese email ya está en otro usuario, se ve `Email is already used`. Si el id no vale, se ve `Invalid id`. Si se busca, se cambia o se borra alguien que no está, se ve `User not found`. Si falla la búsqueda por nombre, se ve `Could not find the user`. Si la cuenta del sexo no puede hacerse, se ve `Could not classify the users`. Un mensaje distinto no se acepta.

Si una acción deja de hacer lo que hace ahora, no se acepta. Si los usuarios ya guardados desaparecen, no se acepta. Si los datos, las consultas, las reglas o las formas de probarlo siguen fuera de src, no se acepta.

Queda fuera añadir una acción, cambiar las frases de error, cambiar el SQL, añadir un paquete y reescribir las specs ya cerradas.
