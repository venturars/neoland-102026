# Plan de frontend, Express y workflow

Issue: #855. Una sola rama y una PR draft desde `staging` actualizado.

## Referencias revisadas

En `staging`, Ventura añadió un cliente Express de usuarios en el puerto 3001 y mantuvo aparte su servidor SQL. Su cliente de navegador abre un archivo local y deja las notas desactivadas. Nuestra aplicación ya sirve la web, guarda notas por usuario y tiene rutas HTTP; se adapta Express al servidor web existente para conservar un solo origen y no exponer SQL arbitrario. Las otras implementaciones de navegador consultadas usan datos locales o clientes propios; no alteran el contrato de esta copia.

## Dependencia y Socket

Fijar `express@5.3.0`, versión actual consultada en npm el 2026-11-04. `pnpm@11.25.0` resolvió en una copia temporal 54 combinaciones de nombre y versión entre niveles 0 y 3; no hubo opcionales instaladas en ese recorrido. Socket autenticó la organización `neoland-dfnsq`. Las cinco puntuaciones de cada combinación se registran abajo; ninguna es inferior a 50. El mínimo es mantenimiento 50 para `safer-buffer@2.1.2`.

El listado completo de 245 alertas npm abiertas de esa organización se leyó en una página. Cuatro alertas de `qs@6.14.0` afectan una versión distinta de la resuelta `qs@6.17.1`; ninguna coincidió con las 54 versiones instaladas. La consulta de campañas de `express@5.3.0` devolvió `403 threat_feed_not_entitled`: el plan Free no habilita esa información, por lo que las campañas quedan sin verificar. El filtro de alertas es organizativo y no equivale a un informe global de cada versión. Diego pidió expresamente implementar Express tras conocer esta limitación de Socket; se registra la cobertura pendiente sin atribuir un resultado limpio de campañas.

## Servidor Express

Sustituir el transporte HTTP nativo por una aplicación Express en `src/clients/http/`. Mantener `pnpm web`, el puerto 3000 configurable con `PORT` y la escucha local. Crear `app.js` con rutas y `start-http-server.js` de arranque; permitir importar la app sin abrir puerto para comprobarla en copia temporal. Reutilizar `listUsers`, `createUser`, `findUserById`, `updateUser`, `deleteUser` y las cinco operaciones de notas. Convertir exclusivamente IDs decimales completos a enteros positivos seguros antes de llamar a `logic`.

Mantener los nueve endpoints actuales y añadir `POST /api/users`. Usar `express.json({ limit: "1mb" })`, adaptar `send-http-error.js` a middleware y conservar respuestas JSON directas, 204, 400, 404, 405 con `Allow`, 409, 413, 415 y 500 sin detalles internos. Los archivos públicos se sirven desde un mapa explícito; no usar `express.static` sobre `src/`. Rechazar cuerpos que no sean objetos JSON y Content-Type incorrecto. No añadir CORS ni sesiones porque web y API comparten origen.

## Frontend

Añadir creación de usuario en la selección con nombre y correo; usar `POST /api/users` y volver al listado, sin seleccionar automáticamente. Mejorar el aspecto y la navegación de las cinco pantallas actuales, manteniendo etiquetas, foco, estados de carga, botón de reintento y confirmaciones. Todas las cadenas variables se insertan con `textContent` o `value`; los formularios se conservan tras errores. El menú y las notas continúan consultando datos actualizados.

## Postman

Guardar una colección UTF-8 en `src/clients/postman/` con `baseUrl` configurable, alta que captura `userId`, listado, consulta, cambio, borrado y errores de entrada. Las comprobaciones de estado y cuerpo deben poder ejecutarse en orden con la CLI oficial de Postman sobre una copia temporal. La colección es documentación ejecutable solicitada, no una nueva suite de tests de la aplicación. No se guarda token ni resultado personal.

## Workflow

Comparar cada archivo activo con `exercises/git-workflow-agent-template` en `staging`: orquestador, roles, skills, guía MCP, plantillas y scripts. Incorporar selección de issue lista según claridad, rama nueva desde `staging` antes de cambiar el proyecto, y las mejoras de enlace de issue, escritura GitHub y tipos. Conservar el prefijo `codex/`, delegación real, autorización anticipada de Diego, protecciones contra ramas protegidas, push forzado y trabajo preparado ajeno. Validar scripts en repositorios temporales con remoto local.

## Comprobación

Hacer el recorrido de navegador y API sobre una copia temporal sin SQLite personal. Ejecutar colección con Postman CLI; registrar versión y solicitudes realizadas. Comprobar errores, permisos de rutas, Unicode, 390 px, persistencia y cascada. Revisar sintaxis, UTF-8, enlaces, árbol, guías y alcance. No fusionar la PR ni asignar revisores sin indicación de Diego.

## Puntuaciones Socket

Cada fila indica nivel desde Express y las cinco puntuaciones en el orden licencia / mantenimiento / calidad / cadena de suministro / vulnerabilidad. Fuente: `depscore`, plataforma `win32-x64`, 2026-11-04.

