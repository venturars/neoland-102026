# Tareas 006 · Manual del agente y documentos de referencia

> Estado: **T01–T09 comprobadas; conformidad final recibida y entrega autorizada** · Fecha y aprobación: 2026-10-30
>
> [Spec aprobada](spec.md) · [Plan aprobado](plan.md). Diego aprobó estas tareas y autorizó su implementación en el chat el 2026-10-30.

Las casillas se marcan únicamente al comprobar el resultado real de cada tarea durante la implementación autorizada.

Las rutas parten de `staff/diego-molero/asistenciapp/`. Durante la implementación autorizada se ejecutará una tarea cada vez y se marcará `[x]` únicamente cuando su resultado se haya comprobado. Si el plan o la spec resultan incompletos o contradictorios, se detendrá el trabajo y se presentará la duda.

## Orden de implementación

- [x] **T01 · Adaptar la comprobación documental existente.** Archivo: `tests/test_architecture.py`, únicamente `test_documents_and_active_links`. Conservar sus comprobaciones actuales de ubicación, enlaces, constitución 2.3 y carpetas; añadir la existencia y los enlaces de `docs/TREE.md` y `docs/STYLE.md` desde manual, README y arquitectura. Leer STYLE en UTF-8 y trasladar a ese texto el bucle que busca `:param`, `:return`, `:rtype` y `Usage::`. Mantener intactos los tests de funciones reales, imports y compatibilidad de datos. Ejecutar la comprobación documental aislada para registrar el fallo esperado por los documentos o enlaces aún ausentes; no crear archivos para ocultar un fallo ajeno al cambio. **Resultado:** comprobación preparada antes de reorganizar los documentos y motivo real del fallo anotado. **CA-02, CA-07, CA-08.**

- [x] **T02 · Crear el árbol de esta copia.** Archivo nuevo: `docs/TREE.md`. Trasladar el árbol del manual y la convención de nombres de las specs; añadir TREE y STYLE al apartado `docs/`. Conservar las capas reales de Diego (`domain/`, `usecases/`, `storage/`) y comprobar las rutas contra el proyecto, sin copiar la estructura de otra persona. **Resultado:** documento de referencia de la estructura en español y UTF-8. **CA-02, CA-08.**

- [x] **T03 · Crear la guía de estilo completa.** Archivo nuevo: `docs/STYLE.md`. Trasladar las obligaciones de escritura del apartado 8 de AGENTS y el contenido equivalente de arquitectura: resumen de módulo, una responsabilidad por función, tipos, parámetros, resultado y ejemplo `Usage::` de funciones públicas nuevas o modificadas, nombres internos claros, comentarios breves explicativos, textos de uso y errores en español, y conservación de la documentación de funciones no modificadas. **Resultado:** una guía de estilo que conserva todas las exigencias actuales y sus marcadores. **CA-02, CA-07, CA-08.**

- [x] **T04 · Simplificar el manual conservando su control del trabajo.** Archivo: `AGENTS.md`. Empezar con instrucciones concretas y el orden de lectura del plan, manteniendo la prioridad de la constitución. Quitar la introducción redundante, el árbol completo, la tabla de comandos y las normas completas de estilo; enlazar sus destinos. Reunir cada regla de comportamiento en su ubicación principal. Conservar todas las obligaciones de la matriz del plan, incluidas aprobaciones entre fases, único archivo permitido al comenzar, alcance aprobado, dudas, comunicación, tareas pequeñas, autorización del mensaje y los archivos para commits/pushes, cierre de procesos, enmiendas y definición de terminado. Precisar la actuación ante contradicciones y enlazar la regla de dependencias sin depender solo de «P3». Actualizar las referencias internas que cambien de número. **Resultado:** manual sin copias completas de estructura, comandos o estilo y con las mismas autorizaciones y límites. **CA-01, CA-02, CA-03, CA-04, CA-05, CA-06, CA-07.**

- [x] **T05 · Completar la navegación entre documentos.** Archivos: `docs/ARCHITECTURE.md` y `README.md`. En arquitectura, sustituir la explicación duplicada del estilo por enlaces relativos a constitución, manual, árbol, estilo y README, identificando cada responsabilidad; conservar contratos, datos, llamadas y límites. En README, añadir solo los enlaces a TREE y STYLE junto a los existentes, conservando texto de uso y comandos. **Resultado:** cada contenido tiene su documento de referencia y puede localizarse desde los documentos de entrada. **CA-02, CA-03, CA-05, CA-06, CA-08.**

