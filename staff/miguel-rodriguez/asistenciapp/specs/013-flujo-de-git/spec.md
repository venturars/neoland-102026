# Flujo de trabajo y cinco momentos

Issue: #761.
Estado: preparación y ejecución completa delegadas por Miguel el 2026-11-02.
No se atribuyen aprobaciones individuales de documentos ni revisión de compañeros.

## Problema

El flujo de trabajo del curso aún no está integrado en esta copia de AsistenciApp.
Quien desarrolla debe repetir instrucciones y dar aprobaciones entre documentos,
aunque el ejercicio actualizado reúne su preparación en un solo momento.

## Usuarios e historias

- Miguel quiere pedir una tarea, prepararla, implementarla o publicarla sin repetir
  autorizaciones dentro del momento solicitado.
- El agente necesita saber qué puede hacer, cuándo parar y cómo conservar el trabajo
  y las revisiones existentes.

## Criterios de aceptación

- **CA-01:** Dada una tarea, cuando se pide dejarla escrita, entonces se crea una
  issue asignada con alcance y comprobaciones; no se abre la rama automáticamente.
- **CA-02:** Dada una issue, cuando se pide empezar, entonces la rama nace de
  staging actualizado, tiene un commit vacío de apertura y una PR en draft hacia
  staging, asignada y enlazada con Closes y Development; no se escribe código.
- **CA-03:** Dado el momento de preparar documentos, cuando termina, entonces spec,
  plan y tareas están escritos y revisados en orden, sin paradas entre ellos ni
  implementación. Una duda real se resuelve antes de continuar.
- **CA-04:** Dada la petición de implementar con los tres documentos preparados,
  cuando termina, entonces solo se ejecuta ese alcance, se verifica y se registra
  la evidencia; no se hace commit ni push sin petición.
- **CA-05:** Dada la petición de publicar o pedir revisión, cuando termina, entonces
  solo se han realizado las acciones solicitadas. Las PRs siguen hacia staging,
  sus revisores son los nombrados y no se fusionan automáticamente.
- **CA-06:** Dada la carpeta del proyecto, cuando el agente consulta su flujo,
  entonces encuentra sus agentes, skills, herramientas y plantillas por tipo,
  adaptados a Codex, sin copiar credenciales ni depender de abrir Cursor.
- **CA-07:** Dado este mantenimiento, cuando se compara la aplicación antes y
  después, entonces permanecen idénticos sus datos, código, dependencias,
  seguridad de las carreras y evidencias históricas; las pruebas siguen pasando.
  Solo las comprobaciones de versión documental se actualizan a la enmienda vigente,
  sin retirar controles de comportamiento, privacidad o capas.
- **CA-08:** Dado el encargo global de Miguel de terminar el trabajo pendiente,
  cuando se ejecuta esta entrega, entonces se registra esa autorización expresa
  para los momentos incluidos sin inventar aprobaciones documento por documento.

## Corrección solicitada el 2026-11-03

La integración conserva la implementación de las herramientas del template del
curso. Solo se adaptan las rutas de invocación y las referencias al proceso de
esta app. No se sustituyen por herramientas propias de first-app-ai. Deben
estar presentes todas las herramientas y sus instrucciones, incluida la opción
de crear una rama desde otra base; el flujo normal de esta app sigue partiendo
de staging. Esta corrección está autorizada por Miguel dentro de la misma PR.

## Fuera de alcance

Cambiar la carrera o el registro de asistencia, añadir funciones de notas o RAG,
modificar first-app o ChromaDB, instalar paquetes, tocar credenciales, fusionar PRs,
reducir las protecciones de datos o reescribir specs anteriores. La lectura de la
 guía de capas y del CDD queda para Miguel.

## Preguntas abiertas

Ninguna para este mantenimiento. Las revisiones de compañeros son posteriores.
