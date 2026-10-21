# first-app

Aplicación de gestión de usuarios. Permite crear, actualizar y eliminar un usuario con `id`, `name` y `email`. No tiene pantalla ni servidor: la entrada es una llamada a una función de `logic`, y la salida se guarda en SQLite.

El `id` lo asigna la base de datos. El email se guarda en minúsculas y no se puede repetir.

## Estructura

```text
first-app/
  BD/
    connection.js
    users.sqlite
    users.db
  logic/
    shared.js
    create-user.js
    update-user.js
    delete-user.js
  queries/
    users.js
    queries/
      create-user.sql
      update-user.sql
      delete-user.sql
  docs/
    CONSTITUTIONS.MD
  AGENTS.MD
```

## Componentes

**Base de datos.** Guarda a los usuarios y define cómo es la tabla: un `id` que pone SQLite, un nombre y un email que no se puede repetir. También abre el archivo de la base la primera vez que hace falta.

**Lógica.** Recibe lo que se quiere hacer, comprueba que el `id`, el nombre y el email sean válidos, y elige crear, actualizar o eliminar. Si los datos no valen, se detiene y no toca la base.

**Consultas.** Ejecuta el SQL de la operación que pidió la lógica. No revisa los datos: inserta, modifica o borra usando la base de datos.

**Documentación.** Explica el proyecto para una persona. No crea, no actualiza y no elimina usuarios. `AGENTS.MD`, en la raíz, son las instrucciones del agente y se actualizan cuando hay una instrucción nueva.

## Pasos de funcionamiento

Crear, actualizar y eliminar siguen el mismo camino.

1. Se pide una operación con los datos del usuario.
2. La lógica valida esos datos. Si no valen, lanza un `Error` y termina.
3. Las consultas ejecutan el SQL de esa operación.
4. La base de datos guarda el cambio, o lo rechaza si el email ya existe o el usuario no está.

Al crear, la base asigna el `id` y se devuelve el usuario. Al actualizar, se puede cambiar el nombre, el email o los dos, y lo que no se envía se queda igual. Al eliminar, desaparece la fila de ese `id`. Si ese usuario no existe, la operación no cambia nada y se avisa con un `Error`.
