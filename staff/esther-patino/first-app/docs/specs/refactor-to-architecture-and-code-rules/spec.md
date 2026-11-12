# El código sigue las guías y la app hace lo mismo

Quien usa first-app sigue creando un usuario, listándolos, buscando uno, cambiándolo, borrándolo y contando los usuarios ya guardados según el sexo que sugiere su nombre. El código pasa a seguir las reglas de arquitectura y de código que ya están escritas. Lo que se ve no cambia.

Lo usa quien trabaja con la app desde la terminal y quien comprueba que el resultado es el de antes.

Entran las mismas acciones de ahora y las guías ya escritas. No entra un dato nuevo ni una acción nueva.

Sale lo mismo que ahora:

- Un usuario es un objeto con `id`, `name`, `email`, `createdAt` y `updatedAt`, y ningún otro campo. El `id` y las fechas los pone la base de datos. El email queda en minúsculas.
- Listar devuelve esos usuarios. Si no hay ninguno, la lista va vacía.
- Buscar por email o por id devuelve ese usuario.
- Buscar por nombre devuelve los usuarios con ese nombre.
- Cambiar devuelve el usuario ya cambiado.
- Borrar no devuelve el usuario.
- El recuento es un objeto con `women`, `men` y `undefinedUser`, y ningún otro campo. Si no hay usuarios, los tres números son 0. El sexo no se guarda.

Ejemplo: se crea un usuario con el nombre `Ana` y el email `Ana@Example.com`. Vuelve el usuario con el nombre `Ana`, el email `ana@example.com`, un `id` y las dos fechas. Listarlo, buscarlo, cambiarlo, borrarlo y contar el sexo del nombre dan el mismo tipo de resultado que antes de este cambio.

Si el nombre no vale, se ve `Name is empty`. Si el email no vale, se ve `Email is invalid`. Si ese email ya está en otro usuario, se ve `Email is already used`. Si el id no vale, se ve `Invalid id`. Si se busca, se cambia o se borra alguien que no está, se ve `User not found`. Si falla la búsqueda por nombre, se ve `Could not find the user`. Si la cuenta del sexo no puede hacerse, se ve `Could not classify the users`. Un mensaje distinto no se acepta.

Si una acción deja de hacer lo que hace ahora, no se acepta. Si aparece un campo nuevo o desaparece uno de los de ahora, no se acepta. Si el código no sigue las reglas de arquitectura y de código ya escritas, no se acepta.

Queda fuera añadir una acción, cambiar las guías, cambiar los datos ya guardados y cambiar las frases de error.
