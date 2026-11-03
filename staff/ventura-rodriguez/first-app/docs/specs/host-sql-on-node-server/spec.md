# Base de datos en un servidor

Issue: #806.

Quien usa una acción de la app llega a los mismos datos que ahora. La
base de datos corre en un servidor Node. El texto de cada consulta
sigue aparte de quien la usa. Quien llama espera la respuesta del
servidor.

Lo usa quien prueba la app. También quien quiere llamar a las reglas
desde un cliente escrito en JavaScript del navegador.

Entra lo mismo que ya entra en cada acción. Sale lo mismo.

Ejemplo al guardar a Ada, ada@example.com, con id 1 y fecha
2026-10-21 13:00:00:

{ id: 1, name: "Ada", email: "ada@example.com", createdAt: "2026-10-21 13:00:00", updatedAt: "2026-10-21 13:00:00" }

Si el dato de entrada es malo, se ve el mensaje que esa acción ya
usa: `Name is empty`, `Email is invalid`, `Email is already used` o
`User not found`.

Si no se llega a la base, se ve el mensaje que esa acción ya usa:
`Could not create the user`, `Could not update the user`, `Could not
delete the user`, `Could not list the users`, `Could not find the
user` o `Could not classify the users`.

Queda fuera construir el cliente del navegador, una acción nueva, un
mensaje nuevo, cambiar lo que se guarda y poner un servicio entre las
reglas y quien las llama.
