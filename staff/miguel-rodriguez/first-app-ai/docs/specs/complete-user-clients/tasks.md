# Tareas — clientes pendientes

Issue #1024 · PR #1025. Spec y plan bajo autorización conjunta de Miguel del
2026-11-04, antes de implementar. Esta autorización no altera las reglas futuras.

- [x] Auditar clientes actuales y referencias, abrir issue/rama/draft independiente.
- [x] Preparar spec, plan y revisión de dependencias con cobertura y hallazgos.
- [x] Instalar versiones exactas y cotejar las tres capas resueltas con Socket.
- [x] Crear adaptadores Electron y Chrome y sus pantallas independientes.
- [x] Crear Nest en JavaScript usando las operaciones existentes.
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
