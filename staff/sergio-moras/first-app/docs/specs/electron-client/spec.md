# Spec: Cliente de escritorio

Issue: #974.

## Qué queremos conseguir
Que quien usa first-app gestione los usuarios desde una aplicación de escritorio con su propia ventana, sin el navegador, la terminal ni Jupyter. La ventana usa las operaciones de usuarios que ya existen, las de `src/logic/`: las reglas y los mensajes no cambian.

## Cómo se usa
Desde `first-app/` se arranca la base (`pnpm db`). En otra terminal, `pnpm electron` abre la ventana. Cerrarla cierra la aplicación. Los textos están en español. Hay dos pantallas.

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

## Errores
Los da la lógica que ya existe, con los mensajes de [ERRORS.md](../../ERRORS.md). La ventana solo los muestra:
- Alta con el nombre vacío: `Error: Name is required.`
- Alta con el email vacío: `Error: Email is required.`
- Email con mala forma, al dar de alta o al guardar: `Error: Invalid email: <email>`.
- Email de otro usuario, al dar de alta o al guardar: `Error: Email already exists: <email>`.
- Guardar con los dos campos vacíos: `Error: Provide a new name, a new email, or both.`
- El usuario ya no existe porque lo borraron desde otro sitio: `Error: User not found: id <id>`.
- La base no está arrancada: `Error: Database is not running. Start it with pnpm db.`, en la pantalla en la que se esté.

## Ejemplo
Con la base arrancada, se da de alta «Prueba» con `prueba@example.com`. Sale en la lista con su id. Al pulsarlo, la ficha enseña su id, su nombre, su email y las dos fechas. Se cambia el email a `prueba2@example.com` y se guarda: la ficha y la lista enseñan el email nuevo. Se borra, se confirma y la lista ya no lo tiene.

## Fuera de alcance
- Generar un instalador.
- Usar las pantallas o los ficheros del cliente de navegador.
- Buscar por nombre o por email y contar por género.
- Funciones, consultas, reglas o mensajes nuevos.
- Cambiar los otros clientes, `src/logic/`, `src/queries/`, `src/db/` o la tabla.
