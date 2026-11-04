# Spec — base en un programa local

Quien usa la app sigue viendo las mismas personas, con los mismos errores, desde la terminal, desde Jupyter y desde la página.

Antes de usarlas hay que arrancar la base. El programa escribe la dirección en la que escucha y se queda en marcha hasta que se para.

Si la base no está arrancada, cualquier operación termina con `Database is not running. Start it with npm run db.`

Con la base en marcha, listar, crear, buscar, cambiar y borrar dan el mismo resultado que antes. Crear la tabla sigue siendo un paso aparte y no borra a las personas que ya están.

## Ejemplo

Con la base parada, la lista no sale y se ve `Database is not running. Start it with npm run db.`

Con la base en marcha, la lista muestra las mismas personas. Cambiar un nombre vacío sigue mostrando `Name is empty` y no guarda. Un email que no vale sigue mostrando `Email is invalid`.

Queda fuera una pantalla nueva, el login, cambiar las reglas del nombre o del email, y cambiar los datos ya guardados.
