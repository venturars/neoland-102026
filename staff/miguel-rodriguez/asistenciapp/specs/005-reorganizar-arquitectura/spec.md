# Spec 005 · Separar documentos y responsabilidades

Estado: aprobada por Miguel el 2026-10-23. Creada el 2026-10-23. Implementada y verificada el 2026-10-23; revisión final aprobada por Miguel el 2026-10-23.

Tarea: [issue #281](https://github.com/venturars/neoland-102026/issues/281). Revisión: [PR #284](https://github.com/venturars/neoland-102026/pull/284). Parte del resultado aprobado de 004; su integración depende de [PR #252](https://github.com/venturars/neoland-102026/pull/252).

## Problema

La aplicación reúne en su entrada las decisiones de asistencia, el acceso a los datos y la atención a quienes la utilizan. Cuesta identificar qué parte debe cambiar cuando cambia una responsabilidad. Las reglas están en la raíz y falta una explicación de la arquitectura y de cómo documentar las funciones.

Miguel necesita comprender y mantener una organización por responsabilidades, con el mismo resultado de asistencia que ya funciona. Este paso corresponde a la reorganización 005 del ejercicio de clase; la protección contra intentos automatizados se abordará después.

## Usuarios

- Miguel y quienes mantienen esta copia.
- El agente que prepara los cambios y necesita reglas claras.
- El profesor y el alumnado que utilizan la asistencia.

## Historias de usuario

- **HU-01:** Como responsable, quiero encontrar las reglas y la arquitectura en documentos claros y correctamente enlazados.
- **HU-02:** Como agente, quiero saber cómo trabajar y cómo explicar lo que recibe y devuelve cada función.
- **HU-03:** Como responsable, quiero que las reglas de asistencia, las acciones y la conservación de datos tengan responsabilidades separadas.
- **HU-04:** Como profesor o alumno, quiero conservar el funcionamiento y los datos actuales.

## Criterios de aceptación

- **CA-01:** Dado el proyecto reorganizado, cuando se busca la constitución, entonces está en `docs/CONSTITUTION.md` y ya no existe en la raíz.
- **CA-02:** Dada la documentación de arquitectura, cuando se lee `docs/ARCHITECTURE.md`, entonces explica las responsabilidades de las reglas, las acciones, la persistencia y la entrada de la aplicación, sus relaciones y sus límites; describe solo las piezas que esta app necesita.
- **CA-03:** Dado el manual del agente, cuando se consulta la raíz, entonces `AGENTS.md` sustituye a `AGENT.md`, conserva las reglas de trabajo y aprobación de Miguel y añade pautas para que cada función explique qué recibe, qué devuelve y un ejemplo corto.
- **CA-04:** Dada la parte que decide las reglas de asistencia, cuando se revisa, entonces no abre ni consulta el almacenamiento ni construye pantallas o respuestas para el usuario.
- **CA-05:** Dada la parte que conserva los datos, cuando se revisa, entonces no decide la validez de una asistencia ni construye pantallas o respuestas para el usuario.
- **CA-06:** Dadas las acciones y la entrada de la aplicación, cuando se revisan, entonces las acciones coordinan las reglas y la persistencia, y la entrada delega en ellas sin acceder directamente al almacenamiento.
- **CA-07:** Dada la aplicación y sus datos existentes, cuando se abre, consulta o cierra una clase, se registra un alumno, se gestiona un registro inválido o repetido, se elimina un registro o se descarga la lista, entonces se conservan los resultados, mensajes, permisos y datos del comportamiento anterior. La reorganización no exige borrar ni convertir los datos existentes.
- **CA-08:** Dados el README y el manual vigente, cuando se siguen sus enlaces a las reglas, el manual o la arquitectura, entonces llevan a los documentos en sus ubicaciones actuales. Los comandos de uso y las demás instrucciones permanecen iguales.
- **CA-09:** Dada la constitución reubicada, cuando se leen sus referencias a la organización, entonces coinciden con el resultado y la enmienda queda versionada y fechada. Se conservan propósito, principios, privacidad, seguridad, stack, aprobaciones y la excepción de verificación documental ya aprobada.
- **CA-10:** Dadas las specs cerradas 001–004, las pantallas y los archivos ajenos a esta reorganización, cuando termina 005, entonces permanecen intactos. Las referencias históricas a ubicaciones anteriores se conservan en esas specs; los documentos vigentes explican las ubicaciones actuales.

## Fuera de alcance

Nuevas funciones de asistencia, límites por IP, bloqueo de usuarios, nuevas formas de registro o exportación, rediseño visual, integraciones, dependencias nuevas, cambio de stack, herramientas de desarrollo adicionales y cambios en otras aplicaciones. No se reescriben las specs 001–004 ni sus evidencias. No se copia la implementación del profesor.

## Relación con la constitución

La tarea autoriza proponer en el plan una enmienda limitada a la organización y las ubicaciones de documentos. Miguel deberá aprobar ese plan antes de aplicar la enmienda. No se modifican ahora la constitución, el manual ni el código. La numeración de versión partirá de la versión vigente de esta copia, 2.3, conservando su historial.

## Preguntas abiertas

Ninguna decisión de producto pendiente. Tras aprobar este spec, el plan concretará los módulos, los movimientos, la enmienda y las verificaciones de conservación y responsabilidades.
