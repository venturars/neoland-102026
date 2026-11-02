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
