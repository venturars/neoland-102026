# Spec 005 · Organización de documentos y responsabilidades

> Estado: **Implementada y comprobada; entrega autorizada** · Versión: 1.1 · Creada, autorizada e implementada: 2026-10-23
>
> Tarea: [#278](https://github.com/venturars/neoland-102026/issues/278)

## 1. Problema

Las reglas y el manual comparten ubicación con el programa. Falta una explicación de la organización del código, y las decisiones de asistencia, el guardado de datos y la atención de las peticiones están mezclados.

Queremos separar esas responsabilidades y documentar cómo se escriben las funciones, conservando el funcionamiento que utilizan profesor y alumno.

## 2. Usuarios

| Usuario | Necesidad |
| --- | --- |
| Persona que mantiene la aplicación | Encontrar los documentos y cambiar una responsabilidad sin mezclarla con las demás. |
| Agente | Seguir una organización y una forma de documentar el código claramente descritas. |
| Profesor y alumno | Seguir pasando lista con los mismos resultados. |

## 3. Historias de usuario

- **HU-01**: Quiero las reglas y la arquitectura en su carpeta de documentos, con enlaces que funcionen.
- **HU-02**: Quiero separar reglas, acciones y almacenamiento, con cada función documentando lo que recibe y devuelve.
- **HU-03**: Quiero conservar los datos, las pantallas y el comportamiento de asistencia.

## 4. Criterios de aceptación

- **CA-01**: Dado el proyecto, cuando se busca la constitución, entonces está en `docs/CONSTITUTION.md` y no en la raíz.
- **CA-02**: Dada la documentación, cuando se consulta `docs/ARCHITECTURE.md`, entonces explica las reglas, las acciones, el almacenamiento y la atención de peticiones con solo las piezas que esta aplicación necesita.
- **CA-03**: Dada la raíz, cuando se busca el manual, entonces existe `AGENTS.md` en lugar de `AGENT.md` y establece cómo documentar entradas, resultado y ejemplos de las funciones.
- **CA-04**: Dadas las reglas de asistencia, cuando se lee su código, entonces no dibuja pantallas ni abre el archivo de datos.
- **CA-05**: Dado el almacenamiento, cuando se lee su código, entonces guarda y recupera datos sin decidir las reglas de asistencia ni dibujar pantallas.
- **CA-06**: Dada la atención de peticiones, cuando se lee su código, entonces llama a las acciones y no abre directamente el archivo de datos.
- **CA-07**: Dada una aplicación y datos existentes, cuando se abre una clase, se registra, se cierra, se elimina o se exporta, entonces se conservan los resultados, los datos y el acceso del profesor.
- **CA-08**: Dados el README y el manual, cuando se siguen sus enlaces de uso a la constitución y la arquitectura, entonces abren los documentos en su ubicación real.
- **CA-09**: Dada la constitución, cuando se consultan los archivos y carpetas, entonces reflejan la organización nueva, con enmienda registrada y manteniendo propósito, privacidad y reglas de asistencia.

## 5. Fuera de alcance

- Funcionalidades nuevas, dependencias nuevas, cambios de pantallas, reglas, datos guardados o permisos.
- Reescribir las specs 001 a 004: sus referencias históricas conservan los nombres utilizados al redactarse.
- Cambiar el propósito, privacidad o seguridad, desplegar la aplicación o incorporar las PR a `staging`.

## 6. Preguntas abiertas

Ninguna. Todas las fases y la entrega están autorizadas anticipadamente. Las revisiones de compañeros y el merge quedan pendientes.

## 7. Historial

| Versión | Fecha | Cambio |
| --- | --- | --- |
| 1.0 | 2026-10-23 | Especificación redactada bajo autorización anticipada. |
| 1.1 | 2026-10-23 | Documentos y responsabilidades separados; nueve criterios revisados y 93 tests superados por el agente, incluida compatibilidad de datos anteriores. Revisión y merge pendientes. |
