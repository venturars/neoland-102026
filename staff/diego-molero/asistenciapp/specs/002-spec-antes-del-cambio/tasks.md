# Tareas 002 · Especificación antes de cambiar la aplicación

> Estado: **Terminadas con conformidad final** · Versión: 1.2 · Creado: 2026-10-23 · Aprobado: 2026-10-23 · Implementado: 2026-10-23 · Conformidad final: 2026-10-23
>
> Spec: [spec.md](spec.md) v1.0 · Plan: [plan.md](plan.md) v1.0 · Tarea: [#253](https://github.com/venturars/neoland-102026/issues/253)

La spec, el plan y esta lista están aprobados. Las tareas se ejecutan en orden y se marcan al comprobar su resultado. Los resultados y sus fechas se registran después de obtenerlos.

## 1. Constitución

- [x] **T01 · Actualizar las reglas de la constitución.**
  - En `CONSTITUTION.md` §4, exigir spec aprobada para los cambios en código, pruebas, README y documentación de uso. Al comenzar, permitir escribir únicamente la spec y esperar aprobación antes del plan; conservar las aprobaciones entre plan, tareas e implementación.
  - Indicar que una issue, una rama o una PR no sustituyen la spec, y que un pedido fuera del alcance aprobado requiere otra.
  - En §7 y §8, identificar `staff/diego-molero/asistenciapp/` y a la persona que trabaja en esa carpeta como responsable de aprobar.
  - Subir a la versión 2.2, actualizar la fecha de última enmienda y añadir al historial el motivo y la fecha real.
  - **Cubre:** CA-01, CA-02, CA-03, CA-04, CA-05, CA-06 y CA-08; plan §2.1.
  - **Hecha cuando:** la revisión de §4, §7, §8 y del historial confirma esas reglas; el resto de los principios conserva su contenido.

## 2. Manual del agente

- [x] **T02 · Precisar las fases y sus aprobaciones.**
  - En `AGENT.md` §2 y §2.4, aplicar el flujo a cada cambio de la aplicación, incluidos los tests y la documentación.
  - Explicar que al comenzar solo se escribe la spec, se presenta y se espera el sí. Mantener las fases spec, plan, tareas e implementación, con aprobación expresa para pasar a la siguiente.
  - Indicar que un pedido fuera de la spec activa abre otra y que los elementos de Git no sustituyen su aprobación.
  - **Cubre:** CA-01, CA-02, CA-03, CA-04 y CA-05; plan §2.2.
  - **Hecha cuando:** las instrucciones de §2 y la tabla de fases son coherentes entre sí y con la constitución actualizada.

- [x] **T03 · Adaptar la carpeta y la persona responsable.**
  - En las reglas vivas de `AGENT.md`, identificar `staff/diego-molero/asistenciapp/` y la aprobación por la persona que trabaja en esta carpeta.
  - Adaptar las menciones sobre explicaciones, enmiendas, commits y definición de terminado. Mantener las confirmaciones del flujo de Git del repositorio.
  - Conservar los comandos y las notas históricas que quedan fuera de esta spec.
  - **Cubre:** CA-06; plan §2.2.
  - **Hecha cuando:** las instrucciones operativas dejan de atribuir las aprobaciones a otra persona o limitar el trabajo a otra carpeta.

- [x] **T04 · Identificar la spec activa y la idea futura.**
  - En `AGENT.md`, usar `002-spec-antes-del-cambio` como ejemplo de numeración y añadir su fila a la tabla de estado como implementación en curso.
  - Conservar la fila de la spec 001 y dejar el bot de Discord como idea futura sin número.
  - **Cubre:** CA-04 y CA-07; plan §2.2 y §2.3.
  - **Hecha cuando:** el número 002 identifica este cambio y la tabla no lo presenta como terminado antes de las comprobaciones.

## 3. Comprobaciones

- [x] **T05 · Revisar las reglas, el alcance y el formato.**
  - Completar la revisión documental de CA-01 a CA-08 descrita en plan §3, contrastando constitución y manual.
  - Comparar con `43631f7` los tres documentos de la spec 001, el README y los archivos del programa, las pantallas, los tests y las dependencias; deben conservar su contenido.
  - Confirmar que los únicos archivos existentes modificados son `CONSTITUTION.md` y `AGENT.md`, además de los documentos nuevos de esta spec.
  - Comprobar UTF-8 y ausencia de espacios finales en los cinco documentos de este cambio.
  - **Cubre:** CA-01 a CA-08; plan §3.
  - **Hecha cuando:** la revisión encuentra todas las reglas requeridas y las comparaciones no detectan cambios fuera del alcance. Registrar los resultados en el apartado 4 de esta lista.

- [x] **T06 · Ejecutar la suite existente.**
  - Desde la carpeta de la aplicación, ejecutar `.\.venv\Scripts\python.exe -X utf8 -m pytest`.
  - Registrar quién ejecuta la comprobación, la fecha y el resultado exacto. Si falla, registrar el problema y resolverlo dentro del alcance antes de cerrar el bloque; cualquier cambio adicional requiere su definición y aprobación.
  - **Cubre:** comprobación de regresión del plan §3 y calidad §5 de la constitución; complementa CA-07, cuya conservación histórica se comprueba en T05.
  - **Hecha cuando:** la suite termina correctamente y su resultado actual consta en el apartado 4.

## 4. Cierre documental

- [x] **T07 · Actualizar el estado del manual tras las comprobaciones.**
  - Después de T05 y T06, actualizar únicamente la fila 002 de `AGENT.md` a implementada y comprobada, pendiente de conformidad final de la persona responsable.
  - **Cubre:** CA-04 y CA-06; plan §2.2.
  - **Hecha cuando:** la tabla distingue la implementación comprobada de la aprobación final y no altera el estado histórico de la spec 001.

- [x] **T08 · Registrar la implementación en la especificación.**
  - Después de las comprobaciones, actualizar el estado y el historial de `spec.md` con la implementación y la fecha real, dejando pendiente la conformidad final mientras no se haya recibido.
  - Mantener las fechas de aprobación de la spec y del plan ya registradas.
  - **Cubre:** trazabilidad de CA-03 y CA-08; plan §2.2, §3 y §5.
  - **Hecha cuando:** el documento refleja el trabajo realizado sin atribuir aprobaciones pendientes a la persona responsable ni a los compañeros.

### Resultados

| Comprobación | Estado | Evidencia |
| --- | --- | --- |
| Revisión documental de CA-01 a CA-08 | Comprobada por el agente, 2026-10-23 | Constitución §4, §7, §8 e historial; manual §2, §4, §5, §6 y §7. Los ocho criterios están presentes y son coherentes con la spec aprobada. |
| Spec 001 y archivos fuera de alcance conservados | Comprobados por el agente, 2026-10-23 | Los 27 archivos iniciales fuera de constitución y manual coinciden con `43631f7`. También se conservan los principios, calidad, seguridad, enmiendas anteriores, comandos y fila histórica de la spec 001. |
| UTF-8 y formato de los documentos | Comprobados por el agente, 2026-10-23 | Los cinco documentos se leen como UTF-8; sin espacios finales, con enlaces locales válidos y diff sin incidencias. |
| Suite existente | Comprobada por el agente, 2026-10-23 | Python 3.14.7, pytest 9.1.1: `77 passed in 1.26s` al ejecutar el comando de T06 fuera del aislamiento. El primer intento aislado falló al preparar temporales y comprobar el puerto local; la repetición completa pasó sin modificar el programa. |
| Conformidad final de la persona responsable | Recibida, 2026-10-23 | Aprobación expresa del resultado presentado y autorización del commit, push y actualización de la PR. Las pruebas automatizadas constan como ejecutadas por el agente. |
| Revisión de compañeros e incorporación a `staging` | Pendiente | Quedan pendientes y no impiden preparar el bloque siguiente. |

Los commits, el push y la actualización final de la PR se presentarán para su confirmación conforme al flujo del repositorio.

## 5. Historial

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-23 | Borrador de tareas | Desglosar el plan aprobado en cambios y comprobaciones verificables |
| 1.0 | 2026-10-23 | Tareas aprobadas | Aprobación expresa para comenzar la implementación |
| 1.1 | 2026-10-23 | T01 a T08 realizadas y comprobadas | Reglas actualizadas, alcance conservado y suite existente superada; conformidad final y revisiones pendientes |
| 1.2 | 2026-10-23 | Conformidad final recibida | Resultado aprobado y entrega autorizada; revisión de compañeros e incorporación a `staging` pendientes |
