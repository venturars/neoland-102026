# Spec — personas por HTTP

Quien usa la app quiere crear, listar, buscar, cambiar y borrar personas con peticiones HTTP, sin la terminal, Jupyter ni la página.

No hay login. La base sigue en el puerto 3000. Este programa escucha en el puerto 3001 y responde JSON. Arranca con `npm run api` desde `first-app`, con `npm run db` ya en marcha.

Crear pide nombre y email y responde la persona guardada. Listar responde todas. Buscar por número o por email responde una. Cambiar acepta un nombre nuevo, un email nuevo, o los dos. Borrar responde el número de la persona borrada. El recuento por género responde las cuentas. Si la base no está en marcha, se ve `Database is not running. Start it with npm run db.`

## Few-shot

- Se crea una persona. La respuesta trae su número, nombre y email.
- La lista incluye a esa persona. Buscarla por número y por email devuelve la misma.
- Se cambia el nombre. La siguiente lectura muestra el nombre nuevo.
- El email no lleva `@`. La respuesta es `Email is invalid`. No se guarda.
- El email ya es de otra persona. La respuesta es `Email is already used`. Ninguna cambia.
- Se pide un número que no existe. La respuesta es `User not found`.
- Se borra. Una lectura posterior responde `User not found`.

Queda fuera buscar por nombre, el login y cambiar las reglas del nombre y del email. La terminal, Jupyter y la página siguen igual.
