# Plan técnico 004 · Documentación sin referencias personales heredadas

> Estado: **Autorizado anticipadamente** · Versión: 1.0 · Creado: 2026-10-23
>
> Spec: [spec.md](spec.md) · Issue #274 · PR [#275](https://github.com/venturars/neoland-102026/pull/275)

## 1. Cambios

- En el README, sustituir únicamente los dos `cd staff/victor-chang/asistenciapp` por `cd staff/<usuario>/asistenciapp` (CA-01, CA-04).
- En la spec 001, dejar las propuestas aceptadas el 2026-10-19 y el hecho de detectar registros de compañeros ausentes, quitando la atribución personal. El título del plan pasa a «Decisiones tomadas». En las cuatro notas de tareas, conservar 2026-10-20 y sus resultados (CA-02, CA-03).
- En el seguimiento de la spec 003, sustituir los nombres de cuentas de revisión por «las personas revisoras autorizadas». Las fechas, autorizaciones y resultados permanecen; las asignaciones reales se conservan en GitHub (CA-02, CA-03).
- Añadir tres comprobaciones en `tests/test_personal_references.py`: rutas genéricas, ausencia de `victor` en Markdown y conservación de las siete frases históricas esperadas. La búsqueda cubre la raíz, `specs/` y `docs/` si existe; excluye esta spec 004, que describe el nombre que se elimina, y los entornos instalados.
- Actualizar únicamente el seguimiento 004 en el manual del agente. Conservar el programa, la constitución 2.2 y los documentos 002 (CA-04).

## 2. Verificación

| Criterio | Evidencia |
| --- | --- |
| CA-01 | Los dos comandos de entrada del README son genéricos; el resto del README coincide con `37dce05`. |
| CA-02 | Test de búsqueda sobre Markdown fuera de esta spec. Las notas de seguimiento utilizan roles, sin sustituirlos por otra persona. |
| CA-03 | Test de las frases históricas y comparación de fechas y contenido con `37dce05`. |
| CA-04 | Diff limitado a las sustituciones, seguimiento, esta spec y su test; suite completa. |

Se verá fallar primero el test específico, se aplicarán las sustituciones y se ejecutará la suite completa. Se comprobarán UTF-8, formato y enlaces. Las comprobaciones del agente no se atribuirán a la persona responsable.

## 3. Comprobación de la constitución

P1 y P5: el registro y las pantallas permanecen. P2: sustituciones concretas y un archivo de pruebas. P3 y §3: mismas dependencias y stack. P4 y §6: mismos datos, privacidad y seguridad. P6: español y UTF-8. §4: spec, plan y tareas antes de implementar bajo autorización expresa. §5: cada criterio tiene su test o comparación. §7: solo esta carpeta. §8: no se enmienda la constitución.

La spec 002 conservó entonces el historial; esta spec posterior autoriza quitar atribuciones personales conservando sus hechos y fechas. La carpeta real del manual sigue identificando esta copia.

## 4. Entrega

Rama `274-docs-remove-inherited-personal-references`, destino `staging`, `Closes #274`, persona asignada `moolero12`. Comparación aislada desde `37dce05`.

Commit previsto: `docs(asistenciapp): remove inherited personal references`. Se actualizará la PR, se marcará lista y se pedirá revisión a las dos personas autorizadas. El merge queda pendiente.

La spec y este plan están autorizados anticipadamente. A continuación se redactan las tareas antes de modificar documentación o pruebas.
