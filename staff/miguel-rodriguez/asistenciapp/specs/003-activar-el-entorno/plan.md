# Plan 003 · Separar la activación del entorno del arranque

Estado: aprobado por Miguel el 2026-10-22.

Referencias: [spec aprobada](spec.md), [constitución 2.3](../../CONSTITUTION.md), [manual del agente](../../AGENT.md), [issue #223](https://github.com/venturars/neoland-102026/issues/223) y [PR #224](https://github.com/venturars/neoland-102026/pull/224).

## Cambio previsto

Modificar únicamente el contenido de `README.md` descrito por la spec. Durante la implementación, registrar el estado de 003 en la tabla del manual y los resultados en sus documentos SDD. No cambiar reglas, constitución, código, pruebas, datos, requisitos ni configuración.

- **CA-01:** renombrar la sección 2 a «Activar el entorno». Conservar debajo la frase de cada terminal nueva y su bloque de comandos.
- **CA-02:** insertar «3. Arrancar la app» antes de la tabla de ejecución, separada de la sección anterior con el mismo formato del README. Conservar la tabla y las explicaciones del panel, enlace privado y disponibilidad bajo este título.
- **CA-03:** renumerar las secciones posteriores: Pasar lista 4, Cerrar la app 5, Problemas frecuentes 6, Tests 7 y Privacidad 8. Cambiar únicamente la remisión «ciérrala (sección 4)» a «ciérrala (sección 5)».
- **CA-04:** conservar literalmente comandos, rutas, tablas y demás explicaciones, salvo la referencia «ciérrala (sección 4)» → «ciérrala (sección 5)» dentro de la tabla de problemas frecuentes, prevista en CA-03. Las rutas personales se corregirán en 004.

No hay cambios de arquitectura, modelo de datos, interfaces ni dependencias. Git y publicaciones los ejecuta Miguel; esta PR conserva solo el paso 003 y su dependencia de #220 hasta que pueda dirigirse a staging.

## Verificación

Antes de editar, guardar fuera del proyecto una copia del README y un inventario SHA-256 del código, estáticos, pruebas, requisitos, configuración, datos existentes y documentos 001–002. Excluir `.venv` y artefactos locales de ejecución. No crear una base de datos de trabajo.

| Criterio | Procedimiento y evidencia a registrar en tasks.md |
| --- | --- |
| CA-01 | Leer las secciones contiguas: el bloque de cada terminal nueva queda bajo «2. Activar el entorno», antes de arrancar. Registrar títulos y ubicación observados. |
| CA-02 | Revisar el contenido delimitado por «3. Arrancar la app» y el siguiente título: contiene las dos opciones y sus explicaciones, sin el bloque de activación. Registrar el resultado. |
| CA-03 | Comprobar títulos consecutivos del 1 al 8 y remisión del puerto ocupado a «sección 5», cuyo título es «Cerrar la app». Registrar ambas comprobaciones. |
| CA-04 | Comparar con la captura previa: al revertir exclusivamente los cambios previstos de títulos, separador y remisión, el README debe coincidir byte a byte. Comparar también todos los bloques de comandos y el inventario protegido. Registrar resultados y revisar el diff completo. |

Usar comprobaciones temporales con la biblioteca estándar y lectura documental, sin añadir tests persistentes. Las comprobaciones verifican organización y conservación del texto; no prueban el comportamiento de un agente.

Ejecutar una vez la suite existente en una copia desechable con el intérprete del `.venv` local autorizado, sin instalar nada, arrancar la app ni abrir un túnel. Conservar `.venv`, eliminar copias y capturas temporales, y registrar comandos, versiones, resultados y bloqueos reales. No presentar las pruebas anteriores de 002 como una ejecución de 003.

## Comprobación de la constitución

- **P1–P2:** organización de instrucciones existente; sin integraciones ni mecanismos nuevos.
- **P3 y §3:** stack y requisitos intactos; biblioteca estándar para comprobaciones y entorno local existente para pytest.
- **P4:** datos preservados; pruebas con bases temporales en la copia desechable.
- **P5:** interfaz sin cambios.
- **P6:** documentos en español.
- **§4:** spec aprobada; este plan y las tareas requieren aprobaciones separadas antes de implementar.
- **§5:** verificación documental con evidencia por criterio, permitida por 2.3; la suite existente debe pasar.
- **§6:** seguridad y funcionamiento intactos.
- **§7–§8:** cambios solo en esta copia; no se propone otra enmienda.

## Conflictos y decisiones pendientes

Ninguno identificado. Las rutas personales heredadas se conservan deliberadamente por el alcance aprobado. Si la verificación encuentra un impedimento, se registra y se detiene el trabajo afectado sin ampliar el cambio.

Implementación verificada el 2026-10-22; resultados en [tasks.md](tasks.md). Revisión final aprobada por Miguel el 2026-10-22.
