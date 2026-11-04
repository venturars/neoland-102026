# Spec — personas en VS Code

Quien usa la app quiere crear, listar, ver, cambiar y borrar personas desde una vista en el explorador de VS Code, sin salir del editor.

No hay login. La base sigue en el puerto 3000. Desde `first-app`, con `npm run db` en marcha, `npm run vscode` abre una ventana de desarrollo. La vista se llama People y está en la barra lateral. Al cerrar VS Code se cierra. Se vuelve a abrir con el mismo comando.

La lista muestra el número, el nombre, el email y las dos fechas. Crear pide nombre y email y muestra a la persona creada. Ver pide un número y muestra a esa persona. Cambiar pide el número y un nombre nuevo, un email nuevo, o los dos. Borrar pide el número y la lista ya no la muestra.

Un nombre vacío muestra `Name is empty`. Un email que no vale muestra `Email is invalid`. Un email que ya es de otra persona muestra `Email is already used`. Un número que no existe muestra `User not found`. Un número que no vale muestra `Invalid id`. Si la base no está en marcha, se ve `Database is not running. Start it with npm run db.`

## Few-shot

- Se crea Ada con `ada@example.com`. Se ven su número, el nombre Ada, el email y las dos fechas. La lista la muestra.
- Se pide ese número. Se ven los mismos datos.
- Se cambia el nombre a Ada Lovelace. El número y el email siguen.
- Se borra. Ada ya no sale en la lista.
- El nombre se deja vacío. Se ve `Name is empty`.
- El email no lleva `@`. Se ve `Email is invalid`.
- El email ya es de otra persona. Se ve `Email is already used`.
- Se pide un número que no existe. Se ve `User not found`.

Queda fuera buscar por nombre, el recuento por género, el login y publicar la extensión. Las reglas no cambian. La terminal, Jupyter, la página y los otros clientes siguen igual.
