# Plan: Cliente de escritorio

Implementa [spec.md](spec.md). Respeta [CONSTITUTIONS.md](../../CONSTITUTIONS.md) y sus guías. Añade un paquete, `electron`, validado con Socket más abajo (principio 8). Sin cambios en la tabla.

## Dónde encaja
Electron tiene dos partes: el proceso principal, que abre la ventana, y la página que se ve dentro. La página es un cliente como el del navegador: importa `logic/` y la lógica llama a la base con `fetch`.

```
pnpm electron → src/clients/electron/main.js (proceso principal: abre la ventana)
                   │ carga desde el disco
                   ▼
                src/clients/electron/index.html + app.js (la página)
                   │ import
                   ▼
                src/logic/*  →  src/queries/users.js  →  servidor de la base (4000)
```

La página no valida nada ni decide mensajes: el resultado y el error salen de `logic` tal cual.

## Ficheros
```
src/clients/electron/main.js      NUEVO: abre la ventana y la protege
src/clients/electron/index.html   NUEVO: las dos pantallas y el aviso de borrar
src/clients/electron/styles.css   NUEVO: el aspecto
src/clients/electron/app.js       NUEVO: llama a logic/ y pinta los resultados
package.json                      electron 45.2.2, el script electron y format de la carpeta nueva
pnpm-lock.yaml                    lo actualiza pnpm
eslint.config.js                  document también en la carpeta nueva
docs/ARCHITECTURE.md, docs/TREE.md, AGENTS.md
```
No se tocan `src/logic/`, `src/queries/`, `src/db/` ni los otros clientes.

## Comprobado antes del plan
Con Electron 45.2.2 instalado en una carpeta aparte, fuera del proyecto:
- **La base no cambia.** Una página cargada desde el disco llama a `http://127.0.0.1:4000` sin cabecera `Origin`. El servidor de la base solo rechaza un `Origin` extraño, así que contesta. La prueba devolvió 200 y las filas.
- **La CSP del plan funciona.** Con `script-src 'self'` la página carga sus módulos desde el disco, con `connect-src http://127.0.0.1:4000` llega a la base, y una llamada a otro puerto se bloquea.
- **No hay script de instalación.** Electron descarga su programa la primera vez que se ejecuta, así que pnpm no tiene que aprobar nada.
- **Tiempo mínimo de pnpm.** pnpm 12 no instala una versión con menos de un día publicada. La 45.2.2 salió el 2026-11-03 a las 22:43 (hora de aquí), así que se instala después de esa hora, sin `pnpm-workspace.yaml` ni excepciones. En la carpeta de prueba pnpm sí añadió esa excepción: queda solo allí, fuera del proyecto.
- **`ELECTRON_RUN_AS_NODE`.** Si esa variable está puesta, Electron se comporta como Node y `main.js` falla al importar `BrowserWindow`. La pone la terminal de Claude Code dentro de VS Code. Para probar, se lanza sin ella (`env -u ELECTRON_RUN_AS_NODE`).

## Decisiones técnicas
| Tema | Decisión | Motivo |
|---|---|---|
| Paquete | `electron` 45.2.2, la última, con versión exacta en `devDependencies` (`pnpm add -D electron@45.2.2 --save-exact`) | Solo hace falta para abrir la ventana en este equipo. Las demás dependencias también van con versión exacta |
| Arranque | `pnpm electron`, que lanza `electron src/clients/electron/main.js` | Como `pnpm db` y `pnpm api` |
| Ventana | `main.js` abre una ventana de 900 × 650, con título, y carga `index.html` desde su propia carpeta. Al cerrarla, la aplicación sale | Un solo equipo Windows. No hay más ventanas |
| Seguridad de la ventana | La página no accede a Node (`nodeIntegration` desactivado, aislamiento y sandbox activados). No puede navegar a otra dirección ni abrir ventanas | La página solo necesita `fetch`. Si algo intentara llevarla a otro sitio, no podría |
| CSP | `<meta>` en `index.html` con `default-src 'none'; script-src 'self'; style-src 'self'; connect-src http://127.0.0.1:4000` | Solo carga sus propios ficheros y solo habla con la base. Comprobado antes del plan |
| Pantallas | Dos `<section>`, una visible cada vez, como en el cliente de navegador. El aviso de borrar es un `<dialog>` con **Cancelar** y **Borrar** | Ficheros propios: no se reutiliza el navegador |
| Lista | `listUsers()`. Cada usuario es un botón con su id, su nombre y su email | Un botón se pulsa también con el teclado |
| Ficha | Los datos salen del usuario elegido en la lista, que ya trae todos sus campos. Después de guardar, salen de lo que devuelve `updateUser` | Sin función nueva para buscar por id |
| Alta | `createUser(name, email)` con lo escrito. Si sale bien, se vacían los campos y se recarga la lista | La lista enseña el usuario nuevo con su id |
| Guardar | `updateUser(id, name, email)` con lo escrito. Si sale bien, se pinta la ficha y se recarga la lista | `updateUser` ya trata un campo vacío como «no cambiar» |
| Borrar | Al confirmar, `deleteUser(id)`, vuelta a la lista y se recarga | La lista deja de tenerlo |
| Errores | Se muestran como `Error: <mensaje>` en la pantalla en la que se esté, en un párrafo propio de cada pantalla. Se borran al empezar la siguiente acción | Igual que el cliente de navegador |
| Textos | En la página con `textContent`, nunca con HTML | Un nombre con `<` se ve tal cual |
| ESLint | El bloque que da `document` pasa a cubrir también `src/clients/electron/**/*.js` | `app.js` usa `document`. `main.js` no necesita nada más |
| Formato | `format` incluye `src/clients/electron/**/*.{js,html,css}` | Como el cliente de navegador |
| Estilo | El de [STYLE.md](../../STYLE.md): funciones con nombre, una acción por línea, sin `?.` | Igual que el resto del código |

