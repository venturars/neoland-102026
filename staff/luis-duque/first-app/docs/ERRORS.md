# Errores

Si los datos no valen, la lógica se detiene y no toca la base. Lanza un `Error` y termina.

La base rechaza el cambio si el email ya existe o el usuario no está.

Si ese usuario no existe, la operación no cambia nada y se avisa con un `Error`. Al buscar, si no existe, se avisa con un `Error`.

Si no hay ninguno con ese nombre, lanza `User ${name} was not found` y no cambia los usuarios guardados. Un nombre vacío se rechaza. Un nombre de más de 100 caracteres se rechaza.

Si Ollama no contesta, o la lectura falla, se detiene y lanza un `Error` con el texto `no se han podido clasificar usuarios`.

Si el programa local no está en marcha, la operación no se completa y se ve el fallo de esa llamada.

Si el cliente HTTP no está en marcha, Postman no completa la petición.

Si el cliente NestJS no está en marcha, Postman no completa la petición y `http://127.0.0.1:3003/swagger` no se abre.

Si Electron no abre la ventana, no se puede pedir la operación desde ahí. Si el programa local no está en marcha, la ventana muestra el fallo de esa llamada.

Si el popup de Chrome no se abre, no se puede pedir la operación desde ahí. Si su programa no está en marcha, el popup muestra el fallo de esa llamada. Si el programa de consultas no está en marcha, el popup muestra el fallo que devuelve su programa.

Si la extensión de Visual Studio Code no se abre, no se puede pedir la operación desde ahí. Si el programa de consultas no está en marcha, la vista muestra el fallo de esa llamada.
