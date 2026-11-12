# Plan técnico 002 · Especificación antes de cambiar la aplicación

> Estado: **Aprobado** · Versión: 1.0 · Creado: 2026-10-23 · Aprobado: 2026-10-23
>
> Spec: [spec.md](spec.md) v1.0, aprobada el 2026-10-23 · Tarea: [#253](https://github.com/venturars/neoland-102026/issues/253)

Este documento explica cómo cumplir los criterios de la especificación. Las tareas se redactarán después de aprobar este plan; los documentos de uso se modificarán después de aprobar las tareas.

## 1. Enfoque

El cambio de reglas se limita a dos archivos existentes: `CONSTITUTION.md` y `AGENT.md`. Los documentos de esta spec registran su definición, las aprobaciones, las tareas y las comprobaciones reales.

La arquitectura, las rutas y respuestas de la API, el modelo de datos, las pantallas y el comportamiento de pasar lista permanecen iguales. Se conservan las dependencias actuales y la suite de pruebas existente.

## 2. Cambios previstos

### 2.1 Constitución: obligación y responsable (CA-01 a CA-06, CA-08)

- En el apartado 4, ampliar la obligación de tener una spec aprobada a cualquier cambio en código, pruebas, README y documentación de uso.
- Al comenzar un pedido sin spec aprobada, permitir únicamente escribir su `spec.md`. Presentarla y esperar el sí antes de escribir el plan, las tareas o la implementación.
- Conservar el orden `spec → plan → tasks → implementación`, con aprobación expresa al terminar cada una de las tres primeras fases.
- Aclarar que una issue, una rama o una pull request no sustituyen la spec ni autorizan a saltarse las fases. El flujo de Git del repositorio sigue rigiendo esas operaciones.
- Exigir una spec nueva para un pedido fuera del alcance de la activa. La spec 001 terminada no se reutiliza para autorizar cambios posteriores.
- En los apartados 7 y 8, identificar `staff/diego-molero/asistenciapp/` y a la persona que trabaja en esta carpeta como responsable de aprobar las enmiendas.
- Subir la versión de 2.1 a 2.2 al aplicar la enmienda. Actualizar la fecha de última enmienda y añadir una fila al historial con la fecha real y el motivo: aprobación previa para todos los cambios y adaptación de carpeta y responsable.

### 2.2 Manual del agente: instrucciones diarias (CA-01 a CA-07)

- En el apartado 2, cambiar el alcance de «cada funcionalidad» a «cada cambio en esta aplicación» e indicar que el único archivo que se escribe al comenzar es la spec del pedido.
- Mantener las cuatro fases y expresar en la tabla y en sus instrucciones que aprueba la persona que trabaja en esta carpeta.
- En el apartado 2.4, incluir los cambios en pruebas y documentación dentro de la implementación. Si el pedido queda fuera del alcance aprobado, presentar una spec nueva y esperar aprobación.
- Actualizar la ruta de los comandos y la regla que delimita la carpeta de trabajo a `staff/diego-molero/asistenciapp/`.
- Adaptar las instrucciones vivas sobre explicación, aprobación de enmiendas, commits y definición de terminado a la persona responsable de esta carpeta. Las operaciones de Git mantienen las confirmaciones del flujo del repositorio.
- Sustituir el ejemplo numerado del bot por `002-spec-antes-del-cambio`. En la tabla de estado, conservar la fila de la spec 001, añadir la 002 y dejar el bot de Discord como idea futura sin número.
- Registrar la 002 como implementada únicamente después de realizar y comprobar sus cambios. La aprobación de la spec, el plan o las tareas no se registrará como aprobación final de la implementación.

### 2.3 Documentos que se conservan (CA-07)

Los tres documentos de `specs/001-checkin-codigo/` permanecen idénticos a la copia inicial. También se conserva el README, incluidos sus títulos y rutas actuales. Los cambios posteriores en esos documentos deberán estar cubiertos por sus respectivas specs.

Los archivos del programa, las pantallas, los tests y la configuración de dependencias permanecen sin modificaciones en este bloque.

## 3. Comprobaciones

Las reglas escritas se verifican mediante revisión de los apartados afectados y comparación de archivos. La comprobación de una instrucción demuestra que está escrita; no presupone que un agente la cumplirá automáticamente en todas las conversaciones futuras.

| Criterio | Comprobación |
| --- | --- |
| CA-01 | Leer constitución §4 y manual §2: la obligación incluye código, pruebas, README y documentación de uso. |
| CA-02 | Comprobar que ambos documentos permiten escribir únicamente la spec al comenzar y obligan a presentarla y esperar el sí antes del plan. |
| CA-03 | Revisar el orden de las cuatro fases y la aprobación expresa entre spec, plan, tareas e implementación. Las fechas reflejan las aprobaciones reales de este trabajo. |
| CA-04 | Comprobar la instrucción de abrir otra spec si el pedido queda fuera de la activa, el ejemplo 002 y la tabla de estado. |
| CA-05 | Leer la distinción entre issue, rama, PR y spec aprobada, manteniendo el flujo de Git del repositorio. |
| CA-06 | Revisar constitución §7 y §8 y manual §2, §4, §5 y §6: carpeta correcta y aprobación por la persona que trabaja en ella. |
| CA-07 | Comparar los tres documentos de la spec 001 con el commit inicial `43631f7`; el diff debe quedar vacío. |
| CA-08 | Comprobar versión 2.2, fecha real de última enmienda y nueva fila del historial con su motivo. |

Además:

- Revisar que el diff de los archivos existentes solo modifica la constitución y el manual. El README y el programa conservan su contenido respecto a `43631f7`.
- Comprobar que los documentos nuevos y modificados se pueden leer como UTF-8 y que no hay errores de espacios en el diff.
- Ejecutar una vez la suite existente desde la carpeta de la aplicación, con el entorno virtual local: `.\.venv\Scripts\python.exe -X utf8 -m pytest`. Registrar el resultado real al finalizar, sin dar por repetido el resultado del bloque anterior.
- Revisar contigo las reglas redactadas y diferenciar esa revisión de la aprobación de los compañeros en GitHub, que queda pendiente.

## 4. Comprobación de la constitución

| Regla | Cumplimiento previsto |
| --- | --- |
| P1 · Independiente de plataforma | El cambio afecta a las reglas de trabajo y conserva el registro de asistencia existente. |
| P2 · Simplicidad | Se precisan dos documentos existentes; no se añade una herramienta para imponer las aprobaciones. |
| P3 · Dependencias mínimas | Se conservan las dependencias declaradas. |
| P4 · Privacidad | No se añaden datos, almacenamiento ni servicios. |
| P5 · Accesibilidad y móvil | Las pantallas permanecen iguales. |
| P6 · Español | Los documentos y las explicaciones se escriben en español y UTF-8. |
| §3 · Stack | El programa y sus tecnologías permanecen iguales. |
| §4 · SDD | La spec y el plan están aprobados; las tareas se redactan en la fase siguiente y requieren aprobación antes de implementar. |
| §5 · Calidad | Cada CA tiene una comprobación documental en el apartado 3; la suite existente cubre posibles regresiones del programa. |
| §6 · Seguridad | Se conservan la validación de entradas, la caducidad de los códigos, la protección del profesor y las reglas de registro. |
| §7 · Carpeta | Los archivos de esta tarea pertenecen a `staff/diego-molero/asistenciapp/`; la enmienda adapta la regla a esa copia. |
| §8 · Enmiendas | La versión 2.2 se aplicará con la spec, el plan y las tareas aprobados; se registrarán fecha y motivo reales. |

## 5. Entrega y dependencias

La tarea se desarrolla en la rama `253-docs-require-approved-asistenciapp-specifications` y la PR [#254](https://github.com/venturars/neoland-102026/pull/254), con destino `staging` y cierre de la issue #253.

La rama incorpora los commits de la copia inicial de la PR #211 como dependencia. Mientras esa copia siga pendiente, también aparece en la comparación de esta PR con `staging`; la revisión del cambio 002 puede aislarse comparando con `43631f7`.

Los commits y la actualización final de la PR se presentarán para su confirmación antes de ejecutarlos. Las revisiones de los compañeros y la incorporación a `staging` quedan pendientes y no impiden preparar los bloques siguientes.

## 6. Historial

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-23 | Borrador del plan técnico | Definir la enmienda, las instrucciones del agente y las comprobaciones de los ocho criterios aprobados |
| 1.0 | 2026-10-23 | Plan técnico aprobado | Aprobación expresa para redactar las tareas |
