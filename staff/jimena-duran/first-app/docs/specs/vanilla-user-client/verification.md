Issue: #757

# Verificación del cliente vanilla

Estado: spec, plan y T01–T18 aprobados; implementación verificada y pendiente de revisión del código. Commit selectivo, push y PR draft contra staging autorizados en la rama existente; sin revisores ni merge.

## Diff de la entrega

- Cinco archivos de cliente: HTML, CSS y JavaScript vanilla, servidor HTTP y arranque local.
- Una prueba con cuatro casos de node:test y fixtures desechables.
- Solo el comando `start:vanilla` en package.json; globals acotados a clientes y prueba en ESLint.
- Comando de ejecución, árbol, arquitectura, guía de uso y documentos de esta spec actualizados.

No hay funciones de negocio nuevas, dependencias nuevas ni cambios en clientes anteriores. El menú contiene exactamente «Volver» y «Modificar usuario».

## Pruebas ejecutadas

Entorno: Windows, PowerShell y Node 24.22.0. Comandos desde first-app.

- `node --test tests/vanilla-user-client.test.js`: pasan transporte, errores de operación y arranque sin base (3 casos). El caso de terminal detectó que su ejemplo consulta ID 3; se añadió ese usuario únicamente a la fixture.
- `node --test --test-name-pattern="four terminal" tests/vanilla-user-client.test.js`: pasa el caso corregido, ejecutando sin modificaciones los cuatro fragmentos existentes: listar, buscar por ID, actualizar y eliminar. Total: los cuatro casos quedan satisfactorios; no se repitieron los tres ya satisfactorios.
- Transporte: lista ordenada y vacía, consulta, IDs ausentes o inválidos, tipos/JSON inválidos, nombre vacío, correo inválido o duplicado, normalización, eliminación y conservación del otro usuario. También rutas estáticas permitidas y rechazo de archivos del proyecto.
- Fallos controlados sobre otra copia sin tabla: las cuatro operaciones responden 500 con su mensaje de catálogo, sin exponer errores de SQLite.
- Arranque sin base: termina con error y no crea SQLite.
- Servidores de pruebas cerrados. La preparación copia fuente excluyendo SQLite y auxiliares; utiliza esquema existente y usuarios ficticios y cierra la conexión de siembra antes del servidor.

## Navegador real

Playwright abrió el servidor de una copia desechable, no la base personal. Recorrido realizado en las tres pantallas:

- Lista por ID/nombre, entrar sin contraseña y selección vacía deshabilitada.
- Menú con exactamente dos acciones y datos del usuario seleccionado; volver conserva la lista.
- Edición con datos actuales e ID no editable; volver descarta cambios; guardar muestra nombre y correo normalizados.
- Mensajes exactos para nombre vacío, correo inválido y duplicado.
- Cancelar eliminación conserva la edición y el usuario; confirmar vuelve a lista actualizada sin selección y conserva al otro usuario.
- Eliminación del último usuario muestra lista vacía y bloquea entrar.
- Fallos de red de listar, consultar, modificar y eliminar muestran el mensaje correspondiente y conservan una vista recuperable.
- Comprobación específica tras ajustar la lectura de respuestas: JSON de respuesta inválido muestra `Could not update the user`; una respuesta válida permite guardar. Foco del título al volver a lista.
- Capturas inspeccionadas de las tres vistas a 390 × 844; sin desbordamiento horizontal.

El primer intento del recorrido esperó visibilidad de una opción nativa del selector y agotó el tiempo: se corrigió la espera a presencia en el DOM y se completó el recorrido. La consola registró los 400/409 provocados por las validaciones, errores de red inducidos y un 404 de favicon no incluido en el alcance. No hubo excepciones JavaScript durante el recorrido principal. El servidor propio de navegador se detuvo al terminar.

## Formato, lint y revisión estática

- `corepack pnpm format` y `corepack pnpm lint` ejecutaron sus scripts. pnpm emitió un aviso de acceso denegado al bloqueo de su almacén al intentar la verificación previa de dependencias; no se instalaron paquetes. Se cotejaron package.json y lockfile.
- Prettier local aplicado a los nuevos clientes, prueba y configuración. Su comprobación final `prettier --check` pasa.
- ESLint local sobre toda first-app pasa tras el último ajuste del cliente.
- `git diff --check` y comprobación de espacios en archivos nuevos: correctos.
- Revisión estática: transporte sin SQL ni conexión alternativa, reglas de negocio en lógica existente, estáticos limitados a tres rutas y comprobación de existencia de base anterior al import dinámico. Documentación y alcance revisados.
- El script de formato existente convirtió finales de línea de archivos protegidos. Se restauraron únicamente esos finales tras comprobar que reproducían exactamente los hashes iniciales; no quedó cambio en esos archivos.

## Conservación y límites

Los 190 archivos protegidos mantienen SHA-256 inicial: lógica, consultas, conexión, clientes y notebooks existentes, specs anteriores, lockfile y archivos de la otra aplicación. Ambas bases SQLite mantienen su hash inicial. ChromaDB conserva las 27.292 entradas del inventario inicial (rutas, tamaños y fechas de modificación); no se afirma una comparación de contenido mediante hash de ChromaDB.

