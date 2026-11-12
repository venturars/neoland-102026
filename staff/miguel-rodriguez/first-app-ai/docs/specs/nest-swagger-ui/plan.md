# Plan — Swagger en Nest

Issue: [#1151](https://github.com/venturars/neoland-102026/issues/1151).
Spec: [spec.md](spec.md), aprobada por Miguel el 2026-11-06.
Estado: aprobado por Miguel el 2026-11-06, incluidos los hallazgos y límites de Socket documentados.

## Integración

Añadir `@nestjs/swagger@12.1.0`, compatible con Nest `12.3.3`.
En `src/clients/nest/main.js`, después de crear la aplicación y antes de
escuchar, usar `DocumentBuilder`, `SwaggerModule.createDocument` y
`SwaggerModule.setup("", app, document)`. Título `First app`, versión `1.0.0`, la actual del proyecto. Swagger se abre en `http://127.0.0.1:3003/`, en el mismo Nest.
El comando `pnpm nest` sigue compilando con Babel y arrancando la aplicación.

En `users.controller.js`, añadir `ApiBody` para crear y modificar, y
`ApiParam` para los tres recorridos con ID. Usar esquemas de objetos sencillos:
crear exige `name` y `email` de tipo string; modificar los deja opcionales.
El parámetro de ruta se describe como `id`, con ejemplo `1`, conservando
la conversión numérica actual. Los ejemplos usan Ada y ada@example.com.
Estos decoradores documentan entradas; no añaden validación de negocio.

Las rutas conservan POST/GET `/users` y GET/PATCH/DELETE `/users/:id`.
Los estados y mensajes son los de la spec y del filtro existente.
El controlador mantiene su servicio inyectado; el servicio sigue llamando
a la lógica compartida. La respuesta real aparece al ejecutar cada petición
con «Try it out». No hacen falta DTOs, otro controlador ni una página propia.

## Archivos

- `package.json` y `pnpm-lock.yaml`: dependencia exacta y resolución generada por pnpm.
- `pnpm-workspace.yaml`: denegar explícitamente el script de Scarf con
  `allowBuilds`, conservando las excepciones de antigüedad existentes.
- `src/clients/nest/main.js`: configuración de Swagger.
- `src/clients/nest/users.controller.js`: documentación de cuerpos e IDs.
- `README.md`: arrancar datos, inicializar tabla, arrancar Nest y abrir la página.
- `docs/ARCHITECTURE.md`: responsabilidad de Swagger dentro de Nest.
- `docs/TREE.md`: nuevos documentos y prueba.
- `tests/nest-swagger.test.js`: comprobación del documento generado y las rutas.
- Documentos de esta tarea: spec, plan y tareas con su evidencia.

## Comprobación

Trabajar en una copia con base desechable y puertos libres, sin tocar los
servicios ni los contactos de la demo. Compilar con el Babel existente.
Comprobar que GET `/` y los recursos de Swagger responden y que el documento
OpenAPI contiene exactamente las cinco operaciones de usuarios, los cuerpos
correctos y los parámetros ID. Comprobar que editar no exige ninguno de los
dos campos y que borrar documenta 204.

En el navegador ejecutar el recorrido de la spec: lista vacía, crear,
listar, consultar, editar cada campo por separado y borrar. Usar otro
contacto para comprobar el email repetido y la conservación de sus datos.
Comprobar nombre vacío, email inválido y contacto ausente. Detener solo el
servicio de datos de esa copia y repetir las cinco acciones con entradas
válidas: cada una devuelve su mensaje 500 existente.

Repetir las pruebas existentes de Nest para conservar CRUD e inyección real.
Ejecutar las pruebas de integración secuencialmente para evitar colisiones
con el puerto de datos de las copias.
Ejecutar `pnpm format` y después `pnpm lint`; revisar el diff para confirmar
que lógica, consultas, servicio y filtro conservan su comportamiento.
Eliminar la copia y cerrar sus procesos al terminar.

## Dependencias y Socket — 2026-11-06

Resolución generada con pnpm `12.15.0` desde copias de nuestro `package.json`,
`pnpm-lock.yaml` y `pnpm-workspace.yaml`, añadiendo únicamente la declaración
propuesta `@nestjs/swagger@12.1.0` al manifiesto temporal. Se ejecutó:

```sh
pnpm --dir /private/tmp/swagger1151-review/resolution install --lockfile-only --ignore-scripts
```

Terminó con código 0 y sin crear `node_modules`. Las 21 versiones y sus
relaciones en tres capas coinciden con las ya consultadas en Socket:
ninguna versión añadida, retirada o cambiada dentro del árbol revisado.
SHA-256 del lockfile temporal:
`b57e6e0bcd476c739c9b6a69b495f9900eb24b12b460cbf11f5265d27fa104e8`.
La resolución y sus respuestas completas permanecen fuera del repositorio,
en `/private/tmp/swagger1151-review/`.

Tras aprobar el plan y las tareas, pnpm realizará la instalación exacta;
se cotejarán de nuevo las tres capas. Una diferencia exige revisar los
paquetes afectados y renovar la aprobación antes de continuar.

Las tres capas cuentan Swagger como primera, sus dependencias y peers
resueltos como segunda, y las dependencias de esos paquetes como tercera.
Se incluyen paquetes existentes. No se proponen los peers opcionales ausentes
TypeScript, class-validator, class-transformer ni @fastify/static.
No aparecen exclusiones de plataforma en esta propuesta.

Fuente: npm registry y POST de Socket
`/v0/orgs/neoland/purl?alerts=true&poll=true&timeoutSec=20`, con purls exactas.
Se verifican identidad, versión y las cinco puntuaciones. Las puntuaciones
0–1 de esta API se convierten a 0–100; el umbral de nuestra app sigue siendo 50.
Las alertas se conservan sin filtrar por severidad o acción de la organización.

GET de alertas organizativas: 403, falta `alerts:list`. No se pudo recorrer
su paginación. GET de threat-feed: 403, falta `threat-feed:list`.
Campañas: campaigns: coverage limited by the Socket plan. Los 403 actuales
son de permisos; no acreditan ausencia de campañas ni cobertura por versión.
La documentación oficial de Nest confirma la integración mediante
[SwaggerModule](https://docs.nestjs.com/openapi/introduction).

### Hallazgos y decisión

- `@scarf/scarf@1.4.0`: telemetría en postinstall, acceso a shell y red.
  Propuesta: añadir esta denegación explícita a `pnpm-workspace.yaml`:

  ```yaml
  allowBuilds:
    '@scarf/scarf': false
  ```

  Comprobado en la copia temporal: `pnpm config get allowBuilds` devuelve
  `{"@scarf/scarf": false}`. Antes de instalar, verificar la misma regla
  efectiva en el proyecto. Después, conservar la salida de instalación que
  confirme que Scarf no se construyó. No ejecutar su postinstall para probarlo.
  Esta regla no autoriza otros scripts ni cambia las excepciones de antigüedad.
  [Configuración oficial de pnpm](https://pnpm.io/settings/build#allowbuilds).
- `tslib@2.9.1`: autor nuevo y aviso alto de cambio de propietario.
  Ya está presente; este resultado no demuestra malware.
- `@nestjs/swagger`: posible inyección de HTML/JavaScript si la configuración
  de Swagger procede de fuentes no confiables. Usaremos metadatos locales
  definidos en código, sin introducir entradas del usuario en la configuración.
- `es-toolkit`: los avisos describen ejecución de plantillas no confiables.
  Esta entrega no procesa plantillas aportadas por usuarios.
- `swagger-ui-dist` y `reflect-metadata`: avisos de evaluación dinámica;
  `iterare` y `fast-safe-stringify`: mantenimiento inactivo. También aparecen
  capacidades de red, entorno, archivos y depuración, detalladas abajo.
- El aviso automatizado de RxJS describe un operador convencional y no
  identifica comportamiento malicioso en el fragmento analizado.

Las 21 respuestas tienen las cinco puntuaciones y ninguna baja de 50.
Miguel aceptó el 2026-11-06 esta propuesta, sus avisos y las limitaciones
organizativas y de campañas. La aceptación corresponde a esta resolución;
las diferencias posteriores se revisan según AGENTS.md.

### Versiones, puntuaciones y alertas

SC: cadena de suministro; V: vulnerabilidad; Q: calidad; M: mantenimiento; L: licencia.

| Versión | Capa | SC/V/Q/M/L | Alertas (incluidas las ignoradas) |
| --- | --- | --- | --- |
| `@nestjs/swagger@12.1.0` | 1 | 98/100/86/96/100 | gptAnomaly (low); debugAccess (low); urlStrings (low) |
| `@microsoft/tsdoc@0.17.1` | 2 | 100/100/89/87/100 | Ninguna devuelta para esta versión |
| `@nestjs/common@12.3.3` | 2 | 99/100/100/96/100 | envVars (low) ×3; debugAccess (low) |
| `@nestjs/core@12.3.3` | 2 | 99/100/100/96/100 | urlStrings (low); networkAccess (middle) ×2; envVars (low); debugAccess (low) ×2 |
| `@nestjs/mapped-types@12.0.1` | 2 | 99/100/89/89/100 | debugAccess (low) |
| `@standard-schema/spec@1.1.0` | 2 | 100/100/99/82/100 | Ninguna devuelta para esta versión |
| `es-toolkit@1.52.0` | 2 | 99/100/93/98/100 | urlStrings (low); gptAnomaly (low) ×2 |
| `js-yaml@5.5.0` | 2 | 100/100/86/92/100 | Ninguna devuelta para esta versión |
| `path-to-regexp@8.4.2` | 2 | 100/100/100/91/100 | urlStrings (low) |
| `reflect-metadata@0.2.2` | 2 | 100/100/99/80/80 | usesEval (middle) |
| `swagger-ui-dist@5.34.0` | 2 | 99/100/83/98/80 | urlStrings (low); minifiedFile (low); usesEval (middle) ×4; networkAccess (middle) |
| `file-type@22.3.0` | 3 | 99/100/100/92/100 | Ninguna devuelta para esta versión |
| `iterare@1.2.1` | 3 | 100/100/100/75/100 | unmaintained (low) |
| `load-esm@1.0.3` | 3 | 100/100/95/79/100 | Ninguna devuelta para esta versión |
| `rxjs@7.8.2` | 3 | 99/100/100/88/100 | gptAnomaly (low) |
| `tslib@2.9.1` | 3 | 92/100/100/91/100 | newAuthor (low); unstableOwnership (high) |
| `uid@2.0.2` | 3 | 100/100/99/79/100 | Ninguna devuelta para esta versión |
| `fast-safe-stringify@2.1.1` | 3 | 100/100/100/75/100 | unmaintained (low) |
| `@nestjs/platform-express@12.3.3` | 3 | 99/100/100/97/100 | networkAccess (middle) ×2 |
| `argparse@3.0.4` | 3 | 100/100/97/89/100 | envVars (low) ×2; filesystemAccess (low) |
| `@scarf/scarf@1.4.0` | 3 | 82/100/100/80/100 | urlStrings (low); telemetry (high); installScripts (middle); shellAccess (middle); envVars (low) ×12; networkAccess (middle) ×2; filesystemAccess (low); dynamicRequire (low) ×2 |

### Relaciones de la propuesta

- `@nestjs/swagger@12.1.0` → `@microsoft/tsdoc@0.17.1`, `@nestjs/common@12.3.3`, `@nestjs/core@12.3.3`, `@nestjs/mapped-types@12.0.1`, `@standard-schema/spec@1.1.0`, `es-toolkit@1.52.0`, `js-yaml@5.5.0`, `path-to-regexp@8.4.2`, `reflect-metadata@0.2.2`, `swagger-ui-dist@5.34.0`.
- `@nestjs/common@12.3.3` → `@standard-schema/spec@1.1.0`, `file-type@22.3.0`, `iterare@1.2.1`, `load-esm@1.0.3`, `reflect-metadata@0.2.2`, `rxjs@7.8.2`, `tslib@2.9.1`, `uid@2.0.2`.
- `@nestjs/core@12.3.3` → `@nestjs/common@12.3.3`, `fast-safe-stringify@2.1.1`, `iterare@1.2.1`, `path-to-regexp@8.4.2`, `reflect-metadata@0.2.2`, `rxjs@7.8.2`, `tslib@2.9.1`, `uid@2.0.2`, `@nestjs/platform-express@12.3.3`.
- `@nestjs/mapped-types@12.0.1` → `@nestjs/common@12.3.3`, `reflect-metadata@0.2.2`.
- `js-yaml@5.5.0` → `argparse@3.0.4`.
- `swagger-ui-dist@5.34.0` → `@scarf/scarf@1.4.0`.