| Nivel | Paquete | Licencia / mantenimiento / calidad / cadena / vulnerabilidad |
| --- | --- | --- |
| 0 | `express@5.3.0` | 100 / 92 / 100 / 97 / 100 |
| 1 | `accepts@2.0.0` | 100 / 84 / 100 / 99 / 100 |
| 1 | `body-parser@2.4.0` | 100 / 93 / 100 / 99 / 100 |
| 1 | `content-disposition@2.0.1` | 100 / 86 / 100 / 100 / 100 |
| 1 | `content-type@2.1.0` | 100 / 88 / 90 / 100 / 100 |
| 1 | `cookie@0.7.2` | 100 / 85 / 99 / 100 / 100 |
| 1 | `cookie-signature@1.2.2` | 100 / 82 / 69 / 100 / 100 |
| 1 | `debug@4.4.3` | 100 / 81 / 100 / 99 / 100 |
| 1 | `depd@2.0.0` | 100 / 75 / 100 / 99 / 100 |
| 1 | `encodeurl@2.0.1` | 100 / 90 / 99 / 100 / 100 |
| 1 | `escape-html@1.0.3` | 100 / 75 / 78 / 100 / 100 |
| 1 | `etag@1.8.1` | 100 / 75 / 99 / 100 / 100 |
| 1 | `finalhandler@2.1.1` | 100 / 84 / 100 / 99 / 100 |
| 1 | `fresh@2.0.0` | 100 / 83 / 99 / 100 / 100 |
| 1 | `http-errors@2.0.1` | 100 / 84 / 100 / 99 / 100 |
| 1 | `merge-descriptors@2.0.0` | 100 / 79 / 80 / 100 / 100 |
| 1 | `mime-types@3.0.2` | 100 / 85 / 100 / 100 / 100 |
| 1 | `on-finished@2.4.2` | 100 / 86 / 100 / 100 / 100 |
| 1 | `once@1.4.0` | 100 / 75 / 91 / 100 / 100 |
| 1 | `parseurl@1.3.3` | 100 / 75 / 99 / 100 / 100 |
| 1 | `proxy-addr@2.0.8` | 100 / 84 / 100 / 99 / 100 |
| 1 | `qs@6.17.1` | 100 / 97 / 100 / 99 / 100 |
| 1 | `range-parser@1.3.0` | 100 / 85 / 95 / 100 / 100 |
| 1 | `router@2.2.0` | 100 / 83 / 100 / 99 / 100 |
| 1 | `send@1.2.1` | 100 / 85 / 100 / 99 / 100 |
| 1 | `serve-static@2.2.1` | 100 / 84 / 99 / 99 / 100 |
| 1 | `statuses@2.0.2` | 100 / 83 / 99 / 100 / 100 |
| 1 | `type-is@2.1.0` | 100 / 87 / 100 / 99 / 100 |
| 1 | `vary@1.1.2` | 100 / 75 / 99 / 100 / 100 |
| 2 | `bytes@3.1.2` | 100 / 81 / 99 / 100 / 100 |
| 2 | `ee-first@1.1.1` | 100 / 75 / 92 / 100 / 100 |
| 2 | `es-define-property@1.0.1` | 100 / 53 / 81 / 66 / 100 |
| 2 | `forwarded@0.2.0` | 100 / 75 / 83 / 100 / 100 |
| 2 | `iconv-lite@0.7.3` | 100 / 93 / 100 / 100 / 100 |
| 2 | `inherits@2.0.4` | 100 / 75 / 76 / 100 / 100 |
| 2 | `ipaddr.js@1.9.1` | 100 / 82 / 100 / 100 / 100 |
| 2 | `is-promise@4.0.0` | 100 / 75 / 66 / 100 / 100 |
| 2 | `media-typer@1.1.1` | 100 / 84 / 98 / 100 / 100 |
| 2 | `mime-db@1.54.0` | 100 / 84 / 100 / 100 / 100 |
| 2 | `ms@2.1.3` | 100 / 84 / 86 / 100 / 100 |
| 2 | `negotiator@1.1.0` | 100 / 85 / 100 / 100 / 100 |
| 2 | `path-to-regexp@8.4.2` | 100 / 91 / 100 / 100 / 100 |
| 2 | `raw-body@3.0.2` | 100 / 86 / 100 / 99 / 100 |
| 2 | `setprototypeof@1.2.0` | 100 / 75 / 73 / 100 / 100 |
| 2 | `side-channel@1.1.1` | 100 / 53 / 87 / 66 / 100 |
| 2 | `toidentifier@1.0.1` | 100 / 83 / 82 / 100 / 100 |
| 2 | `wrappy@1.0.2` | 100 / 75 / 73 / 100 / 100 |
| 3 | `es-errors@1.3.0` | 100 / 79 / 84 / 100 / 100 |
| 3 | `object-inspect@1.13.4` | 100 / 80 / 96 / 99 / 100 |
| 3 | `safer-buffer@2.1.2` | 100 / 50 / 100 / 67 / 100 |
| 3 | `side-channel-list@1.0.1` | 100 / 80 / 88 / 99 / 100 |
| 3 | `side-channel-map@1.0.1` | 100 / 79 / 87 / 99 / 100 |
| 3 | `side-channel-weakmap@1.0.2` | 100 / 79 / 87 / 99 / 100 |
| 3 | `unpipe@1.0.0` | 100 / 75 / 78 / 100 / 100 |
