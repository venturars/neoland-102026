Issue: #751

# Flujo de cambios con cinco momentos humanos

Estado: spec, plan y T01–T55 aprobados; implementación y enmienda 3.1 completadas. Commit selectivo, push y PR draft contra staging autorizados; publicación pendiente. Sin revisores ni merge. Resultados en [verification.md](verification.md).

## Problema

La persona responsable necesita gestionar los cambios de AsistenciApp mediante cinco momentos separados, con control explícito sobre la preparación, la implementación y la publicación. Actualmente se exige aprobar la spec, después el plan y después las tareas por separado, y esta copia todavía no incorpora la automatización del flujo de trabajo.

El cambio propuesto debe evitar publicaciones no autorizadas, documentos contradictorios y pérdida de datos o trabajos ajenos. Esta actualización conserva las reglas actuales hasta aprobar y aplicar su sustitución.

## Usuarios

- Persona responsable: decide cuándo avanzar, qué se implementa y qué se publica o se envía a revisión.
- Agente: ejecuta únicamente el momento autorizado y presenta su resultado antes de continuar.

## Historias de usuario

- HU-01: Como responsable, quiero intervenir en cinco momentos para separar el registro del trabajo, su preparación, su implementación y su publicación.
- HU-02: Como agente, quiero instrucciones y plantillas coherentes para preparar cada tarea sin repetir reglas ni inventar autorizaciones.
- HU-03: Como responsable, quiero conservar el comportamiento de la aplicación, sus pruebas y mis datos mientras cambia el proceso de trabajo.

## Criterios de aceptación

- **CA-01 (HU-01)** — Dada una tarea nueva, cuando se autoriza el primer momento, entonces se crea o reutiliza su issue y se detiene el flujo, sin abrir la rama ni encadenar el siguiente momento. Si hace falta concretarla, las preguntas se resuelven aquí.
- **CA-02 (HU-01)** — Dada una issue y la autorización expresa del segundo momento, cuando se prepara el trabajo, entonces se actualiza staging solo por avance rápido, se crea o recupera la rama y se abre o reutiliza su PR draft contra staging con la persona asignada y una única referencia de cierre real. Se realizan únicamente las operaciones de publicación comprendidas en esa autorización, sin specs todavía, y se detiene el flujo.
- **CA-03 (HU-01)** — Dado el borrador y la autorización del tercer momento, cuando se preparan los documentos, entonces se escriben spec, plan y tareas juntos, en ese orden y sin pausas intermedias, y se presentan para revisión. Se utiliza el siguiente número disponible, sin sobrescribir specs anteriores ni implementar.
- **CA-04 (HU-01)** — Dados los tres documentos revisados y la autorización del cuarto momento, cuando se implementa, entonces se ejecuta solo el alcance aprobado y se presentan resultados y pendientes sin commit ni push. Si los documentos requieren un cambio, se detiene la implementación para revisarlo.
- **CA-05 (HU-01)** — Dada la autorización expresa del quinto momento, cuando se publica o se pide revisión, entonces se realizan únicamente las operaciones solicitadas sobre los archivos y las personas indicadas, sin merge implícito. No se encadena otro momento automáticamente.
- **CA-06 (HU-02)** — Dada una tarea de cualquier tipo, cuando se prepara su issue o PR, entonces se usa la plantilla actual de ese tipo o, si no existe, la más cercana. Las doce plantillas actuales son la fuente de las reglas editoriales; la PR conserva las casillas sin marcar mientras corresponde al borrador y nunca publica marcadores pendientes.
- **CA-07 (HU-02, HU-03)** — Dados cambios locales, datos o una operación bloqueada, cuando actúa la automatización, entonces conserva el trabajo ajeno y los datos, valida la rama autorizada y comunica errores, colisiones o divergencias sin descartar, ocultar ni forzar cambios. Funciona desde el entorno habitual de trabajo sin modificar credenciales ni configuración personal; comprueba identidad y acceso y permite una alternativa autenticada cuando la vía preferida no sirve.
- **CA-08 (HU-02)** — Dada la sustitución aprobada del proceso, cuando se aplica la enmienda correspondiente, entonces la constitución, la guía de agentes y la documentación necesaria describen los mismos cinco momentos y sus límites. Los principios del producto se conservan y las reglas del proceso anterior no quedan vigentes en paralelo.
- **CA-09 (HU-03)** — Dadas las comprobaciones que fijan el flujo anterior y la versión de la constitución, cuando se autoriza su adaptación, entonces se ajustan únicamente las pruebas del SDD y de esa versión para verificar el proceso aprobado, conservando su cobertura y sin eliminar comprobaciones para hacerlas pasar. Las pruebas funcionales permanecen intactas.
- **CA-10 (HU-03)** — Dada esta actualización del proceso, cuando se revisa su alcance, entonces las funcionalidades, las pruebas funcionales, los datos, las specs anteriores y los trabajos independientes mantienen su contenido. Solo se comprueba lo afectado por este cambio, sin desarrollar una funcionalidad nueva ni repetir pruebas ajenas.

## Fuera de alcance

Cambios funcionales, pantallas, almacenamiento, datos locales, dependencias, credenciales, configuración personal y otras aplicaciones. No se reescriben specs anteriores ni se aplican las reglas de otro proyecto. La implementación se limita a los agentes, herramientas, instrucciones, documentación y comprobaciones SDD aprobados; las funcionalidades y pruebas funcionales se conservan.

## Preguntas abiertas

Ninguna sobre el alcance. Spec, plan y tareas, incluido CA-09, y la aplicación de la enmienda 3.1 se aprobaron expresamente. Implementación y comprobaciones completadas; se autoriza su publicación selectiva y la PR draft contra staging, sin revisores ni merge. La publicación se verificará por relectura.
