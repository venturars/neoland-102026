# Spec — personas en Bruno

Quien prueba la app quiere crear, listar, ver, cambiar y borrar personas desde Bruno, sin escribir cada petición a mano.

No hay login. La base real sigue en el puerto 3000 y no se para. El programa JSON sigue en el puerto 3001 y no cambia lo que ya responde. El ensayo usa personas inventadas, en una copia aparte, y deja la lista real como estaba. Arranca con `npm run db` y `npm run api` desde `first-app`.

Con la lista del ensayo vacía, crear pide el nombre y el email. Sale la persona guardada: el número, el nombre, el email y las dos fechas. Listar no pide nada y sale la lista. Ver una pide el número y sale esa persona. Cambiar pide el número y el nombre, el email o los dos. Un dato que no entra conserva el valor guardado. Borrar pide el número y responde el número de la persona borrada.

Ejemplo: se crea Ada con ada@example.com. Sale el número, el nombre Ada y el email ada@example.com. La lista la muestra. Se pide ese número y se ven los mismos datos, con las dos fechas. Se cambia el nombre a Ada Lovelace. Se ve el mismo número, el nombre Ada Lovelace y el email ada@example.com. Si se borra, la respuesta es ese número y Ada ya no sale en la lista.

Si el nombre queda vacío, se ve `Name is empty`.

Si el email no vale, se ve `Email is invalid`.

Si el email es de otra persona, se ve `Email is already used`.

Si esa persona no está, se ve `User not found`.

Si la dirección no existe, se ve `Not found.`

Si la base del ensayo no está en marcha y el programa JSON sí, se ve `Database is not running. Start it with npm run db.`

La guía dice cómo preparar el ensayo, abrir la colección en Bruno dentro de VS Code y lanzar primero las peticiones con la base del ensayo en marcha y después las de esa base parada. También sirve en Windows.

## Few-shot

- La lista del ensayo está vacía.
- Se crea Ada. Se ven el número, el nombre Ada, el email ada@example.com y las dos fechas.
- La lista la muestra. Pedir su número muestra lo mismo.
- Se cambia solo el nombre. El número y el email siguen.
- Se cambia solo el email. El número y el nombre siguen.
- El nombre se deja vacío. Se ve `Name is empty`. Ada no cambia.
- Se borra Ada. La respuesta es su número y la lista queda vacía.
- Con el programa JSON abierto y la base del ensayo parada, se ve `Database is not running. Start it with npm run db.`

Queda fuera el login, el recuento por género, buscar por nombre y buscar por email. No hay frase nueva ni regla nueva. La terminal, Jupyter, la página, la ventana y el programa JSON siguen igual.
