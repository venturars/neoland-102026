# Tareas para separar las guías de first-app-ai

Estado: tareas aprobadas por Miguel el 2026-10-27; implementación y comprobación documental completadas. Implementación aprobada por Miguel el 2026-10-27.
Spec: [spec.md](spec.md), aprobada por Miguel el 2026-10-27.
Plan: [plan.md](plan.md), aprobado por Miguel el 2026-10-27.
Tarea: [issue #475](https://github.com/venturars/neoland-102026/issues/475).
PR: [#482](https://github.com/venturars/neoland-102026/pull/482), con destino `staging`.

Todas las rutas de trabajo son relativas a `staff/miguel-rodriguez/first-app-ai/`. Ejecutar en orden después de aprobar estas tareas. Cada casilla se marca únicamente al completar su comprobación.

## Preparar la referencia

- [x] T01 — Confirmar alcance y conservar la referencia inicial.
  - Releer la spec, el plan, el manual y la constitución. Redactar de forma independiente a partir de nuestra app, sin copiar la documentación de Ventura. Confirmar la aprobación de estas tareas y la rama `475-docs-organize-first-app-guides`; si la situación difiere, resolverlo antes de editar.
  - Guardar fuera del proyecto una copia temporal de `AGENTS.md` y `docs/CONSTITUTIONS.md`, el inventario de archivos versionados y una referencia de su contenido para compararlo al terminar. Usar lecturas de archivos, sin importarlos ni ejecutarlos.
  - Resultado: referencia recuperable para el traslado y lista de cambios previos identificada. La base local ajena `staff/miguel-rodriguez/first-app/db/users.sqlite` queda fuera; no se lee, copia, modifica ni añade.

## Redactar las guías

- [x] T02 — Crear `docs/DATABASE.md`.
  - Trasladar conexión relativa al módulo, conexión exportada, carga de SQL, inicialización explícita y repetible, esquema de cinco columnas y restricciones. Conservar fechas locales, precisión, defaults y límite de email aplicado por la lógica.
  - Documentar las ocho consultas del plan con firmas, archivo SQL, parámetros, ejecución y retornos. Conservar coincidencia por nombre, orden por ID, `RETURNING *`, actualización de fechas y distinción entre filas, arrays, `undefined` y metadatos de borrado. Enlazar la constitución para reglas de negocio.
  - Resultado: comparar la guía con «Storage and queries», los detalles de conexión actuales y los ocho archivos SQL; todos los detalles de almacenamiento tienen destino y ninguno cambia.

- [x] T03 — Crear `docs/ERRORS.md`.
  - Trasladar los diez mensajes exactos y sus condiciones, distinguiendo validación, reglas de negocio y fallos de consulta. Conservar `Error` ordinario, precedencia, límites de los catches, tabla no inicializada y fallos al cargar módulos.
  - Incluir el fallo de consulta o petición del clasificador. No convertir los mensajes de presentación de Jupyter en errores de negocio ni añadir mensajes nuevos.
  - Resultado: comparar mensaje por mensaje y condición por condición con la referencia inicial; la lista y su tratamiento conservan el significado.

- [x] T04 — Crear `docs/STYLE.md`.
  - Trasladar las convenciones actuales de nombres, exports, imports y constantes de configuración, respetando nombres de documentos prescritos. Incorporar una operación pública de negocio por archivo mediante funciones, sin clases propias ni `this`, permitiendo registros ordinarios y bibliotecas existentes. Exigir una acción por línea, nombres descriptivos y pasos explícitos, sin envoltorios de resultados, clases de error propias ni ayudas o capas genéricas innecesarias.
  - Usar ejemplos breves que separen lectura y transformación, y condición y lanzamiento del error. Recoger comillas dobles, punto y coma, coma final, dos espacios y ancho de 80, sin instalar ni configurar herramientas.
  - Resultado: cada regla de estilo de la spec aparece en la guía. Queda explícito que rige el código nuevo y no exige dividir consultas/adaptadores, refactorizar lo anterior, traducir clientes ni renombrar variables SQL.

- [x] T05 — Crear `docs/ARCHITECTURE.md`.
  - Describir responsabilidades de conexión, SQL, consultas, las ocho operaciones, los nueve ejemplos de terminal y los nueve notebooks. Identificar las operaciones aun cuando se agrupen archivos de igual responsabilidad.
  - Incluir el adaptador Python, el runner Node, el arranque de Jupyter, requisitos, manifiesto, lockfile, `.gitignore`, README y documentos. Distinguir datos/entornos generados de archivos versionados.
  - Resultado: contrastar cada responsabilidad con los archivos actuales. Los detalles de almacenamiento, errores, estilo y contratos se consultan por enlaces a sus fuentes; no se inventan capas ni se duplican definiciones completas.

## Integrar las instrucciones

- [x] T06 — Reorganizar `docs/CONSTITUTIONS.md`.
  - Aplicar la tabla «Destino de cada contenido actual» del plan: retirar árbol, responsabilidades detalladas, almacenamiento, tabla de errores y convenciones trasladadas; enlazar las cinco guías. Revisar cada sección de la referencia para no perder reglas.
  - Mantener propósito, contratos públicos, ejemplos de terminal, paquetes, Socket y proceso e historia SDD. Explicitar los cuatro pasos aprobados sin cambiar la precedencia de las operaciones, incluido buscar el ID antes de validar campos en update.
  - Resultado: comparar las ocho firmas, entradas, normalización, propiedad del email, salidas, efectos y fallos con la referencia. Conservar contactos con cinco campos, tres contadores del clasificador y borrado sin datos, además de las decisiones propias aprobadas. Las secciones de paquetes, ejemplos y SDD conservan su contenido.

- [x] T07 — Actualizar `AGENTS.md` de la app.
  - Enlazar las guías, remitir a `STYLE.md` y sustituir la recomendación de copiar estilos antiguos por reconocer operaciones parecidas y escribir según la guía. Mantener límites de trabajo, aprobaciones, ejemplos, copias desechables y resolución de conflictos.
  - Exigir que el desarrollo que añade o elimina archivos actualice también árbol y responsabilidades. Distinguir diferencias de estilo antiguas de contradicciones de comportamiento o instrucciones.
  - Resultado: las convenciones trasladadas tienen una única fuente. Comparar la sección completa «Socket package validation» con la referencia: debe permanecer idéntica, incluida la cobertura limitada de campañas. No modificar el manual raíz.

- [x] T08 — Crear `docs/TREE.md` con el inventario final previsto.
  - Enumerar los archivos versionados y los nuevos de esta tarea: cinco guías, constitución, manual, nueve notebooks, nueve clientes de terminal y cinco directorios de features con sus documentos. Comprobar nombres contra el inventario, incluyendo los archivos nuevos aún no versionados de esta tarea.
  - Usar solamente rutas en el árbol, sin responsabilidades ni abreviaturas que oculten archivos. Excluir dependencias instaladas, entornos, cachés y bases locales generadas.
  - Resultado: árbol e inventario coinciden; arquitectura contempla las responsabilidades de los archivos incorporados por esta tarea.

## Revisar y registrar

- [x] T09 — Revisar las guías como conjunto.
  - Seguir los enlaces locales de los documentos creados o modificados y comprobar sus destinos. Recorrer el mapa de traslado del plan: cada contenido anterior debe conservarse en su fuente principal, con referencias breves donde correspondan.
  - Comprobar que se puede localizar almacenamiento y consultas en DATABASE, mensajes en ERRORS, responsabilidades en ARCHITECTURE, rutas en TREE, escritura en STYLE y contratos/paquetes/SDD en la constitución.
  - Resultado: no hay enlaces rotos, reglas perdidas, definiciones duplicadas ni contradicciones con la spec o la issue. Confirmar que ninguna guía presenta el estilo futuro como código ya implementado.

- [x] T10 — Comprobar el alcance final y registrar evidencia.
  - Revisar diff e inventario. Los únicos cambios admitidos son `AGENTS.md`, `docs/CONSTITUTIONS.md`, las cinco guías y `docs/specs/split-sdd-guides/`. Comparar los demás archivos versionados con la referencia de T01; código, SQL, clientes, notebooks, dependencias, configuración y specs históricas deben permanecer iguales. Los cambios ajenos identificados al principio permanecen intactos.
  - Registrar aquí los comandos ejecutados y resultados reales de T02–T09 y de la comparación final. No ejecutar la app, abrir conexiones, instalar herramientas ni repetir auditorías Socket: esta tarea no modifica ejecutables o paquetes. Retirar únicamente las copias temporales creadas en T01 después de registrar el resultado.
  - Resultado: evidencia del cumplimiento de los cuatro puntos de «Cómo probarlo» de la issue, tareas completadas según lo comprobado y cualquier bloqueo declarado. No atribuir una aprobación final ni una revisión de compañeros que no hayan ocurrido.

## Evidencia y decisiones

- 2026-10-27: Miguel aprobó la spec y el plan en la conversación.
- 2026-10-27: Miguel aprobó estas tareas en la conversación y después autorizó implementarlas siguiendo su orden.
- Preparar estas tareas no autoriza commits, push, cambios de base, solicitudes de revisión ni merge. La PR conserva `staging` como destino; las acciones de Git y publicación siguen su aprobación correspondiente.

### Resultado de implementación — 2026-10-27

- T01: `git status --short --branch` confirmó la rama de la tarea, sin modificaciones versionadas previas. Un bloque `python3 - <<'PY'` guardó dos copias documentales y un inventario con SHA-256 de los 58 archivos versionados de esta app en un directorio temporal fuera del proyecto. No se leyó ni copió ninguna base de datos.
- T02–T03: lectura de `queries/users.js`, `db/connection.js` y los ocho archivos `.sql`, sin importar módulos. La comparación con la referencia confirmó que el bloque completo de almacenamiento y consultas y el bloque de diez errores se conservaron íntegros en DATABASE y ERRORS. La tabla adicional relaciona cada consulta con su archivo y parámetros.
- T04–T05: revisión manual contra la spec y el plan. STYLE contiene las convenciones y los pasos separados; el ejemplo separa también leer la longitud y compararla. ARCHITECTURE identifica ocho operaciones, los nueve pares de clientes y los adaptadores/arranque de Jupyter. No se añadió una capa ni se trasladó lógica a los clientes.
- T06–T07: comparación literal con las copias iniciales: contratos públicos, ejemplos de terminal, reglas de paquetes y proceso/historia SDD permanecen íntegros en la constitución. La sección completa Socket del manual es idéntica. Las convenciones retiradas del manual están en STYLE y se conserva el procedimiento de verificación y conflictos.
- T08–T09: `python3 /tmp/neoland-475-verify.py`, script temporal de comprobación, reconstruyó las rutas del árbol y las comparó con el inventario versionado más los archivos nuevos: 66 rutas coincidentes. Comprobó 35 enlaces locales, incluidas sus anclas, sin destinos inexistentes. La lectura cruzada confirmó una fuente principal por tema; los contratos y ejemplos breves remiten a las guías correspondientes.
- T10: el mismo comando confirmó 56 archivos versionados protegidos con SHA-256 idéntico, dos documentos existentes modificados y ocho documentos nuevos (cinco guías y los tres documentos de esta feature). `git diff --check` terminó con código 0. `git diff --name-only` y `git status --short --branch` confirmaron el alcance, sin cambios staged. Una búsqueda con `rg -n 'CONSTITUTIONS\.md#|Storage and queries|Configuration naming'` permitió revisar referencias en README, manual y docs: no quedaron enlaces activos a las secciones trasladadas.

Los cuatro puntos de comprobación de la issue quedan cubiertos: ubicación/enlaces (T05–T09), base de datos/errores/Jupyter (T02–T03, T05, T08), estilo/mantenimiento (T04, T07) y conservación/alcance (T06–T07, T10).

No se arrancó la app ni Jupyter, no se abrieron conexiones ni se instalaron paquetes. La verificación fue documental; no se afirma una prueba de ejecución. Las copias y scripts temporales de esta tarea se retiraron al finalizar. El archivo SQLite ajeno permaneció fuera del trabajo. No se hicieron commits, push ni cambios en GitHub; no se atribuye aprobación final ni de compañeros.

### Aprobación para guardar el trabajo — 2026-10-27

Miguel aprobó la implementación revisada y autorizó commits pequeños, push y actualización de la descripción de #482. La PR mantiene `staging` como destino; esta autorización no solicita revisión de compañeros ni merge.
