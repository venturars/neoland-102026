# Tasks 002 · Spec antes de tocar la app

Responsable: Jimena Durán. Issue #237. PR #238.
Spec, plan y tareas aprobados por Jimena Durán el 2026-10-22.
Implementación completada y verificada localmente.

## Preparación

- [x] T01 Revisar estado de rama y obtener los hashes de la spec 001.
  Resultado: base verificable contra jimena-duran-221020262, sin tocar archivos ajenos.
  Cubre CA-07.

## Pruebas antes del cambio

- [x] T02 Crear tests/test_sdd_rules.py con comprobaciones de las puertas SDD.
  Resultado: cobertura documental de alcance, parada, orden, nueva spec y límites de Git.
  Cubre CA-01, CA-02, CA-03, CA-04 y CA-05.
- [x] T03 Añadir al mismo test las comprobaciones de ámbito, aprobadora y enmienda.
  Resultado: verifica la ruta personal, Jimena Durán y versión 2.2 coherente.
  Cubre CA-06.
- [x] T04 Añadir al mismo test la comparación de integridad de la spec 001.
  Resultado: sus tres archivos coinciden con los hashes base registrados en T01.
  Cubre CA-07.
- [x] T05 Ejecutar las nuevas comprobaciones antes de modificar las reglas.
  Resultado: fallan por las reglas heredadas; la integridad histórica pasa.
  Cubre CA-01 a CA-07.

## Implementación documental

- [x] T06 Actualizar §4 de CONSTITUTION.md con alcance y puertas de aprobación.
  Resultado: cualquier cambio exige spec aprobada; Git no sustituye el SDD.
  Cubre CA-01, CA-02, CA-03, CA-04 y CA-05.
- [x] T07 Actualizar §7–§8, versión y enmienda de CONSTITUTION.md.
  Resultado: carpeta de Jimena y aprobación personal, con historial previo intacto.
  Cubre CA-06 y CA-07.
- [x] T08 Actualizar lectura inicial y flujo de AGENT.md.
  Resultado: solo spec al empezar y aprobaciones de spec, plan y tareas antes de implementar.
  Cubre CA-01, CA-02, CA-03, CA-04 y CA-05.
- [x] T09 Actualizar referencias operativas y tabla de estado de AGENT.md.
  Resultado: ámbito y aprobadora correctos; 002 activa y bot futuro sin número.
  Cubre CA-06 y CA-07.

## Verificación y cierre local

- [x] T10 Ejecutar las nuevas pruebas y revisar ambas reglas contra la spec.
  Resultado: comprobaciones pasan y no hay instrucciones contradictorias.
  Cubre CA-01 a CA-07.
- [x] T11 Ejecutar pytest completo desde la aplicación y registrar el resultado real.
  Resultado: suite sin regresiones o fallos documentados para corregir antes de finalizar.
  Cubre CA-01 a CA-07 y constitución §5.
- [x] T12 Revisar el diff contra la rama de #232 y verificar la spec 001.
  Resultado: solo reglas, SDD y tests de la 002; originales y archivos ajenos intactos.
  Cubre CA-06 y CA-07.
- [x] T13 Actualizar estados y evidencias en el SDD y la tabla de AGENT.md.
  Resultado: documentación consistente con lo realmente implementado y verificado.
  Cubre CA-01 a CA-07.

No modificar README, comandos de entorno, runtime, interfaz ni arquitectura.
No hacer commit, push ni actualizar la PR sin autorización correspondiente.
## Evidencias de ejecución

- Python 3.14.7, Flask y pytest en .venv local ignorado.
- Antes del cambio: 13 fallos esperados de reglas heredadas y 3 comprobaciones de integridad correctas.
- Después: pytest completo, 93 passed en 4.32 s (77 existentes y 16 comprobaciones nuevas).
- Los tres SHA256 de la spec 001 coinciden con los valores anteriores al cambio.
- No se ejecutaron servidores ni túneles; no se hizo commit ni push.
