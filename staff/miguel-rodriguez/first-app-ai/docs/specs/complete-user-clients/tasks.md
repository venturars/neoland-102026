# Tareas — clientes pendientes

Issue #1024 · PR #1025. Spec y plan bajo autorización conjunta de Miguel del
2026-11-04, antes de implementar. Esta autorización no altera las reglas futuras.

- [x] Auditar clientes actuales y referencias, abrir issue/rama/draft independiente.
- [x] Preparar spec, plan y revisión de dependencias con cobertura y hallazgos.
- [x] Instalar versiones exactas y cotejar las tres capas resueltas con Socket.
- [x] Crear adaptadores Electron y Chrome y sus pantallas independientes.
- [x] Crear Nest en JavaScript usando las operaciones existentes (versión del 4; retirada el 5 a #1044).
- [x] Exponer resumen compartido en APIs, web, escritorio, Chrome y VS Code.
- [x] Actualizar comandos, guías, árbol, constitución y lint.
- [x] Verificar APIs, UI reales, host VS Code y modelo local con datos desechables.
- [x] Ejecutar formato/lint/regresiones y revisar el diff.
- [x] Publicar y comprobar PR hacia staging, revisores y limpieza de la entrega inicial.

## Evidencia inicial

2026-11-04, macOS arm64, Node 24.22.1, pnpm 12.15.0. Copia y SQLite desechables;
ninguna prueba utiliza la base del alumno. Subagentes implementaron adaptadores
y revisaron el resultado; el principal verificó sus cambios y los recorridos.

- Instalación exacta con pnpm y revisión Socket descrita en plan.md. Las tres
  capas instaladas coinciden con las 103 versiones revisadas: ninguna añadida,
  ausente o distinta. `pnpm install --frozen-lockfile --offline` termina con 0.
- `pnpm format`, después `pnpm lint` y `git diff --check`: código 0.
  El preload CommonJS recibe las reglas recommended; no queda fuera del lint.
- `node --test --test-concurrency=1 tests/*.test.js`: 6 pruebas pasadas,
  0 fallidas/omitidas. Incluyen datos, web, VS Code y las tres APIs.
  La prueba de APIs cubre tabla ausente/vacía, ruta estática del resumen,
  CRUD, cinco campos, normalización, edición parcial, orden, segundo contacto
  conservado, errores sin cambios, JSON mal formado, CORS y datos inaccesibles.
- Electron 45.2.2 real, 19 comprobaciones por CDP: página propia, renderer sin
  Node, creación, consulta, edición, email inválido/ocupado, nombre vacío,
  borrado por email, resumen, usuario inexistente y recarga. Los cambios se
  contrastaron con las APIs; se conserva el ID y createdAt al editar.
- Chrome for Testing 156.0.8078.4: extensión MV3 realmente cargada y su documento
  popup abierto en contexto chrome-extension. 18 comprobaciones de formularios,
  errores y persistencia pasadas. No se presenta como prueba del clic en la
  barra de extensiones. El resumen web se probó además desde file://.
- VS Code 1.142.0: host de extensión real, activación, comando y pestaña webview;
  10 grupos de comprobaciones del puente execute, incluyendo búsquedas,
  validación, CRUD, resumen y confirmación de borrado. No se atribuyen clics
  del webview a esa prueba del puente.
- Ollama y llama3.2 reales: las tres APIs devolvieron exactamente las tres claves
  y total 2 para dos contactos. Resultado observado: women 0, men 0,
  genderUndefined 2. Es el comportamiento existente de clasificación incierta;
  no se promete una etiqueta determinista. Registros y fechas conservados.
- Fallo del modelo: un preload de prueba externo rechaza solo las peticiones
  al puerto 11434. Las tres APIs devuelven 500 y Could not classify the users;
  registros y fechas siguen iguales. Es un fallo de transporte controlado;
  no se detuvo el Ollama del usuario.

La revisión corrigió la validación nativa de email que estrechaba el contrato:
los formularios dejan validar a la lógica común. El recorrido web detectó que
el lanzador envía Origin file://; la ruta del resumen permite file:// y null,
con Vary: Origin, sin habilitar otros sitios. Ambas correcciones se repitieron
en sus aplicaciones reales. No hay cambios en lógica, queries, SQL o modelo.

Las APIs, Electron y Chrome de prueba se cerraron y sus perfiles y copia se
retiraron; puertos 3000–3003 libres. Se conservó evidencia fuera del repositorio.
La publicación y las solicitudes de revisión se comprueban en la PR al entregar.

## Corrección posterior a la revisión · 2026-11-04

Miguel autorizó terminar estos hallazgos. Preparación de esta enmienda antes de
editar la implementación; las comprobaciones anteriores conservan su fecha y alcance.

- [x] C01 · Confirmar cada escritura antes de intentar recargar en Electron y Chrome.
- [x] C02 · Mostrar createdAt y updatedAt del contacto seleccionado en ambos clientes.
- [x] C03 · Hacer browser-compatible el transporte compartido del clasificador y retirar el rodeo web por Express.
- [x] C04 · Añadir regresiones de escrituras confirmadas, fechas y respuestas/fallos del clasificador.
- [x] C05 · Actualizar guías y comprobar el recorrido real web sin Express, Electron y Chrome con datos desechables.
- [x] C06 · Ejecutar formato, lint, suite y revisión independiente.

Publicar esta corrección en la misma PR #1025 hacia staging y volver a solicitar
Jimena y Meghan tras comprobar el estado remoto.


### Comprobaciones de la corrección

- `node --test --test-concurrency=1 tests/*.test.js`: 28 pruebas, 0 fallos u
  omisiones, en una copia desechable. Incluye las tres APIs y las regresiones
  anteriores. `pnpm format`, después `pnpm lint` y `git diff --check`: código 0.
- 16 casos de pantalla controlados para Electron/Chrome: escritura confirmada
  antes de acabar la recarga; fallo posterior al crear, editar o borrar; email
  nuevo para confirmar borrado; fechas; rechazo de escritura y envío duplicado.
  La revisión cruzada encontró que una recarga correcta podía restaurar una
  instantánea antigua. Cuatro regresiones adicionales comprobaron ese fallo
  antes de corregirlo: ahora se usa el registro recién leído o se retira la
  selección si otro cliente lo borró.
- Seis pruebas del clasificador comprueban petición exacta, nombres sin datos
  adicionales, lotes 6/6/1, tabla vacía, fallback y fallos sin resultado parcial.
  Se conservan modelo, prompt y esquema; el envío nativo tiene diez minutos de
  timeout y un intento por lote, como establece la enmienda del plan.
- Electron 45.2.2: 21 comprobaciones en ventana real. Chrome for Testing
  156.0.8078.4: 20 en la página de la extensión MV3 cargada. Creación, edición,
  fechas visibles contrastadas con las APIs, validaciones, confirmación de
  borrado, resumen con Ollama y persistencia tras recargar. No se atribuye un
  clic manual sobre el icono del navegador a la comprobación de su página.
- Navegador real con el HTML web actual desde file:// y el botón de resumen:
  puerto 3001 bloqueado, cero intentos hacia Express. Solo peticiones a datos
  3000 y Ollama 11434. Resultado observado 1/1/1 para tres contactos ficticios;
  registros y fechas idénticos antes y después.
- Se ejecutó el `.txt` Terminal del resumen con el mismo transporte nativo y
  dos contactos desechables: salida women 0, men 0, genderUndefined 2, código 0;
  filas y fechas intactas. Las etiquetas del modelo no se fuerzan en la prueba.
- Tras restaurar las dependencias offline, Electron necesitó preparar su
  ejecutable mediante `node node_modules/electron/install.js`; utilizó el ZIP
  local de 45.2.2. La guía incluye ese paso inicial. Package.json, lockfile y
  excepciones de versiones conservan el contenido ya revisado con Socket.

Las regresiones de fallos de recarga usan un transporte controlado sobre el JS
real; las comprobaciones de ventanas recorren los servicios reales. Las pruebas
usan copias, perfiles y bases desechables. La demostración del alumno se conserva
fuera del repositorio. No se detuvo ni reconfiguró su Ollama.

## Retirada de Nest · 2026-11-05

Miguel pidió conservar Electron y Chrome en #1025 y desarrollar Nest por separado
desde staging en la [issue #1044](https://github.com/venturars/neoland-102026/issues/1044).
La evidencia anterior corresponde a la versión del 4 de noviembre; no acredita
un cliente Nest en la entrega actual. Esta enmienda precede a los cambios.

- [x] N01 · Actualizar spec y plan con la retirada autorizada y conservar el historial.
- [x] N02 · Retirar el adaptador Nest, sus cinco dependencias exclusivas y su arranque.
- [x] N03 · Regenerar solo los metadatos del lockfile sin scripts; conservar las versiones restantes.
- [x] N04 · Acotar la prueba de APIs a Express y Chrome/Fastify.
- [x] N05 · Actualizar guías, árbol y constitución con los clientes presentes.
- [x] N06 · Verificar en copias desechables y cotejar los archivos protegidos.
- [x] N07 · Publicar la corrección en #1025 hacia staging después de su revisión.

### Comprobaciones de la retirada

- `pnpm install --lockfile-only --ignore-scripts --offline --no-frozen-lockfile`
  con el store existente: código 0. El lockfile pasa de 237 a 207 entradas:
  treinta eliminadas y ninguna nueva. Los 207 bloques conservados de paquetes
  y snapshots son idénticos. Versiones directas y de desarrollo restantes intactas.
- `pnpm format`, después `pnpm lint`: código 0. Al ejecutar el primer script,
  pnpm reconcilió node_modules retirando los mismos treinta paquetes; no añadió
  paquetes ni cambió versiones. El lint no tenía una excepción exclusiva de Nest.
- `node --test --test-concurrency=1 tests/*.test.js`: 28 pasan, cero fallos u
  omisiones, 2126.599542 ms. Copia desechable con puertos 23000–23002; solo en
  esa copia se sustituyeron los puertos para no interferir con la demostración.
  La prueba de APIs conserva CRUD compartido, campos omitidos, errores, resumen
  vacío, persistencia y fallo de datos para Express y Chrome/Fastify.
- Cotejo contra la copia previa: entre 109 archivos de código y flujo revisados,
  solo desaparece src/clients/nest/app.js y cambia tests/client-apis.test.js.
  Los otros 107, incluidos Electron, Chrome, web, VS Code, lógica y flujo Git,
  permanecen idénticos. La revisión Socket anterior conserva su fecha y alcance.
- Copia de pruebas retirada y puertos 23000–23002 libres. Los cuatro procesos
  de demostración en 3000–3003 permanecen abiertos y no se modificaron sus datos.
  La retirada se publicó tras revisión del principal y un segundo subagente:
  6fd8d257 (SDD), 7fb39305 (retirada) y 282dc522 (guías). El remoto se comprobó
  en 282dc522, sin force push. Issue #1024 y PR #1025 reflejan la separación a
  #1044 y #1050; la base permanece staging y las issues siguen abiertas.


## Alineación del ejercicio · 2026-11-05

Miguel pidió corregir los clientes según el ejercicio. Electron carga las
operaciones compartidas desde sus módulos de renderer; main solo abre la
ventana propia. Se retira el puente preload/IPC anterior. Electron lista ID,
nombre y email; Chrome lista los cinco campos. Ambos permiten dejar un campo
de edición vacío para conservar su valor guardado. La ficha muestra los datos
actuales separados de los campos de modificación. Fastify devuelve 404 vacío
para una ruta desconocida. Se conservan resumen y confirmación por email.

Verificar llamadas directas desde Electron real, campos omitidos desde ambas
pantallas, contratos HTTP, errores, y las regresiones de escritura/recarga, en
copias desechables. Formato y lint antes de publicar en la misma PR #1025.


La alineación incluye VS Code: vista Usuarios en Explorer, arranque pnpm vscode,
las cinco columnas visibles y campos omitidos al editar. Conserva búsquedas,
resumen y confirmación de borrado. Verificar el adaptador y registro del proveedor.


### Verificación final de alineación · 2026-11-05

- pnpm format y después pnpm lint: código0. Lockfile y versiones intactos.
- Suite completa en copia y datos desechables, puertos23000–23002:32 pruebas
  pasadas,0 fallos/omitidas,962.046083ms. Incluye edición parcial que conserva
  un email cambiado desde otro cliente, cinco campos en Chrome y404 vacío.
- Electron45.2.2 real por CDP, perfil propio: crearAda, editar solo nombre,
  email conservado y fechas visibles, contrastados con SQLite por queries.
  window.require y window.firstApp son undefined: el renderer carga los módulos
  compartidos directamente. Ventana y servicio propios detenidos.
- VS Code real en Extension Development Host aislado: extensión activa, vista
  firstAppUsers de Explorer registrada, foco y comando de apertura ejecutados.
  No se atribuyen clics de edición del webview a esa prueba de activación.
- Las pantallas Chrome y los fallos de recarga se comprueban con sus fuentes
  reales y transporte controlado. La carga de la extensión en Chrome real
  corresponde a la evidencia del4; no se repitió su GUI en esta corrección.
- La demostración del alumno y sus datos permanecen abiertos e intactos.

La revisión final detectó que el formulario de VS Code aún imponía required
del navegador al editar campos vacíos. Se marcó novalidate en ese formulario:
la operación compartida valida la creación y conserva los omitidos al editar.
