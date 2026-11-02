# Plan técnico 006 · Manual del agente y documentos de referencia

> Estado: **Plan ejecutado; conformidad final recibida y entrega autorizada** · Fecha y aprobación: 2026-10-30
>
> [Especificación aprobada](spec.md). Diego aprobó después las tareas y autorizó la implementación en el chat el 2026-10-30.

## 1. Alcance y decisión

Separar la documentación por responsabilidad sin cambiar las reglas de trabajo ni el funcionamiento de AsistenciApp. El manual seguirá siendo el punto de entrada del agente; la constitución conservará la prioridad ante conflictos. No se necesita una enmienda.

La persona responsable aprobó este plan y, posteriormente, las tareas en el chat el 2026-10-30. Después de implementar y presentar las comprobaciones, dio su conformidad final y autorizó completar la entrega de esta tarea.

No se añaden agentes, skills, MCP, paquetes ni operaciones de Git. No se adopta el procedimiento de cinco momentos de otra copia.

## 2. Reparto de archivos durante la implementación

Todas las rutas de esta sección parten de `staff/diego-molero/asistenciapp/`.

| Archivo | Cambio previsto |
| --- | --- |
| `AGENTS.md` | Quitar la introducción redundante, el árbol, la tabla de comandos y las normas completas de escritura. Conservar el procedimiento, las aprobaciones, las reglas de comportamiento, la definición de terminado y el seguimiento. Añadir enlaces a las fuentes correspondientes. |
| `docs/TREE.md` · nuevo | Recibir el árbol que está en el manual, actualizado solo con los dos documentos nuevos. Mantener las carpetas reales `domain/`, `usecases/` y `storage/`, y la convención de nombres de las specs. |
| `docs/STYLE.md` · nuevo | Recibir íntegramente las obligaciones de escritura del apartado 8 del manual y el contenido equivalente de «Documentos y escritura» de arquitectura. |
| `docs/ARCHITECTURE.md` | Conservar responsabilidades, llamadas, contratos, datos y límites. Cambiar «Documentos y escritura» por enlaces a constitución, manual, árbol, estilo y README, con una frase que identifique cada responsabilidad. |
| `README.md` | Mantener las instrucciones y todos sus comandos. Añadir únicamente los enlaces de navegación a árbol y estilo junto a los documentos ya enlazados. |
| `tests/test_architecture.py` | Adaptar únicamente `test_documents_and_active_links` a los documentos nuevos. Mantener las demás pruebas y sus exigencias. |

Los archivos de seguimiento de esta spec se actualizarán solo en la fase autorizada que corresponda. Al implementar se podrá añadir al estado de `AGENTS.md` una fila de la spec 006 con el resultado real; no se cambiarán las afirmaciones históricas de las filas anteriores.

## 3. Manual como punto de entrada

La primera sección contendrá instrucciones, sin un párrafo que describa el propio documento. Indicará que se empieza por este manual y, a continuación, se consultan en orden:

1. `docs/CONSTITUTION.md`, con prioridad cuando haya un conflicto.
2. `docs/ARCHITECTURE.md`.
3. `docs/TREE.md`.
4. `docs/STYLE.md`.
5. La spec activa y su plan y tareas, si existen.

El README se enlazará como fuente de los comandos de preparación, activación, ejecución, pruebas y cierre. El manual conservará las obligaciones de comprobar el trabajo y cerrar los procesos iniciados, pero no copiará los comandos del README. El diagnóstico del puerto y la observación de que el proceso puede llamarse `Python` seguirán localizables allí.

El aviso de conflicto dirá qué hacer: identificar el pedido y la regla que contradice, explicar el problema y esperar una respuesta antes de modificar archivos. Una respuesta no se interpretará como enmienda implícita: cualquier cambio de constitución sigue su aprobación específica.

La regla de dependencias conservará la justificación en el plan y enlazará `docs/CONSTITUTION.md`, sin depender solo de la etiqueta «P3». Las referencias internas se actualizarán si cambia la numeración de secciones.

## 4. Conservación de obligaciones

Cada obligación tendrá una ubicación principal dentro del manual o el documento responsable. Las referencias entre documentos no reemplazan ni debilitan la constitución, que queda intacta.

