Issue: #751

# Integración del flujo de Git original en AsistenciApp

Estado: spec, plan y C01–C20 aprobados conjuntamente. Corrección implementada y comprobada localmente, incluido el ajuste de §4 y enmienda 3.1; pendiente revisión humana. Trabajo independiente pausado e intacto; resultados nuevos por separado.

## Problema

La entrega incorporó herramientas e instrucciones reescritas en lugar del flujo de referencia. Se necesita integrar los originales, manteniendo el proceso propio de AsistenciApp y mostrando las diferencias que realmente requiere su ubicación.

La evidencia anterior corresponde a la implementación publicada; no acredita las herramientas originales que ahora se propone incorporar.

## Usuarios

- Persona responsable: revisa la comparación y autoriza la corrección antes de implementarla.
- Agente: integra la fuente fijada y explica sus límites sin introducir mejoras propias.

## Historias de usuario

- HU-01: Como responsable, quiero conservar los cinco momentos de AsistenciApp sin nuevas pausas entre los documentos.
- HU-02: Como responsable, quiero reconocer el flujo original y sus archivos, con una adaptación mínima y verificable.
- HU-03: Como responsable, quiero conservar la aplicación, sus datos, pruebas, evidencias y trabajos independientes.

## Criterios de aceptación

- **CA-01 (HU-01)** — Dada una tarea nueva, cuando se prepara la issue, entonces se concreta y registra el trabajo y se termina ese momento sin abrir rama.
- **CA-02 (HU-01)** — Dado el momento de preparar el draft, cuando se autoriza su apertura, entonces se completa la secuencia de actualización, rama, apertura, publicación, borrador, asignación y enlace, sin escribir specs ni pedir permisos intermedios no previstos.
- **CA-03 (HU-01)** — Dado el momento de documentos, cuando se preparan, entonces se escriben spec, plan y tareas en ese orden y en la misma pasada, se usa el siguiente número disponible para tareas nuevas y se presentan juntos para revisión, sin implementar.
- **CA-04 (HU-01)** — Dados los documentos que cubren el cambio y la petición de implementar, cuando se ejecutan las tareas, entonces se entrega el resultado sin commit ni push.
- **CA-05 (HU-01)** — Dado el momento de la pull request, cuando se pide actuar sobre ella, entonces se realiza solo lo solicitado; el proceso no implica merge ni encadena otro momento.
- **CA-06 (HU-02)** — Dada una issue o PR, cuando se prepara su contenido, entonces se usan las doce plantillas originales actuales, su selección por tipo y la alternativa más cercana definida por la fuente, sin duplicar sus reglas editoriales.
- **CA-07 (HU-02)** — Dada la fuente fijada, cuando se integra el flujo, entonces se conservan su estructura, nombres y herramientas originales y se retiran la implementación propia y sus ensayos. Los agentes, skills y referencia de conexión proceden de los originales; las diferencias se limitan a rutas, referencias y documentación necesarias del proyecto.
- **CA-08 (HU-01)** — Dada la enmienda de esta entrega, cuando se corrige su redacción, entonces mantiene el SDD de AsistenciApp: issue, draft, tres documentos juntos, implementación y actuación solicitada sobre la PR. Conserva los principios del producto y no añade puertas, reglas o un SDD de otro proyecto.
- **CA-09 (HU-03)** — Dadas las comprobaciones del SDD, cuando su redacción deba acompañar el ajuste aprobado, entonces se modifica solo lo necesario para mantener cobertura de los cinco momentos y sus invariantes, sin eliminar comprobaciones para obtener un resultado satisfactorio. Las pruebas funcionales siguen intactas.
- **CA-10 (HU-03)** — Dada esta corrección, cuando se revise su alcance, entonces se conservan funcionalidades, datos, pruebas funcionales, specs anteriores y trabajos independientes. No se instala nada ni se modifica configuración personal.
- **CA-11 (HU-02)** — Dados los comentarios de revisión, cuando se comparan con la fuente, entonces cada uno queda clasificado como resuelto al retirar código propio, aplicable todavía o presente también en la fuente. Lo presente en la fuente se comunica antes de introducir cualquier divergencia; esta propuesta no introduce tales arreglos.
- **CA-12 (HU-03)** — Dadas las evidencias anteriores, cuando se comprueba la corrección, entonces permanecen intactas y los nuevos resultados se registran por separado, distinguiendo comparación, revisión estática y ejecución real.

## Fuera de alcance

Cambios de producto, almacenamiento, dependencias, credenciales, configuración personal y otros proyectos. Mejoras de las herramientas originales, traducciones o implementaciones equivalentes, ensayos propios permanentes, respuestas o resolución de conversaciones y publicaciones no autorizadas.

## Preguntas abiertas y pausa

No hay una propuesta de divergencia respecto del código original. El plan señala las limitaciones presentes en la fuente para su revisión.

Implementación y C19 autorizados: commits y push de ensayo exclusivamente en repositorios desechables con remoto local, sin otro permiso para esos ensayos. La publicación selectiva de la corrección está autorizada en la misma rama y PR #756. Se conserva Closes #751 y Development; sin respuestas a comentarios, resolución de conversaciones, cambios de revisores ni merge.
