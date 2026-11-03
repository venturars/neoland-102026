# Spec: Cliente de navegador

Issue: #768.

## Qué queremos conseguir
Que quien usa first-app gestione su usuario desde el navegador, sin pegar comandos en la terminal. Las pantallas usan las operaciones de usuarios que ya existen: las reglas y los mensajes de error no cambian.

## Cómo se usa
Se arranca el cliente desde `first-app/` y se abre en el navegador la dirección que indica. Hay tres pantallas, con los textos en español.

### 1. Elegir quién soy
- Sale la lista de usuarios guardados, de menor a mayor id, con su id, su nombre y su email.
- Se elige un usuario pulsando su fila. No se pide contraseña.
- Si no hay usuarios, se ve un texto que dice que la lista está vacía. No es un error.

### 2. Opciones del usuario
- Arriba se ve el usuario elegido: id, nombre y email.
- Tres botones:
  - **Volver**: vuelve a la lista.
  - **Modificar**: abre la pantalla 3.
  - **Notas**: se ve, pero está desactivado y lleva una nota que dice que llegará más adelante. Pulsarlo no hace nada.

### 3. Modificar o eliminar
- Dos campos, nombre y email, rellenos con los datos actuales.
- **Guardar**: guarda los cambios y vuelve a la pantalla 2 con los datos nuevos.
  - Un campo vacío no cambia ese dato, igual que en la terminal.
  - Si algo falla, el usuario no cambia y se ve `Error: <mensaje>` con el mensaje de [ERRORS.md](../../ERRORS.md).
- **Eliminar**: pide confirmación.
  - Si se cancela, no pasa nada.
  - Si se confirma, se borra el usuario y se vuelve a la lista, que ya no lo muestra.
- **Volver**: vuelve a la pantalla 2 sin guardar nada.

## Errores
Los da la lógica que ya existe; el navegador solo los muestra:
- Email con mala forma: `Error: Invalid email: <email>`.
- Email de otro usuario: `Error: Email already exists: <email>`.
- Nombre y email vacíos a la vez: `Error: Provide a new name, a new email, or both.`
- El usuario ya no existe (lo borraron desde otro sitio): `Error: User not found: id <id>`.

## Ejemplo
Guardados: Ana (`ana@mail.com`, id 2) y Pedro (`pedro@mail.com`, id 18).
- La lista muestra la 2 y después la 18.
- Se elige la 2 y se cambia el nombre a `Ana López`. Al guardar, la pantalla 2 muestra `Ana López`. Al volver a la lista, la 2 sale con el nombre nuevo y Pedro sigue igual.
- Se pone `pedro@mail.com` como email de Ana: `Error: Email already exists: pedro@mail.com`, y Ana sigue con su email.
- Se borra la 2 y se cancela: Ana sigue. Se confirma: la lista solo muestra a Pedro.

## Fuera de alcance
- Contraseñas o cualquier tipo de inicio de sesión.
- Crear usuarios, buscar por email o por nombre, y clasificar por género desde estas pantallas.
- La pantalla de notas.
- Frameworks o librerías de frontend.
- Cambiar `src/logic/`, `src/queries/`, `src/db/`, la tabla o los clientes de terminal y Jupyter.
