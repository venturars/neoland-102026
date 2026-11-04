# Cliente VS Code

Issue: #969.

Quien prueba la app gestiona usuarios desde un panel lateral en VS Code.
No hay contraseña.

Lo usa quien prueba la app dentro del editor.

Se abre desde la barra lateral o la paleta de comandos. La base tiene que
estar en marcha con el comando `server`, porque las acciones son las de
la app y el panel no abre SQLite directamente.

Entra el nombre y el email al crear. Entra un criterio de búsqueda por
nombre, email o id. Al modificar entran el nombre y el email del usuario
elegido. Al borrar entra el email guardado como confirmación.

La primera vista lista los usuarios ordenados por id. Cada uno se ve con
su id, su nombre y su email. Si no hay usuarios, se indica en español que
la lista está vacía.

Se puede crear un usuario, buscar por nombre (coincidencia exacta
respetando mayúsculas), por email (coincidencia exacta tras quitar
espacios en los extremos, sin distinguir mayúsculas) o por id (reglas
existentes). Si la búsqueda no devuelve resultados, se indica en
español.

Se puede elegir un usuario, cambiar nombre y email, o borrarlo solo
después de escribir el email guardado (ignorando espacios en los
extremos y mayúsculas en el email). Si la confirmación no coincide, no
se borra y se puede corregir o cancelar.

Ejemplo: en la lista está Ada, ada@example.com, con id 1. Se crea Bob
con bob@example.com. Se busca «Ada» y solo aparece Ada si el nombre
guardado coincide en mayúsculas. Se cambia el nombre de Ada a Ada
Lovelace. Se ve el id 1, el nombre Ada Lovelace y el email
ada@example.com. Para borrar, se escribe ada@example.com; entonces Ada
ya no sale en la lista.

Si el nombre queda vacío, se ve `Name is empty`.

Si el email no vale, se ve `Email is invalid`.

Si el email es de otro usuario, se ve `Email is already used`.

Si el id no vale, se ve `User id is not valid`.

Si ese usuario no está, se ve `No user exists with that id`.

Si no se llega a la base al crear, se ve `Could not create the user`.

Si no se llega al listar, se ve `Could not list the users`.

Si no se llega al modificar, se ve `Could not update the user`.

Si no se llega al borrar, se ve `Could not delete the user`.

Si no se llega al buscar por id, se ve `Could not find the user`.

Las etiquetas, botones y estados vacíos del panel están en español.

Queda fuera reutilizar la interfaz del cliente browser, arrancar solo
desde la API REST, contar por género, notas, autenticación, publicar en
Marketplace, VS Code Web o remoto, arrancar automáticamente el servidor
de base, una acción nueva, un mensaje nuevo y cambiar lo que ya hace
cada acción.