Durante la implementación se conservaron HEAD y rama de trabajo. El diff se limita a los cinco archivos existentes previstos y once archivos nuevos de esta entrega, incluidos sus cuatro documentos SDD. Durante la implementación no se hicieron escrituras remotas. La autorización posterior permite publicar únicamente los 16 archivos de esta entrega en su rama existente y abrir PR draft contra staging.

No queda pendiente el recorrido de navegador. Queda pendiente la revisión humana del código publicado. No se comprobó compatibilidad con otros navegadores; la selección de usuario sigue sin constituir autenticación.


## Revisión correctiva del transporte y publicación

Esta sección registra resultados nuevos sobre la entrega inicial. Los resultados anteriores se conservan como evidencia de aquella ejecución y no se presentan como pruebas repetidas.

**Correcciones dentro del alcance:**

- Una petición JSON fragmentada dentro de un carácter UTF-8 guardaba el nombre como `Jos��` en lugar de `José`. El transporte decodifica ahora el flujo con UTF-8 antes de interpretar JSON. Las reglas y consultas existentes permanecen intactas.
- Un destino de petición mal formado (`//[`) lanzaba `Invalid URL` fuera del manejo de errores. El servidor devuelve ahora 404 y continúa atendiendo peticiones; no se amplían las rutas estáticas ni los contratos de usuarios.

**Pruebas reales de esta revisión:**

- Dos regresiones nuevas reprodujeron ambos defectos antes del arreglo y fallaron. Después, `node --test --test-name-pattern="transport uses|operation failures|UTF-8|malformed request targets" tests/vanilla-user-client.test.js` pasó sus cuatro casos: contratos del transporte, errores de operación y las dos regresiones. Los cuatro casos previos permanecen en el archivo sin modificaciones de contenido.
- No se repitieron las comprobaciones satisfactorias del arranque sin base ni de los clientes terminal: sus archivos no cambiaron. El arranque se revisó estáticamente: comprueba SQLite antes del import dinámico, sin inicializar tablas o migrar datos.
- Playwright recorrió realmente lista, menú y edición sobre otra copia con dos usuarios ficticios. Se verificaron selección por ID, menú de exactamente dos acciones, volver sin guardar, campos precompletados e ID no editable, nombre vacío, correo inválido y duplicado, guardar Unicode con normalización de correo y cancelación/confirmación del borrado. El otro usuario conservó nombre y correo.
- Un nombre que contenía una etiqueta img y manejador onerror se mostró literalmente, sin crear elementos HTML ni ejecutar el manejador. Tras guardar `José 🧪 <b>texto</b>`, el nombre siguió siendo texto, sin un elemento b. Se inspeccionaron capturas de las tres vistas a 390 × 844, sin desbordamiento.
- Prettier se aplicó solo al servidor y prueba afectados. ESLint pasó en esos dos archivos con la configuración vigente y dependencias ya instaladas: cero errores y advertencias. No se instaló nada ni se ejecutó formato global sobre lógica intacta.

**Ejecuciones descartadas y límites:**

La primera escritura del archivo de pruebas falló al codificar un emoji y lo dejó vacío; se restauró desde HEAD y se añadieron las regresiones correctamente. La salida satisfactoria de Node sobre el archivo vacío no se cuenta como validación. Una aserción de navegador leyó contenido anterior antes de esperar la vista; tras corregir la espera se completó el recorrido. Tampoco se presenta ese intento fallido como un defecto del cliente.

Los errores de consola HTTP 400/409 fueron provocados por las validaciones y se observó el 404 del favicon fuera del alcance. No hubo excepciones de JavaScript en el recorrido completado. No se comprobaron otros navegadores ni se repitieron pruebas de red ya satisfactorias del cliente sin cambios.

**Conservación y revisión estática:**

Se revisaron separación navegador → transporte → lógica → consultas → conexión, las tres rutas estáticas permitidas y los cuatro contratos HTTP. app.js utiliza Option, textContent y value para datos de usuarios; no los interpreta como HTML. No se modificaron frontend, launcher, lógica, consultas, conexión, clientes anteriores, dependencias, automatización, tools, agents, skills, templates, MCP o configuración personal.

El diff completo de la PR contra staging conserva sus 16 rutas de first-app. Esta revisión modifica solo servidor, pruebas, guía de uso y los cuatro documentos SDD de esta entrega; no integra otras ramas. Las pruebas nuevas utilizan copias sin SQLite personal ni sus auxiliares.

Se cotejaron los 3.407 archivos protegidos del worktree y los 3.453 del checkout principal, incluidas ambas bases SQLite y auxiliares existentes. No se crearon auxiliares ni SQLite en el worktree de revisión. Las ramas y PR independientes mantienen sus SHA previos. ChromaDB mantiene 27.292 entradas con tamaño y fecha; no se afirma un hash de todo su contenido.

El servidor de navegador se detuvo y el puerto 3000 quedó libre. Se dejó una copia desechable con Ada y Berta restauradas para revisión manual; la ubicación temporal y comandos exactos se indican en el informe de entrega, sin modificar datos personales.

Publicación selectiva autorizada en la misma rama y PR draft. Pendiente verificar tras la publicación: destino efectivo del push, ausencia de tags adicionales, cuerpo con casillas vacías, una sola línea de cierre, Development y SHA remoto por relectura. Sin revisores, comentarios a otras personas ni merge.
