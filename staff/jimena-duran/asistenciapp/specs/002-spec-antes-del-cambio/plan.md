# Plan 002 · Spec antes de tocar la app

Responsable: Jimena Durán. Issue #237. PR #238.
Spec: aprobada. Plan: aprobado por Jimena Durán el 2026-10-22.

## 1. Alcance técnico

Cambio documental de las reglas de trabajo. Se conserva la arquitectura,
el modelo de datos, las rutas de la API y las dependencias existentes.
No se ejecuta ni modifica la demostración hack-etico.sh.

Archivos a modificar durante la implementación:
- CONSTITUTION.md: §4, §7, §8, versión y registro de enmiendas.
- AGENT.md: lectura inicial, flujo, reglas y tabla de estado.

Archivos de esta entrega SDD: specs/002-spec-antes-del-cambio/spec.md,
plan.md y, solo tras aprobar este plan, tasks.md.
Propuesta de comprobación automatizada: tests/test_sdd_rules.py, durante la
implementación y tras aprobar las tareas. No necesita nuevas dependencias.

## 2. Enmienda de CONSTITUTION.md

Subir versión 2.1 a 2.2 y registrar fecha, motivo y alcance de la enmienda.
No atribuir su aprobación a Jimena hasta obtener la aprobación del cambio.
Conservar literalmente las entradas históricas existentes.

§4 (CA-01–CA-05): exigir una spec aprobada que cubra cualquier cambio de
código, tests, README u otra documentación de uso. Sin ella, el único documento
nuevo de preparación es la spec; se presenta y se espera aprobación.
Después se prepara plan, luego tasks y finalmente implementación, con
aprobación de Jimena en cada puerta. Una petición no cubierta por la spec
activa abre otra spec. Issue, rama y PR no sustituyen estas aprobaciones.
El registro de aprobación en la propia spec forma parte de su ciclo SDD.

§7 y §8 (CA-06): usar staff/jimena-duran/asistenciapp/ como ámbito y a
Jimena Durán como aprobadora. La autorización de esta personalización ya
consta en la spec aprobada; las referencias heredadas no autorizan a editar
la carpeta de otra persona.

## 3. Ajustes de AGENT.md

CA-01–CA-05: hacer explícitas las mismas puertas en lectura inicial, flujo
SDD y reglas de implementación. Definir una nueva spec cuando la activa
no cubra el pedido. Mantener los enlaces actuales a CONSTITUTION.md.

CA-06: sustituir referencias operativas a otra persona por Jimena Durán y
la ruta de trabajo por staff/jimena-duran/asistenciapp/, incluida la cabecera
del apartado de comandos. Los comandos del entorno se mantienen tal cual:
su adaptación corresponde a la 003.

Registrar la 002 como activa; al finalizar, anotar sus comprobaciones reales.
Mantener el estado de la 001 como antecedente heredado sin cambiar sus
nombres, fechas ni cifras. El bot de Discord queda como idea futura sin número,
para no competir con la spec 002 real. No renombrar AGENT.md.

## 4. Verificación por criterio

Crear tests documentales antes de modificar las reglas y comprobar que fallan
con los documentos actuales por las condiciones nuevas, no por errores del test.
Después comprobar que pasan y ejecutar el conjunto pytest desde esta aplicación.
Los tests leen archivos relativos a su propia ubicación, no al directorio actual.

| Criterio | Comprobación prevista |
| --- | --- |
| CA-01 | Ambos documentos cubren código, tests y documentación de uso con spec aprobada. |
| CA-02 | Ambos indican preparar solo la spec y esperar antes del plan/tasks/cambio. |
| CA-03 | Ambos definen el orden y aprobación explícita en cada fase. |
| CA-04 | Ambos exigen nueva spec si la activa no cubre la petición. |
| CA-05 | Ambos declaran que Issue, rama y PR no sustituyen la spec aprobada. |
| CA-06 | Rutas y aprobadora operativas correctas; versión y enmienda coherentes. |
| CA-07 | Comparar byte a byte los tres archivos de la spec 001 contra la rama base. |

Las comprobaciones documentales verifican el contrato escrito; no prueban
que un agente futuro siempre lo obedezca. Complementar con lectura cruzada
de la spec, constitución y guía, y registrar los resultados reales.

## 5. Comprobación de la constitución

- P1: sin cambios en plataformas o integraciones.
- P2: reglas directas; sin automatizaciones ni abstracciones nuevas.
- P3: sin dependencias nuevas, solo pytest ya permitido.
- P4: sin cambios de datos ni almacenamiento.
- P5: sin cambios de interfaz o accesibilidad.
- P6: documentación y mensajes nuevos de pruebas en español.
- §5: CA-01–CA-07 cubiertos por comprobaciones automatizadas; ejecutar pytest.
- §6: sin cambios en códigos, sesiones, duplicados o validación de entradas.
- §7–§8: enmienda explícita limitada a la copia personal y aprobada por Jimena.

## 6. Git y límites

Trabajar en jimena-duran-221020263. PR #238 en draft y base
jimena-duran-221020262 mientras #232 no esté integrada. Revisar el diff contra
esa base: únicamente reglas y SDD/tests de la 002. Después de integrar #232,
cambiar la base a staging antes de integrar esta PR.

No modificar README, spec 001, runtime, interfaz, arquitectura ni ejercicios.
No incluir la base local de first-app. Commit, push y actualización de la PR
se realizarán cuando estén autorizados; la descripción reflejará los resultados.

## 7. Estado y contradicción heredada

Las reglas actuales nombran otra carpeta y otra persona; CA-06 de la spec
aprobada resuelve esa contradicción para esta copia personal. No se modifica
la constitución en esta fase: se propone la enmienda para la implementación.
No quedan decisiones técnicas abiertas. Plan aprobado; preparar las tareas antes
de preparar tasks.md, crear tests o modificar las reglas.
## Resultado local de implementación

Implementada la 002 tras aprobar spec, plan y tareas. Suite completa: 93 tests pasan.
Spec 001 intacta. Sin commit ni push; revisión humana final pendiente.