## `main.js`
1. Comentario inicial con su responsabilidad.
2. Imports: `app` y `BrowserWindow` de `electron`, y `node:path` y `node:url` para llegar a `index.html`.
3. `createWindow()`: la ventana con sus `webPreferences`, el bloqueo de navegar y de abrir ventanas, y `loadFile`.
4. `app.whenReady()` llama a `createWindow`. En `window-all-closed`, `app.quit()`.

## `app.js`
1. Comentario inicial e imports de `listUsers`, `createUser`, `updateUser` y `deleteUser`.
2. Los elementos de la página y el usuario elegido.
3. `showScreen`, `showError`, `clearError`.
4. `loadUsers` (pinta la lista o el texto de vacía), `addUser`, `openUser`, `showUser` (pinta la ficha), `saveUser`, `askDelete`, `removeUser`.
5. `connectButtons()` y la carga inicial de la lista.

## Validación con Socket
Paquete nuevo: `electron@45.2.2`. Su árbol, sacado de un `package-lock` de prueba fuera del proyecto, son 13 paquetes. Revisado el 2026-11-04.

- **Puntuaciones (`depscore`)**: los 13 contestan. Ninguna puntuación baja de 50. Las más bajas:
  - `undici-types@7.24.6`: calidad 74.
  - `progress@2.0.3` y `sumchecker@3.0.1`: mantenimiento 75.
  - `electron@45.2.2`: licencia 100, mantenimiento 97, calidad 99, cadena de suministro 99 y vulnerabilidades 100.
  - El resto (`@electron/get`, `@electron-internal/extract-zip`, `@types/node`, `debug`, `env-paths`, `graceful-fs`, `ms`, `semver` y `undici@7.30.1`) tiene todo 74 o más.
- **Alertas (`alerts`)**, con la organización `sergiomoras` y el nombre `electron`: la lista está vacía. Es la lista de alertas de la organización, no dice que estas versiones no tengan alertas.
- **Campañas (`threat_feed`)**: la cuenta no tiene esa fuente (`403 threat_feed_not_entitled`).

Quien acepta el plan acepta estas puntuaciones.

## Cómo se prueba
- Guardar la salida de `list-users.txt` antes de empezar.
- Con `pnpm db` en marcha, abrir la ventana con `pnpm electron` y un puerto de depuración, y manejarla desde un script con CDP, como el cliente de navegador. Con el usuario temporal `tmp-974-1`: la lista, el alta, la ficha con sus cinco datos, cambiar el nombre, el email y los dos, y borrar cancelando primero y confirmando después.
- Los errores de la spec, cada uno con su mensaje: alta sin nombre y sin email, email mal formado y repetido al dar de alta y al guardar, guardar con los dos campos vacíos, y un usuario borrado desde la terminal con la ficha abierta.
- Con la base parada, la lista enseña el error de base parada.
- La CSP: desde la página, una llamada a otro puerto se bloquea.
- Al terminar no queda ningún `tmp-974-*` y `list-users.txt` da lo mismo que al empezar.
- `pnpm format` y `pnpm lint` sin errores.
- Después, el alumno abre `pnpm electron` desde su terminal y lo prueba a mano.

## Cambios aprobados
| Versión | Fecha | Cambio | Motivo |
|---|---|---|---|
| 1.1 | 2026-11-04 | El paquete se instala al final, a partir de las 22:43. Hasta entonces, la ventana se abre y se prueba con el Electron 45.2.2 de la carpeta de prueba, fuera del proyecto. Al instalarlo, se vuelve a abrir con `pnpm electron` | La persona usuaria quería probar el cliente hoy, sin esperar al tiempo mínimo de pnpm |