| Obligación actual | Ubicación y conservación |
| --- | --- |
| Alcance de esta copia y autorización de enmiendas | Reglas iniciales de AGENTS, enlazando la constitución. Se mantiene el límite a la carpeta de Diego y la aprobación personal de cualquier enmienda. |
| Aclarar dudas, explicar el trabajo y hacer cambios pequeños | Reglas iniciales de AGENTS. Se conservan las preguntas y marcas `[NECESITA ACLARACIÓN]` y el resumen al terminar cada fase. |
| Spec antes de todo cambio y único archivo permitido al comenzar | Flujo de AGENTS. Incluye expresamente código, tests, README y documentación de uso; solo la nueva `spec.md` se escribe antes de su aprobación. |
| Aprobación expresa entre fases | Flujo de AGENTS: spec → aprobación → plan → aprobación → tareas → aprobación → implementación. La issue, rama o PR no sustituyen las aprobaciones. |
| Contenido de spec, plan y tareas | Subsecciones del flujo. Se mantienen el qué y porqué de la spec, sus criterios `CA-xx`, la comprobación de constitución del plan y la trazabilidad y verificabilidad de cada tarea. |
| Alcance aprobado y trabajo tarea a tarea | Subsección de implementación. Se mantiene marcar cada tarea al terminar, priorizar el test cuando sea posible y detenerse si faltan requisitos o aparecen errores en los documentos. |
| Pedidos fuera de alcance | Subsección de implementación. Exigen una spec nueva y sus aprobaciones, sin reutilizar una spec terminada como autorización. |
| Commits y pushes | Una regla en AGENTS: solo ante petición de la persona y confirmación del mensaje y los archivos conforme al flujo aplicable. Este cambio no crea un flujo nuevo ni autoriza una entrega. |
| Cierre de procesos | Una regla en AGENTS: detener lo que se arranque y comprobar que el puerto quede libre; enlace al cierre y diagnóstico del README. |
| Definición de terminado | AGENTS conserva tareas completas, pytest, criterios comprobados, documentación prevista y conformidad final de la persona responsable. |
| Normas de código | STYLE conserva resumen de módulo, una responsabilidad por función, tipos y docstrings de funciones públicas nuevas o modificadas con `:param nombre:`, `:return:`, `:rtype:` y `Usage::`; nombres claros y comentarios internos breves cuando explican decisiones o recursos. |
| Español y código anterior | STYLE conserva errores y textos de uso en español y la documentación de funciones conservadas no modificadas hasta que las afecte un cambio aprobado. Todos los archivos del cambio se guardan en UTF-8. |
| Seguimiento histórico | AGENTS conserva fechas, decisiones, verificaciones y estados anteriores. Las specs 001–005 no se reescriben ni se convierten sus entregas pendientes en entregas verificadas. |

## 5. Ajuste de la comprobación existente

`test_documents_and_active_links`, en `tests/test_architecture.py`, exige hoy que `:param`, `:return`, `:rtype` y `Usage::` aparezcan en AGENTS. Ese supuesto debe cambiar junto con la ubicación de las normas; no es un motivo para duplicarlas.

El ajuste será el siguiente:

- Mantener las comprobaciones de constitución y arquitectura en `docs/`, manual `AGENTS.md` y ausencia de los nombres antiguos de la raíz.
- Mantener los enlaces de README y manual a constitución y arquitectura, así como la versión 2.3 y las carpetas de la constitución.
- Comprobar que `docs/TREE.md` y `docs/STYLE.md` existen y leer el estilo como UTF-8.
- Comprobar los enlaces a `docs/TREE.md` y `docs/STYLE.md` desde manual y README. Leer arquitectura y verificar sus enlaces relativos `TREE.md` y `STYLE.md`.
- Cambiar exclusivamente el destino del bucle de marcadores: comprobar `:param`, `:return`, `:rtype` y `Usage::` en el texto de STYLE en lugar del texto del manual. El manual debe enlazar STYLE.

No se modifica `test_public_functions_have_types_and_usage`: seguirá inspeccionando funciones reales mediante AST, tipos de argumentos y retorno, parámetros documentados y ejemplos. Tampoco se modifican las fronteras de imports ni `test_existing_database_retains_data_and_workflow`.

No se crea una suite nueva que replique las frases o los encabezados del manual. La conservación del significado se comprueba mediante la matriz anterior y revisión del diff.

## 6. Verificación prevista y criterios de aceptación

| Criterio | Comprobación |
| --- | --- |
| CA-01 | Revisión manual de la primera sección: manual como entrada, lecturas enlazadas, prioridad de la constitución y ausencia de la introducción redundante. |
| CA-02 | Test documental adaptado para existencia y enlaces de TREE y STYLE; revisión manual de que el árbol y las reglas completas solo estén en su documento responsable. |
| CA-03 | Seguir desde AGENTS el enlace al README y revisar preparación, activación, arranque, pruebas y cierre. Comparar los bloques de comandos con la versión anterior para comprobar que no cambiaron ni siguen duplicados en AGENTS. |
| CA-04 | Comparar manual antes y después con las filas de aprobaciones, Git y alcance aprobado de la matriz; comprobar también la coherencia con la constitución intacta. |
| CA-05 | Revisión manual de todas las filas de conservación: ubicación principal identificable, alcance, dudas, comunicación y cierre de procesos, sin reglas opuestas o copias completas. |
| CA-06 | Revisión manual del aviso de conflicto y de los enlaces a las reglas: se identifica la contradicción y se espera antes de editar; no depende solo de un número de apartado. |
| CA-07 | Test documental con los cuatro marcadores en STYLE y ejecución intacta de `test_public_functions_have_types_and_usage`; revisión de todas las normas trasladadas, no solo de sus marcadores. |
| CA-08 | Test de ubicaciones y enlaces activos; recorrido manual de los enlaces nuevos y de sus destinos relativos; comparar TREE con las carpetas reales y leer estrictamente los archivos modificados como UTF-8. |
| CA-09 | Suite existente, incluida compatibilidad de base anterior y flujo de asistencia; revisión del diff para confirmar que código funcional, pantallas, datos y specs 001–005 no cambian y se conserva el seguimiento histórico. |

