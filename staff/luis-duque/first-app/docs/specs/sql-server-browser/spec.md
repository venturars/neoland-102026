# Pantallas en el navegador

Quien usa la app elige un usuario ya guardado, pasa por un menú y puede modificarlo o eliminarlo desde pantallas simples en el navegador. No hace falta la terminal ni Jupyter para eso.

No se crean usuarios desde esas pantallas. No se cuenta el género. No es una aplicación de escritorio.

## Lista

Se ven los usuarios ya guardados. Cada uno muestra el id, el nombre y el email. Se elige uno escribiendo su id.

Si no hay usuarios, la lista se ve vacía. Elegir un id que no está no abre el menú.

## Menú

Tras elegir un usuario hay tres caminos: volver a la lista, modificar ese usuario o abrir notas.

Volver a la lista no cambia los datos.

## Modificar

Se puede cambiar el nombre, el email o los dos, y guardar. También se puede eliminar ese usuario.

Entra el mismo nombre y el mismo email que ya entran al modificar. Si no valen, se ve el mismo fallo de siempre y no se guarda el cambio.

Si ese usuario ya no está, no se cambia nada y se ve el mismo fallo de siempre.

Al guardar o al eliminar se vuelve a la lista, y la lista ya muestra el cambio.

## Notas

La pantalla de notas no tiene utilidad. No lee, no guarda y no borra. Desde ahí se vuelve al menú.

## Consultas en un programa local

La base sigue siendo la misma. Quien ejecuta una consulta no abre el archivo: se lo pide a un programa local que solo ejecuta consultas. Ese programa responde en el propio equipo, en `127.0.0.1`, puerto `3000`.

El texto de cada consulta deja de estar en un archivo aparte y pasa a vivir junto a quien pide ejecutarla.

Las pantallas piden listar, modificar y eliminar a la lógica que ya existe. No hay otra vía de usuarios entre la pantalla y esa lógica.

Con el programa local en marcha, listar, modificar y eliminar desde la terminal o desde Jupyter siguen igual.

Si el programa local no está en marcha, ni las pantallas ni esas operaciones pueden completarse.

Desde la app, un comando arranca el programa local y otro abre el navegador. El del navegador vale en Windows.
