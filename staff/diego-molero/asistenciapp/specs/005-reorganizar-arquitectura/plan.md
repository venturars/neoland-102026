# Plan técnico 005 · Organización de documentos y responsabilidades

> Estado: **Autorizado anticipadamente** · Fecha: 2026-10-23
>
> [Spec](spec.md) · Issue #278 · PR [#280](https://github.com/venturars/neoland-102026/pull/280)

Este plan se redacta después de la spec y antes de las tareas. La persona responsable autorizó anticipadamente las fases y la entrega; no se atribuye una revisión individual de cada documento.

## 1. Organización y contratos

- `asistencia/domain/`: mover códigos y nombres, añadir comprobaciones de sesión existente, abierta y código válido. Excepciones de dominio para traducir a las mismas respuestas 404, 409 y 422. La validación de nombre conserva sus errores 400.
- `asistencia/usecases/attendance.py`: coordinar preparación, consulta, apertura, registro, cierre, eliminación y exportación. Recibir ruta de datos y reloj inyectable; llamar a reglas y almacenamiento.
- `asistencia/storage/sqlite.py`: acceso SQLite con una conexión abierta y cerrada por operación, incluidos los errores. Conservar exactamente las tablas `config`, `sessions` y `checkins`, columnas y restricción de duplicados.
- `app.py`: conservar `create_app(db_path, token=None, now=time.time)`, rutas, cabecera de autorización, campos JSON y códigos HTTP. Traducir resultados y errores sin abrir conexiones. Conservar la semántica del token opcional, las URLs públicas y el arranque.
- Mantener sin cambios `static/`, la exportación CSV, el túnel, las dependencias y las bases reales existentes. No se ejecutan migraciones ni se agregan datos nuevos.

Se conservan los nombres y algoritmos existentes de códigos y normalización. Los antiguos módulos de códigos, nombres y base desaparecen después de ajustar sus importaciones; los consumidores internos pasan a las carpetas nuevas.

## 2. Documentos

- Mover la constitución a `docs/CONSTITUTION.md`; enmendar a versión 2.3 el apartado de organización y registrar fecha y motivo, conservando íntegros propósito, principios, calidad, seguridad y reglas de aprobación.
- Crear `docs/ARCHITECTURE.md`, con responsabilidades, dirección de llamadas, estructura y límites. Siguen Flask, pytest y SQLite; no se incorporan PostgreSQL, SQLAlchemy, Alembic, abstracciones para múltiples almacenes ni otras herramientas.
- Renombrar el manual a `AGENTS.md`, actualizar enlaces y árbol, añadir la regla de módulos con resumen y funciones públicas con tipos, `:param`, `:return`, `:rtype` y ejemplo `Usage::`. Las funciones internas mantienen una responsabilidad y comentarios breves cuando explican una decisión.
- Actualizar solo los enlaces vigentes del README. Las referencias históricas de las specs anteriores se conservan; el seguimiento se actualiza en el manual vigente.

## 3. Pruebas y aceptación

| Criterio | Comprobación |
| --- | --- |
| CA-01 a CA-03 | Test de documentos y ubicaciones, manual con reglas de escritura y arquitectura documentada. |
| CA-04 | Analizar imports del dominio: sin Flask, SQLite, almacenamiento ni acciones. |
| CA-05 | Analizar imports del almacén: sin Flask, dominio ni acciones. |
| CA-06 | Analizar imports de la entrada HTTP: sin SQLite ni almacenamiento directo. |
| CA-07 | Suite actual, nueva prueba de datos creados con el esquema anterior y flujo de consulta, registro, cierre, eliminación y CSV. Comprobar que la definición del esquema se conserva. |
| CA-08 | Test y revisión de enlaces activos del README y del manual. |
| CA-09 | Constitución 2.3, historial y comparación de las secciones que deben conservarse. |

Añadir tests de fronteras reales de imports mediante AST y de documentación de las funciones públicas trasladadas. Los tests existentes solo cambian sus importaciones de códigos y nombres. Ejecutar primero los tests nuevos, comprobar sus fallos de organización y después la suite completa. Revisar UTF-8, formato y diff. Se registrará quién ejecuta y la salida real.

## 4. Comprobación de la constitución

P1: mismo registro independiente de plataforma. P2: tres responsabilidades y un solo almacén. P3 y §3: mismas dependencias, con organización descrita. P4 y §6: mismo esquema, solo nombre y hora; sin nuevos datos personales ni cambios de seguridad. P5: pantallas intactas. P6: español y UTF-8. §4: documentos antes del cambio, bajo autorización expresa. §5: criterios cubiertos por tests y comparaciones. §7: solo esta carpeta. §8: la enmienda 2.3 queda autorizada por esta spec y registrada.

## 5. Entrega

Rama `278-refactor-reorganize-asistenciapp-architecture`, destino `staging`, persona asignada `moolero12`, `Closes #278`. Referencia aislada: `fe2f7a2`; la rama incorpora las PR anteriores.

Se guardarán commits pequeños para los documentos y la separación del código, con sus comprobaciones. Se actualizará la PR y se solicitará revisión a las dos personas autorizadas. No se realizará el merge.
