# Plan del cliente Electron

Issue: #915.

## Solución

Crear `src/clients/electron/main.js`, `index.html`, `app.js` y `styles.css`.
No se importa ni se abre ningún archivo de `src/clients/browser/`.
El cliente HTTP y el browser existentes sirven para contrastar las llamadas
y los contratos; no se trasladan sus reglas ni se reemplaza `logic/`.

`main.js` es un módulo ES: importa `app` y `BrowserWindow` de `electron`.
Al estar lista la aplicación abre una ventana de 800 por 600 y carga el
`index.html` contiguo, resolviendo su ruta desde el módulo. Al cerrar todas
las ventanas sale salvo en `darwin`; al activar en `darwin` sin ventanas
crea una. No hace falta preload, IPC ni habilitar Node en la página.

`index.html` carga `./styles.css` y `./app.js` con `type="module"`.
La primera pantalla reúne alta, lista y consulta por id. La segunda
contiene la ficha, edición, borrado y vuelta a la lista. CSS distingue
los errores. Los textos de interfaz estarán en español y el código en inglés.

`app.js` importa únicamente estas funciones desde `../../logic/`, con `.js`:

| Archivo | Llamada existente |
| --- | --- |
| `create-user.js` | `createUser({ name, email })` |
| `list-users.js` | `listUsers()` |
| `find-user-by-id.js` | `findUserById(id)` |
| `update-user.js` | `updateUser(id, changes)` |
| `delete-user.js` | `deleteUser(id)` |

Esos módulos y sus consultas usan fetch, sin paquetes ni módulos Node en
el grafo de imports del renderer. No se importa el clasificador ni las
búsquedas por nombre o email. No hay firmas, SQL ni cliente terminal nuevos.
El SQL actual conserva parámetros nombrados y se ejecuta en el servidor
`src/db/server.js`, en `http://127.0.0.1:3000/execute`.

Al entrar se carga la lista, con botones que muestran id, nombre y email.
Crear limpia el formulario y recarga la lista, sin abrir la ficha.
Consultar por id o seleccionar una fila llama a `findUserById` y abre la
ficha con las dos fechas. Guardar envía los valores de nombre y email
precargados: editar solo uno conserva el otro. La firma existente también
conserva los campos omitidos de `changes`. Guardar refresca la ficha;
borrar o volver recarga la lista. Cada fallo muestra `error.message`.

## Archivos y ejecución

En `package.json` añadir `electron: "45.2.2"` a `devDependencies`, el
script `electron: "electron src/clients/electron/main.js"` y el glob
`"src/clients/electron/**/*.js"` a `format`. Mantener `main: "index.js"`,
los otros scripts y las versiones actuales de dependencias.
Actualizar `pnpm-lock.yaml` mediante pnpm, sin copiar el lock de Ventura.
No crear `.npmrc` ni cambiar el linker.

Añadir el directorio y sus cuatro archivos a `docs/TREE.md`, con su formato
local. Añadir en `docs/ARCHITECTURE.md` que este cliente abre su propia
ventana e importa logic, sin reutilizar browser ni sustituir el servidor SQL.
`tasks.md` se preparará en esta misma carpeta después de aprobar spec y plan.
No se añaden otros archivos ni dependencias directas.

Arrancar la base con `pnpm server` y abrir con `pnpm electron` desde
first-app. No se generan instaladores. Node local es v24.22.0; el lock de
referencia declara Node >=22.12.0 para Electron y sus descargadores.

## Errores y verificación prevista

La correspondencia de situaciones y textos es la tabla de `spec.md`,
contrastada con `docs/ERRORS.md`. La lógica actual sigue siendo la única
responsable de validaciones y de los cinco errores `Could not ...`.