- [x] **T06 · Revisar enlaces, UTF-8 y conservación de reglas.** Archivos: los seis archivos de implementación previstos en el plan. Leerlos estrictamente como UTF-8 y revisar tildes y signos; seguir los enlaces nuevos y los que se hayan cambiado, resolviendo rutas desde cada documento y sus fragmentos cuando existan. Contrastar AGENTS y STYLE con cada fila de la matriz de obligaciones del plan, y los comandos del README con su versión anterior. Revisar la tabla de comprobaciones CA-01–CA-09 del plan: documentar el resultado de cada comprobación manual y dejar pendientes las automatizadas hasta T07. **Resultado:** fuentes principales, obligaciones y navegación revisadas sin crear una suite que replique frases del manual. **CA-01, CA-02, CA-03, CA-04, CA-05, CA-06, CA-07, CA-08.**

- [x] **T07 · Ejecutar la arquitectura y la suite existentes.** Desde la carpeta de la aplicación, ejecutar primero `.\.venv\Scripts\python.exe -X utf8 -m pytest tests/test_architecture.py -q` y, si pasa, `.\.venv\Scripts\python.exe -X utf8 -m pytest -q`. Aplicar la alternativa de intérprete del plan solo después de comprobar el entorno del proyecto, sin instalar paquetes ni cambiar de entorno en silencio. Registrar los resultados reales; mantener la comprobación de tipos y docstrings de funciones y la compatibilidad de la base anterior. Ante un fallo, informar y corregir únicamente lo cubierto por el alcance aprobado antes de repetir la comprobación afectada. **Resultado:** comprobaciones documentales y regresión verificadas por el agente, con salida y número real de pruebas. **CA-02, CA-07, CA-08, CA-09.**

- [x] **T08 · Comprobar exclusiones e historial.** Revisar el diff contra la versión anterior a implementar, con Git en modo de lectura. Confirmar que no cambian `app.py`, `asistencia/`, `static/`, datos, dependencias, `pytest.ini`, constitución ni specs 001–005. En `tests/` solo puede cambiar la comprobación documental acordada. Comparar también las filas históricas del estado de AGENTS: conservar fechas, decisiones y afirmaciones de verificaciones o entregas anteriores. **Resultado:** alcance documental confirmado y CA-09 cerrado con el resultado de T07 y la comparación de archivos. **CA-04, CA-05, CA-09.**

- [x] **T09 · Registrar y presentar el resultado factual.** Archivos de seguimiento: esta spec y sus tareas; añadir la fila de la spec 006 en AGENTS como permite el plan. Registrar qué se implementó, comandos y resultados realmente obtenidos, comprobaciones manuales y cobertura CA-01–CA-09. Conservar la diferencia entre comprobaciones del agente y conformidad de la persona responsable: no declarar aprobación final de Diego ni comprobaciones realizadas por él. Confirmar que no quedan procesos iniciados por el cambio; esta reorganización no requiere arrancar servidor ni túnel. Presentar los archivos afectados y esperar conformidad final. **Resultado:** entrega revisable del cambio, sin commit, push, PR ni merge. **CA-01 a CA-09.**

## Comprobación aislada de T01

Este comando se ejecutará solo al implementar las tareas aprobadas, desde la carpeta de la aplicación:

```powershell
.\.venv\Scripts\python.exe -X utf8 -m pytest tests/test_architecture.py::test_documents_and_active_links -q
```

El fallo temporal debe deberse a las ubicaciones o enlaces previstos que todavía no existen. Los documentos se crearán en T02–T05; la comprobación debe pasar después de esos cambios, junto al resto de arquitectura y la suite en T07. No se considera terminado el cambio mientras permanezca ese fallo.

## Aprobación y siguiente paso

La aprobación de la spec y del plan permitió redactar estas tareas. Diego aprobó su ejecución el 2026-10-30 y, después de revisar el resultado presentado, dio su conformidad final y autorizó completar la entrega. No se marca una casilla por haberla descrito aquí.

## Resultados de implementación · agente · 2026-10-30

Las comprobaciones siguientes las ejecutó el agente. No se atribuyen a Diego ni sustituyen su conformidad final.

