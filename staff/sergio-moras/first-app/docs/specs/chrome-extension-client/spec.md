# Spec: Cliente de extensión de Chrome

Issue: #998.

## Qué queremos conseguir
Que quien usa first-app gestione los usuarios desde una extensión de Chrome, sin abrir otra aplicación, la terminal ni Jupyter. La extensión habla con una API propia, y esa API usa las operaciones de usuarios que ya existen, las de `src/logic/`: las reglas y los mensajes no cambian.

## Cómo se usa
Desde `first-app/` se arranca la base (`pnpm db`) y, en otra terminal, la API de la extensión (`pnpm chrome`). La extensión se carga una sola vez en Chrome, desde `chrome://extensions`, y se abre con su icono. Los textos están en español. Hay dos pantallas dentro de la ventanita de la extensión.

### 1. Usuarios
- La lista de usuarios, de menor a mayor id, con su id, su nombre y su email.
- Si no hay usuarios, se ve un texto que dice que no hay ninguno. No es un error.
- Un alta con dos campos, nombre y email, y el botón **Dar de alta**.
  - Si sale bien, los campos se vacían y el usuario nuevo aparece en la lista.
  - Si falla, no se crea nada, los campos se quedan como estaban y se ve `Error: <mensaje>`.
- Pulsar un usuario abre su ficha.

### 2. Ficha
- Todos los datos del usuario: id, nombre, email, fecha de alta y fecha del último cambio.
- Dos campos, nombre y email, rellenos con los datos actuales, y el botón **Guardar**.
  - Un campo vacío no cambia ese dato, igual que en la terminal.
  - Si sale bien, la ficha enseña los datos nuevos y la lista también.
  - Si falla, el usuario no cambia y se ve `Error: <mensaje>`.
- **Borrar** pide confirmación. Si se cancela, no pasa nada. Si se confirma, se borra y se vuelve a la lista, que ya no lo muestra.
- **Volver** vuelve a la lista sin guardar nada.

### La API
- Escucha solo en este equipo, en `http://127.0.0.1:3001`, y se para con Ctrl+C.
- Tiene una ruta por operación de la extensión: listar, dar de alta, modificar y borrar. Responde en JSON.
- Si `logic` lanza un error, responde con ese mensaje tal cual y un código HTTP que dice qué tipo de fallo es.
- Solo la usa esta extensión: una página web no puede llamarla.

## Errores
Los da la lógica que ya existe, con los mensajes de [ERRORS.md](../../ERRORS.md). La extensión solo los muestra:
- Alta con el nombre vacío: `Error: Name is required.`
- Alta con el email vacío: `Error: Email is required.`
- Email con mala forma, al dar de alta o al guardar: `Error: Invalid email: <email>`.
- Email de otro usuario, al dar de alta o al guardar: `Error: Email already exists: <email>`.
- Guardar con los dos campos vacíos: `Error: Provide a new name, a new email, or both.`
- El usuario ya no existe porque lo borraron desde otro sitio: `Error: User not found: id <id>`.
- La base no está arrancada: `Error: Database is not running. Start it with pnpm db.`, en la pantalla en la que se esté.

El único mensaje nuevo es de la extensión, no de la lógica:
- La API no está arrancada: `Error: API is not running. Start it with pnpm chrome.`, en la pantalla en la que se esté.

## Ejemplo
Con la base y la API arrancadas, se abre la extensión y se da de alta «Prueba» con `prueba@example.com`. Sale en la lista con su id. Al pulsarlo, la ficha enseña su id, su nombre, su email y las dos fechas. Se cambia el nombre a «Prueba Dos» y se guarda: la ficha y la lista enseñan el nombre nuevo. Se borra, se confirma y la lista ya no lo tiene.

## Fuera de alcance
- Publicar la extensión en la tienda de Chrome o empaquetarla.
- Usar las pantallas de los otros clientes o la API REST de `src/clients/rest/`.
- Buscar por nombre o por email y contar por género.
- Funciones, consultas, reglas o mensajes nuevos en la lógica.
- Cambiar los otros clientes, `src/logic/`, `src/queries/`, `src/db/` o la tabla.
