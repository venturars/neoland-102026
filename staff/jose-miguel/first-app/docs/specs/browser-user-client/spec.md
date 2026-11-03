# Spec · Cliente de navegador SSR (sin API)

Issue: #779

## 1. Problema

Quien prueba first-app ya puede gestionar usuarios desde terminal y Jupyter. Falta un cliente en el navegador para elegir quién eres, ver opciones y modificar o borrar ese usuario, sin pegar comandos y sin añadir una API REST ni `fetch`.

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien prueba la app** | Abrir una URL local, elegir un usuario de una lista por id (sin contraseña) y usar tres pantallas sencillas. |
| **Quien desarrolla** | Un cliente nuevo que solo importa `src/logic/`, sin tocar logic, queries, terminal, jupyter ni guías ya existentes. |

## 3. Historias de usuario

- **HU-01**: Como quien prueba la app, quiero ver la lista de usuarios con id, nombre y email, para elegir el mío por id sin contraseña.
- **HU-02**: Como quien prueba la app, quiero un menú con volver a la lista, modificar e «Ir a notas» deshabilitada, para saber qué puedo hacer con el usuario elegido.
- **HU-03**: Como quien prueba la app, quiero editar nombre y email o borrar el usuario, con confirmación al borrar y sin guardar si vuelvo atrás, para mantener los datos como en terminal.

## 4. Criterios de aceptación

- **CA-01**: **Dado** usuarios ya guardados, **cuando** se abre la URL del cliente, **entonces** la primera pantalla lista id, nombre y email y permite elegir uno por id.
- **CA-02**: **Dado** ningún usuario guardado, **cuando** se abre la primera pantalla, **entonces** se indica que la lista está vacía (no es un error de logic).
- **CA-03**: **Dado** un id elegido de un usuario existente, **cuando** se confirma la selección, **entonces** la segunda pantalla muestra id, nombre y email y ofrece volver, modificar e «Ir a notas» deshabilitada.
- **CA-04**: **Dado** el menú del usuario, **cuando** se pulsa volver, **entonces** se vuelve a la lista de selección sin conservar la elección en la sesión del navegador (al recargar también se vuelve a la lista).
- **CA-05**: **Dado** el menú, **cuando** se pulsa modificar, **entonces** la tercera pantalla muestra nombre y email editables con los datos guardados.
- **CA-06**: **Dado** la pantalla de edición, **cuando** se guarda con datos válidos, **entonces** el menú refleja los datos nuevos y persisten al cerrar y volver a abrir el cliente.
- **CA-07**: **Dado** la pantalla de edición, **cuando** se vuelve sin guardar tras cambiar campos, **entonces** se muestran otra vez los últimos datos guardados en el menú.
- **CA-08**: **Dado** la pantalla de edición, **cuando** se intenta guardar con reglas incumplidas, **entonces** se muestra el mismo mensaje en inglés que lanza `src/logic/` y los campos no se vacían.
- **CA-09**: **Dado** la pantalla de edición, **cuando** se cancela el borrado, **entonces** el usuario sigue existiendo; **cuando** se confirma, **entonces** desaparece de la lista y los demás usuarios no cambian.
- **CA-10**: **Dado** el repositorio antes de este cambio, **cuando** se añade el cliente, **entonces** no hay diff en `package.json`, `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/TREE.md`, `docs/CONSTITUTIONS.md`, `docs/STYLE.md`, `src/logic/`, `src/queries/`, terminal ni jupyter; terminal y `pnpm jupyter` siguen funcionando igual.

## 5. Fuera de alcance

- Contraseñas, autenticación o permisos.
- Crear usuarios desde el navegador.
- Pantalla o CRUD de notas (solo botón «Ir a notas» visible y deshabilitado).
- Rutas `/api/*`, JSON como contrato de pantalla o `fetch` en el navegador.
- Frameworks o librerías de frontend; paquetes npm nuevos.
- Modificar ficheros existentes fuera de `docs/specs/browser-user-client/` y `src/clients/browser/`.

## 6. Arranque del frontend

Documentación detallada: [`src/clients/browser/README.md`](../../../src/clients/browser/README.md).

1. Abrir terminal en la raíz de first-app: `staff/jose-miguel/first-app`.
2. Ejecutar: `node src/clients/browser/start-browser-server.js`.
3. En el navegador, abrir **http://127.0.0.1:3000**.
4. Parar el servidor con **Ctrl+C** en la terminal.

No hay script en `package.json` para este cliente (CA-10). Si el puerto 3000 está ocupado, cerrar el otro proceso o cambiar el puerto en código en una entrega futura.

## 7. Preguntas abiertas

Ninguna. La confirmación de borrado usa `window.confirm` en el HTML servido (JS mínimo).

## 8. Historial

| Versión | Fecha | Cambio |
| --- | --- | --- |
| 1.0 | 2026-11-03 | Spec inicial para #779 |