Los comandos siguientes se ejecutarán durante la implementación aprobada, desde `staff/diego-molero/asistenciapp/`, sin activar otro entorno:

```powershell
.\.venv\Scripts\python.exe -X utf8 -m pytest tests/test_architecture.py -q
.\.venv\Scripts\python.exe -X utf8 -m pytest -q
```

La existencia de `.venv/Scripts/python.exe` se ha comprobado por lectura al preparar el plan; no se ha ejecutado el intérprete ni se han comprobado sus dependencias. Si ese archivo deja de existir o no funciona, se localizará primero el intérprete del entorno de este proyecto con Python 3.13+ y Flask/pytest disponibles. Con ese entorno ya activado, la alternativa es `python -X utf8 -m pytest tests/test_architecture.py -q` y después `python -X utf8 -m pytest -q`. No se instalarán dependencias ni se usará otro entorno en silencio.

Para UTF-8 se leerán los archivos de documentación creados o modificados y el test con decodificación estricta (`encoding="utf-8", errors="strict"`). Se revisarán visualmente tildes y signos en español. Los enlaces locales se resolverán respecto a la carpeta de su documento; los que tengan fragmento se seguirán hasta el encabezado correspondiente. No hace falta una nueva herramienta ni una suite permanente para esa revisión.

La comparación de archivos se hará contra la versión anterior a la implementación, con Git en modo de lectura. Se comprobará expresamente que no hay diferencias en `app.py`, `asistencia/`, `static/`, datos, `requirements.txt`, `pytest.ini`, constitución ni `specs/001-*` a `specs/005-*`. De `tests/` solo puede cambiar la comprobación documental indicada. No se abre la base real ni se arranca un servidor para esta reorganización; las pruebas de datos existentes trabajan con sus archivos temporales.

Se registrarán comandos, resultado real, comprobaciones manuales y cualquier fallo. No se atribuye a esta fase una ejecución de pruebas ni una aprobación de los documentos futuros.

## 7. Comprobación de la constitución

| Regla | Cómo se cumple |
| --- | --- |
| P1 · Independencia de plataforma | No se cambia el registro ni se incorpora una integración. |
| P2 · Simplicidad | Se reutilizan documentos y una comprobación existente; solo se crean árbol y estilo, con una fuente principal por contenido. |
| P3 · Dependencias mínimas | No se añaden ni cambian paquetes. Se mantiene la obligación de justificar una dependencia futura en el plan. |
| P4 · Privacidad | No se accede a datos reales ni se cambia qué se guarda o transmite. |
| P5 · Accesibilidad | No cambian pantallas ni flujos de profesor o alumno. |
| P6 · Español | Documentación en español y UTF-8; se conservan los nombres técnicos y marcadores necesarios de los contratos. |
| §3 · Stack | Mismos runtime, capas, Flask, pytest y SQLite. TREE y STYLE viven en `docs/`, coherentes con la organización actual. |
| §4 · Aprobaciones | Spec aprobada antes del plan; se espera aprobación del plan antes de tareas y de las tareas antes de implementar. No se aprovecha esta reorganización para sustituir ese orden. |
| §5 · Calidad | Cada CA tiene una comprobación identificada. Se conserva la cobertura de funciones reales, fronteras, datos y asistencia y se ejecutará pytest al implementar. |
| §6 · Seguridad | Sin cambios de códigos, validación, duplicados, sesiones cerradas, permisos ni escape de entradas. |
| §7 · Alcance | Todos los cambios previstos permanecen en `staff/diego-molero/asistenciapp/`. |
| §8 · Enmiendas | No se modifica la constitución ni se altera un principio; no se necesita enmienda ni aumento de versión. |

## 8. Preguntas abiertas y salida de esta fase

No se ha encontrado una contradicción que requiera cambiar la constitución. La obligación de documentar funciones se conserva al mover su ubicación; la comprobación que exigía los marcadores en AGENTS se adapta de forma explícita.

El plan y las tareas quedaron aprobados por la persona responsable el 2026-10-30. La implementación está autorizada. En la preparación del plan no se ejecutaron pruebas ni se hizo commit, push, PR o merge.

## 9. Entrega autorizada

Diego dio su conformidad final y autorizó completar la entrega el 2026-10-30. La tarea está registrada en la [issue #655](https://github.com/venturars/neoland-102026/issues/655). La rama `codex/655-docs-simplify-asistenciapp-manual` parte de `staging` actualizado y contiene únicamente este cambio. Se guardarán los nueve archivos aprobados con el mensaje `docs(asistenciapp): simplifica el manual y separa sus guías`, se publicará la rama y se abrirá una PR contra `staging`. Las comprobaciones siguen siendo del agente; la conformidad final corresponde a Diego. La revisión de compañeros y el merge quedan pendientes.
