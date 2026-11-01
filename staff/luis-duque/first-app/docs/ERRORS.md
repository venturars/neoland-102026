# Errores

Si los datos no valen, la lógica se detiene y no toca la base. Lanza un `Error` y termina.

La base rechaza el cambio si el email ya existe o el usuario no está.

Si ese usuario no existe, la operación no cambia nada y se avisa con un `Error`. Al buscar, si no existe, se avisa con un `Error`.

Si no hay ninguno con ese nombre, lanza `User ${name} was not found` y no cambia los usuarios guardados. Un nombre vacío se rechaza. Un nombre de más de 100 caracteres se rechaza.

Si Ollama no contesta, o la lectura falla, se detiene y lanza un `Error` con el texto `no se han podido clasificar usuarios`.
