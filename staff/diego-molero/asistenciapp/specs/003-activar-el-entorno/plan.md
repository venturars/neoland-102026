# Plan técnico 003 · Activar el entorno y arrancar la aplicación

> Estado: **Aprobado por autorización anticipada** · Versión: 1.0 · Creado: 2026-10-23 · Autorizado: 2026-10-23
>
> Spec: [spec.md](spec.md) v1.0 · Tarea: [#255](https://github.com/venturars/neoland-102026/issues/255)

La persona responsable aprobó la spec y autorizó expresamente las fases restantes hasta entregar la PR para revisión. Este plan se redacta antes de las tareas y de la implementación; no se atribuye una revisión individual de este documento.

## 1. Cambios

El cambio de uso se limita a los títulos y a la organización del README:

1. Renombrar el apartado 2 a **Activar el entorno**, conservando el texto y los comandos que preparan cada terminal nueva.
2. Después de ese bloque, insertar un separador y el apartado 3 **Arrancar la app**, justo antes de la tabla de las dos modalidades de arranque existentes.
3. Renumerar los apartados siguientes del 4 al 8, conservando sus títulos y contenido. La referencia a cerrar la aplicación dentro de problemas frecuentes pasa de sección 4 a sección 5.

Los comandos y las rutas escritas permanecen iguales. La preparación inicial, el uso para pasar lista, el cierre, los problemas frecuentes, las pruebas y la privacidad conservan su contenido, con el único ajuste de esa referencia interna.

La arquitectura, las rutas y respuestas de la API, los datos, las pantallas y las dependencias permanecen iguales. La constitución se conserva en versión 2.2.

El manual `AGENT.md` recibe únicamente una fila de seguimiento de la spec 003, con su estado real. Los documentos de las specs 001 y 002 conservan su contenido.

## 2. Comprobaciones

| Criterio | Comprobación |
| --- | --- |
| CA-01 | Leer el apartado 2: se titula «Activar el entorno» y contiene el bloque de preparación de una terminal nueva. |
| CA-02 | Leer el apartado 3: se titula «Arrancar la app» y contiene las dos modalidades de inicio existentes. |
| CA-03 | Comprobar que el bloque de activación termina antes del título de arranque. |
| CA-04 | Comparar con `df9f760` el contenido de cada apartado, todos los comandos y los demás archivos de la aplicación. Solo se permiten los títulos, el nuevo separador, la numeración y la referencia interna previstos. |

Además:

- Revisar el diff completo del README y el orden de sus ocho apartados.
- Comprobar UTF-8, enlaces locales y ausencia de espacios finales en los cinco documentos del cambio.
- Ejecutar la suite existente desde la carpeta de la aplicación con `.\.venv\Scripts\python.exe -X utf8 -m pytest` y registrar el resultado real y quién la ejecutó.
- No añadir tests que reproduzcan literalmente los títulos: la comparación documental y la suite existente cubren este cambio.

## 3. Comprobación de la constitución

| Regla | Cumplimiento |
| --- | --- |
| P1 · Independiente de plataforma | El registro de asistencia permanece igual. |
| P2 · Simplicidad | Se reorganizan títulos e instrucciones existentes. |
| P3 · Dependencias mínimas | Se conservan las dependencias actuales. |
| P4 · Privacidad | No se modifican datos ni almacenamiento. |
| P5 · Accesibilidad y móvil | Las pantallas permanecen iguales; la guía distingue los dos pasos. |
| P6 · Español | Documentos en español y UTF-8. |
| §3 · Stack | Se conserva el programa existente. |
| §4 · SDD | Spec aprobada y fases restantes autorizadas expresamente; se redactan plan y tareas antes de implementar. |
| §5 · Calidad | Cada criterio tiene una comprobación documental y se ejecutará la suite existente. |
| §6 · Seguridad | Se conservan las reglas de asistencia, las validaciones y el acceso del profesor. |
| §7 · Carpeta | Todos los archivos pertenecen a `staff/diego-molero/asistenciapp/`. |
| §8 · Enmiendas | La constitución no cambia. |

## 4. Entrega

La rama es `255-docs-clarify-environment-activation-and-startup`; la PR [#257](https://github.com/venturars/neoland-102026/pull/257) apunta a `staging` y cierra la issue #255.

La rama incorpora los commits pendientes de las PR #211 y #254. La revisión aislada del cambio 003 utiliza `df9f760` como referencia. Ninguna de esas PR se integra como parte de esta tarea.

Con la autorización recibida, se guardará y subirá el commit `docs(asistenciapp): clarify activation and startup`, se actualizará la PR y se marcará como lista para revisión, solicitándola a las dos personas revisoras autorizadas. La persona asignada seguirá siendo `moolero12`. El merge queda pendiente de las revisiones y de su autorización posterior.

## 5. Historial

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 1.0 | 2026-10-23 | Plan redactado bajo autorización anticipada | Concretar la separación de apartados y su comprobación antes de implementar |