Tras implementar: ejecutar `pnpm format` y `pnpm lint`, comprobando que
no cambien logic ni queries. El script `test` sigue siendo un marcador.
Con la base iniciada, comprobar lista vacía, alta de Ada, consulta por
id y selección, fechas, cambio de nombre conservando email, borrado y vuelta.
Comprobar nombre vacío, email inválido, email ocupado e id inexistente;
con la base parada, comprobar el error de cada una de las cinco operaciones.
Esta fase solo prepara documentos; no acredita ejecución del cliente.

## Socket: revisión del 4 de noviembre de 2026

Se revisan las versiones del lockfile de referencia hasta tres capas,
incluidas las opcionales. Es un inventario propuesto, no una instalación
resuelta en este proyecto. Tras instalar, contrastar el lock generado:
una versión distinta requiere otra consulta Socket antes de continuar.

Árbol propuesto:

```text
electron@45.2.2
  @electron-internal/extract-zip@1.0.8
  @electron/get@5.1.0
    debug@4.4.3 -> ms@2.1.3
    env-paths@3.0.0
    graceful-fs@4.2.11
    progress@2.0.3
    semver@7.8.6
    sumchecker@3.0.1 -> debug@4.4.3
    undici@7.30.1 (opcional)
  @types/node@24.19.2
    undici-types@7.24.6
```

La única organización de la conexión OAuth actual es `neoland-grrl6`
(Neoland). La consulta MCP `alerts` para npm devuelve `items: []` y
`endCursor: null`: no hay alertas abiertas en el inventario monitorizado
de esa organización. No demuestra ausencia de alertas por versión fuera
de ese inventario. La consulta `threat_feed` para electron@45.2.2 devuelve
403 `threat_feed_not_entitled`; campañas no verificables con esta cuenta.
Ese límite afecta a todos los paquetes, sin declararlos libres de campañas.

`depscore` consultó las trece versiones exactas con plataforma win32-x64.
En la tabla, C = campañas no verificables por falta de acceso; A = sin
alertas abiertas en el inventario de la organización, sin garantía por versión.
Las puntuaciones son licencia, mantenimiento, calidad, cadena de suministro
y vulnerabilidades, en ese orden. Ninguna es inferior a 50.

| Paquete | Campañas | Alertas | Puntuaciones | <50 |
| --- | --- | --- | --- | --- |
| `electron@45.2.2` | C | A | 100, 97, 99, 99, 100 | No |
| `@electron-internal/extract-zip@1.0.8` | C | A | 100, 94, 98, 95, 100 | No |
| `@electron/get@5.1.0` | C | A | 100, 82, 100, 99, 100 | No |
| `@types/node@24.19.2` | C | A | 100, 96, 80, 100, 100 | No |
| `debug@4.4.3` | C | A | 100, 81, 100, 99, 100 | No |
| `env-paths@3.0.0` | C | A | 100, 80, 99, 100, 100 | No |
| `graceful-fs@4.2.11` | C | A | 100, 79, 100, 99, 100 | No |
| `progress@2.0.3` | C | A | 100, 75, 99, 100, 100 | No |
| `semver@7.8.6` | C | A | 100, 95, 100, 100, 100 | No |
| `sumchecker@3.0.1` | C | A | 100, 75, 98, 99, 100 | No |
| `undici@7.30.1` | C | A | 100, 97, 99, 92, 100 | No |
| `undici-types@7.24.6` | C | A | 100, 96, 74, 100, 100 | No |
| `ms@2.1.3` | C | A | 100, 84, 86, 100, 100 | No |

Diferencia documental explicada antes de escribir este plan: el lock de
Ventura incluye `undici@7.30.1` como opcional de `@electron/get`, aunque
su resumen Socket lo omite. Se incluye aquí para cubrir las tres capas;
no se añade como dependencia directa ni se amplía el alcance funcional.
La aceptación de estos límites corresponde a quien revisa el plan.

## Revisión humana

La persona aprobó spec y plan, revisó las tareas y autorizó la
implementación conforme a las etapas de `AGENTS.md`.
