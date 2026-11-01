# Código de first-app-ai conforme a sus guías

Estado: aprobada por Miguel al solicitar el plan el 2026-10-27.
Tarea: [issue #517](https://github.com/venturars/neoland-102026/issues/517).
PR: [#518](https://github.com/venturars/neoland-102026/pull/518), en draft y dirigida a `staging`.
Referencia docente: [tarea #412 de Ventura](https://github.com/venturars/neoland-102026/issues/412).

## Propósito y usuarios

Quien aprende, mantiene o revisa first-app-ai necesita poder seguir su código paso a paso y reconocer las responsabilidades descritas en las guías aprobadas.

El resultado será la misma aplicación, con una escritura más explícita y nombres que permitan entender qué valor se obtiene, qué condición se comprueba y qué operación se realiza. Esta tarea aplica al código existente las reglas que la separación de guías y la incorporación de formato y lint dejaron pendientes.

## Entrada y resultado

Entran el código actual de first-app-ai y sus guías aprobadas de arquitectura y estilo. Saldrá el código adaptado a esas guías, manteniendo las responsabilidades del almacenamiento, las operaciones de negocio, los clientes y el arranque.

- Los pasos se leen de forma explícita: obtener un valor, transformarlo, comprobar una condición y actuar sobre ella se distinguen según la guía de estilo.
- Los nombres describen los valores y las comprobaciones. Las convenciones de nombres y formato siguen las guías existentes.
- Cada operación conserva sus responsabilidades; la presentación continúa en los clientes y las decisiones de negocio en las operaciones.
- La adaptación mantiene soluciones sencillas y locales. No introduce abstracciones para esconder los pasos que se quiere hacer legibles.

Las fuentes de las reglas siguen siendo la [constitución](../../CONSTITUTIONS.md), la [arquitectura](../../ARCHITECTURE.md) y la [guía de estilo](../../STYLE.md). Esta spec autoriza adaptar el código antiguo a esas reglas; no cambia las reglas ni convierte cada diferencia de estilo en una funcionalidad nueva.

## Comportamiento que se conserva

Para las entradas ya previstas por los contratos, las operaciones mantienen sus firmas públicas, normalización, validaciones, orden de comprobación, llamadas y efectos observables, resultados y mensajes exactos. Se conserva cuándo una comprobación evita evaluar un paso posterior; separar acciones no permite adelantar lecturas, consultas o llamadas que antes no se ejecutaban.

Se mantienen las reglas de almacenamiento, la inicialización explícita, las consultas SQL y el esquema. La adaptación no modifica registros de trabajo ni cambia las reglas de creación y actualización de timestamps. Las operaciones de lectura y clasificación siguen sin escribir registros ni fechas.

El clasificador conserva el prompt propio aprobado, la conexión y configuración existentes, el tratamiento de respuestas, las categorías, los errores y las reglas de agregación. Para las mismas respuestas del servicio se obtiene el mismo resultado; no se exige que dos ejecuciones independientes del modelo generen respuestas idénticas.

Los clientes de terminal y Jupyter siguen permitiendo las mismas operaciones, con las mismas entradas, presentación, mensajes y requisitos. El arranque conserva su comportamiento y compatibilidad actuales. La tarea no cambia el modo de lanzar Jupyter ni traduce los ejemplos.

## Ejemplos y fallos visibles

- Crear un contacto válido sigue normalizando sus datos y devolviendo el mismo conjunto de campos. Un nombre vacío, un email inválido o un email ya utilizado conservan sus errores y su orden de comprobación.
- Actualizar un ID inexistente sigue comunicando que el usuario no existe antes de validar los cambios. Separar la lectura de valores no puede provocar un error nuevo al intentar leer ese usuario ausente.
- Buscar por nombre sigue recortando los espacios exteriores, exigiendo coincidencia completa y sensible a mayúsculas y devolviendo todas las coincidencias ordenadas. Un nombre sin coincidencias sigue devolviendo una lista vacía.
- Un fallo de consulta o del servicio de clasificación conserva el mensaje previsto y no se convierte en un resultado parcial ni en un error nuevo de validación.
- Quien usa los clientes puede seguir inicializando, creando, consultando, actualizando, eliminando y clasificando contactos de la misma forma después de la adaptación.

La lista completa de contratos y fallos continúa en la constitución y en la [guía de errores](../../ERRORS.md); estos ejemplos no la sustituyen. Si se descubre una contradicción entre código y contratos aprobados, se identifica y se resuelve antes de cambiar ese comportamiento. No se corrige silenciosamente dentro del refactor.

## Documentación y comprobación

La revisión debe cubrir el código existente de la aplicación y señalar qué partes ya cumplen las guías y cuáles necesitan adaptación. No se dan por revisadas solo las operaciones de negocio dejando fuera sus conexiones con almacenamiento, clientes y arranque.

La tarea estará completa cuando:

1. El código siga las reglas aplicables de arquitectura y estilo, con pasos explícitos y nombres comprensibles, sin alterar las responsabilidades existentes.
2. Se haya comprobado en copias desechables que las operaciones y sus clientes conservan sus resultados, errores y efectos sobre los datos, incluyendo casos correctos, validaciones, ausencia de contactos y fallos previstos. La evidencia distinguirá resultados comprobados, simulaciones del servicio y cualquier prueba real pendiente.
3. `pnpm format` y `pnpm lint` terminen correctamente. Estos comandos complementan la revisión de lectura y comportamiento; no sustituyen esas comprobaciones.
4. El árbol y la arquitectura reflejen los archivos entregados y sus responsabilidades, incluyendo los documentos de este desarrollo. Las guías no afirmarán que existen cambios aún no realizados.
5. Los cambios estén limitados a first-app-ai y las bases locales de trabajo permanezcan intactas. Se registren los resultados reales de la verificación y se retiren las copias temporales de la tarea.

La verificación no puede utilizar una base local de trabajo como entorno de ensayo. Cualquier comprobación que no se pueda ejecutar se registra como pendiente; no se presenta como pasada por disponer de formato o lint satisfactorios.

Se mantienen las aprobaciones separadas de spec, plan y tareas antes de implementar, así como el procedimiento Socket vigente. Esta tarea no necesita añadir ni actualizar dependencias.

## Fuera de alcance

- Añadir funcionalidades, nuevas validaciones de entrada, categorías o mensajes de error.
- Cambiar firmas, resultados, orden de validación, reglas de timestamps, SQL, esquema o datos de trabajo.
- Cambiar el prompt aprobado o los requisitos y comportamiento del clasificador y de Jupyter.
- Rediseñar la arquitectura, añadir capas o ayudas genéricas, o dividir módulos que las guías permiten conservar agrupados.
- Actualizar dependencias, herramientas o configuraciones de formato y lint para facilitar el refactor.
- Reescribir specs históricas, copiar el código de Ventura o modificar otros proyectos, incluida AsistenciApp.

## Preguntas pendientes

Ninguna decisión de alcance pendiente. El plan identificará los cambios concretos y las comprobaciones necesarias para demostrar la equivalencia, sin ampliar este alcance.
