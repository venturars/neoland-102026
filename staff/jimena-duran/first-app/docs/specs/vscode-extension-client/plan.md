Issue: #996

# Plan del cliente de VS Code

## Límites propios

El cliente de VS Code incorpora una vista lateral de usuarios en el proyecto
de Jimena, con arranque desde Windows/PowerShell.

No se incorpora una operación de negocio: se mantienen las cinco firmas
actuales y sus resultados. No hay SQL nuevo ni cambios en consultas,
servidor SQL u otros clientes. No se necesitan nuevos clientes de terminal.
No se añaden paquetes ni se cambian versiones; el lockfile permanece igual
y no corresponde revisión Socket.

## Archivos y arquitectura

Bajo `staff/jimena-duran/first-app/` se crean exactamente:

- `src/clients/vscode/package.json`
- `src/clients/vscode/extension.js`
- `src/clients/vscode/index.html`
- `src/clients/vscode/panel.js`
- `src/clients/vscode/styles.css`

Se modifican `package.json`, `docs/TREE.md` y `docs/ARCHITECTURE.md`.
El árbol recogerá los cinco archivos; la arquitectura describirá el proceso
de extensión llamando a la lógica y la vista presentando los resultados.
Se conserva el flujo lógica → consultas → servidor SQL en 3000, junto a
los clientes HTTP en 3001 y Chrome en 3002. No se crea otra API.

No se modifica `eslint.config.js`, que ya cubre JavaScript. No se añade
README, configuración `.vscode/`, instalador ni publicación.

## Manifiesto y host

El manifiesto usa `name: users`, `displayName: Usuarios`,
`publisher: first-app`, `version: 0.0.0`, `license: MIT`,
`type: module`, `main: ./extension.js` y
`engines.vscode: ^1.100.0`. Activa con `onView:firstApp.users` y contribuye
una vista `webview` llamada Usuarios con id `firstApp.users` dentro de
`explorer`. No declara dependencias ni otro contenedor o icono.

`extension.js` importa `vscode`, suministrado por el editor,
`readFileSync` de `node:fs` y las cinco operaciones de `../../logic/`,
con sus nombres actuales y extensión `.js`. Exporta `activate` y registra
un proveedor objeto; `resolveWebviewView` se declara como función aparte,
sin clase, métodos propios ni `this`.

La vista habilita scripts y limita `localResourceRoots` a la carpeta de
la extensión. Lee `index.html`, convierte las rutas `./styles.css`
y `./panel.js` mediante `asWebviewUri` y asigna el HTML. El host recibe
mensajes y espera las funciones existentes:

| Mensaje | Llamada | Resultado |
| --- | --- | --- |
| `list` | `listUsers()` | `users` |
| `create` | `createUser({ name, email })` | `user` |
| `view` | `findUserById(id)` | `user` |
| `update` | `updateUser(id, changes)` | `user` |
| `delete` | `deleteUser(id)` | Sin usuario |

El id se transmite como texto. Un fallo devuelve `error.message` en
`message`, sin validaciones ni mensajes añadidos en la vista o el host.

## Vista

`index.html` contiene crear, lista, consultar, modificar, borrar y un
espacio para mensajes en una sola pantalla. Conserva estos ids:
`create-form`, `create-name`, `create-email`, `user-list`,
`view-form`, `view-id`, `viewed-user`, `update-form`, `update-id`,
`update-name`, `update-email`, `delete-form`, `delete-id` y `message`.
Carga `./styles.css` y `./panel.js` como script clásico. Los textos
visibles están en español y el código en inglés.

`panel.js` no importa módulos. Declara los globales `document` y
`acquireVsCodeApi`, envía las acciones al host y escribe los datos mediante
`textContent`. Conserva la acción pendiente para aplicar cada respuesta.
Al abrir solicita la lista. Crear envía nombre y email incluso vacíos.
Consultar muestra `id`, `name`, `email`, `createdAt` y `updatedAt`.
Modificar incluye en `changes` únicamente los campos con texto. Crear y
modificar muestran el usuario y solicitan de nuevo la lista; borrar no
muestra un usuario y también refresca la lista. Una respuesta `message`
muestra ese texto. La lista vacía no genera contenido de usuario.
`styles.css` da presentación a esa misma pantalla sin nuevas acciones.

## Arranque en Windows

Se conserva el script `vscode` y se añade `src/clients/vscode/**/*.js`
a `format`. El comando del script, con el escape JSON correspondiente, es:

```powershell
powershell -NoProfile -Command "$appPath = (Get-Location).Path; $extensionPath = Join-Path $appPath 'src/clients/vscode'; code ('--extensionDevelopmentPath=' + $extensionPath) $appPath"
```

Desde PowerShell, en `staff/jimena-duran/first-app`, se mantiene abierta
la base con `corepack pnpm server` y se ejecuta `corepack pnpm vscode`.
Las rutas absolutas permiten cargar la extensión y abrir la carpeta de la
aplicación en la ventana de desarrollo.

## Comprobación prevista

Tras las aprobaciones SDD, ejecutar formato y lint según las guías locales.
Comprobar en la vista los casos de la issue #996: lista vacía, crear Ada,
consultar su id, modificar solo el nombre, borrar y mostrar los nueve
errores de la spec.

## Correspondencia de errores

Los nueve casos y textos de la spec proceden de `docs/ERRORS.md`.
Nombre vacío, email inválido, email ocupado e id inexistente mantienen sus
mensajes de negocio; cada fallo de acceso a la base mantiene el mensaje
`Could not ...` de su operación. La extensión solo los presenta.

## Revisión

No hay dudas pendientes en este plan.
Esta etapa entrega únicamente spec y plan. Se espera su revisión
humana antes de preparar tareas; implementar requiere autorización posterior.