| Paso y comando desde la carpeta de la app | Resultado real |
| --- | --- |
| T01: `.\.venv\Scripts\python.exe -X utf8 -m pytest tests/test_architecture.py::test_documents_and_active_links -q` | `1 failed in 0.22s`. Fallo esperado en `tests/test_architecture.py:31`: todavía no existía `docs/TREE.md`. |
| T07, primer intento: `.\.venv\Scripts\python.exe -X utf8 -m pytest tests/test_architecture.py -q` | `12 passed, 1 error in 0.47s`. El entorno no permitió crear el directorio numerado de pytest en el temporal del sandbox; no falló una regla de la aplicación. |
| T07, temporal local: `.\.venv\Scripts\python.exe -X utf8 -m pytest tests/test_architecture.py -q --basetemp .venv/pytest-spec006-architecture-20261030` | `13 passed in 0.10s`. |
| T07, suite con temporal local: `.\.venv\Scripts\python.exe -X utf8 -m pytest -q --basetemp .venv/pytest-spec006-suite-20261030` | `1 failed, 92 passed in 1.41s`. Único fallo: `test_detects_listening_port_and_free_port`; diagnóstico independiente de conexión a loopback: `errno=10013`, acceso denegado por el sandbox. |
| T07, suite con acceso local permitido: `.\.venv\Scripts\python.exe -X utf8 -m pytest -q --basetemp .venv/pytest-spec006-suite-localhost-20261030` | `93 passed in 1.42s`. Ejecutada fuera del sandbox para permitir la conexión de prueba a `127.0.0.1`, sin cambiar paquetes, código funcional ni pruebas de puertos. |

Los tres directorios temporales se resolvieron bajo `.venv/` de esta copia y se comprobó que no existían antes de pasarlos a pytest. No se reutilizaron rutas con archivos anteriores ni se modificó la configuración del proyecto para sortear las restricciones.

| Criterio | Evidencia y resultado |
| --- | --- |
| CA-01 | Revisión del manual: primera sección operativa, entrada por AGENTS, lecturas posteriores y prioridad explícita de la constitución; introducción redundante retirada. |
| CA-02 | TREE y STYLE son los destinos del árbol y las normas completas; enlaces verificados desde el manual. La comprobación documental adaptada pasa dentro de arquitectura y suite. |
| CA-03 | El manual enlaza al README y conserva la obligación de comprobar y cerrar procesos. Comparación del README con `1b243cca`: solo cambia la navegación; comandos y texto de uso idénticos. |
| CA-04 | El flujo completo del manual coincide con el anterior salvo la referencia enlazada de dependencias; se conservan aprobaciones expresas y la autorización de mensajes y archivos para commits/pushes. |
| CA-05 | Revisadas todas las filas de la matriz de obligaciones del plan. Se conservan alcance, dudas, comunicación, cambios pequeños, cierre de procesos, enmiendas, trabajo por tareas y definición de terminado, cada uno con ubicación principal. |
| CA-06 | El aviso identifica pedido y regla en conflicto, impide editar antes de la respuesta y no interpreta esa respuesta como enmienda implícita. Las referencias permiten localizar constitución, estilo y uso. |
| CA-07 | Las normas completas están en STYLE. El test documental verifica allí los cuatro marcadores y el análisis AST de funciones reales permanece intacto; arquitectura y suite pasan. |
| CA-08 | Lectura estricta UTF-8 de los seis archivos de implementación, revisión del español, 20 enlaces locales y fragmentos resueltos y 21 rutas del árbol existentes en esta copia. |
| CA-09 | Suite completa: 93 pruebas superadas. Comparación con `1b243cca`: exclusiones versionadas sin diferencias, filas históricas del manual conservadas y AST de tests idéntico excepto `test_documents_and_active_links`. No se ejecutaron comandos sobre los datos reales; las pruebas de persistencia usan sus archivos temporales. |

`git diff --check` no informó problemas de espacios. Los seis archivos de implementación son `AGENTS.md`, `README.md`, `docs/ARCHITECTURE.md`, `docs/TREE.md`, `docs/STYLE.md` y `tests/test_architecture.py`; el seguimiento queda en los tres documentos de esta spec. No se alteraron constitución, specs 001–005, pantallas, código funcional, dependencias ni otras carpetas.

No se arrancaron la aplicación ni el túnel. El diagnóstico temporal de loopback cerró ambos sockets al terminar y los procesos de pruebas finalizaron. Al terminar la implementación todavía no se había hecho commit, push, issue, PR ni merge. Después, Diego dio su conformidad final y autorizó la entrega: se creó la [issue #655](https://github.com/venturars/neoland-102026/issues/655) y se preparó la rama `codex/655-docs-simplify-asistenciapp-manual` desde `staging` actualizado. Se publicarán los nueve archivos aprobados y se abrirá una PR contra `staging`; la revisión de compañeros y el merge siguen pendientes.
