# Tareas 009 · Presentación de carrera y celebración final

Estado: revisadas y aprobadas bajo autorización expresa de Miguel el 2026-10-26. Implementación local realizada; comprobaciones y revisión documentadas; publicada en PR #356; aceptación visual de Miguel y revisión de compañeros pendientes. [Spec aprobada](spec.md), [plan aprobado](plan.md), [issue #332](https://github.com/venturars/neoland-102026/issues/332). Las casillas reflejan ejecución local; T41 y T44 conservan las revisiones humanas pendientes; T42 y T43 se completaron según el cierre del 26 de octubre.

## Reglas de ejecución

- Aprobar estas tareas autoriza implementar y verificar 009 en su copia local separada. La publicación sigue condicionada a la base y al momento Git autorizado; no se presenta una aprobación de documentos como permiso de merge o de omitir revisiones.
- Una tarea cada vez; marcar [x] solo con resultado comprobado y evidencia. Pruebas de comportamiento antes del código cuando sea posible. El diseño se revisa sobre la app real, no se da por implementado al abrir el Markdown.
- Copia de trabajo: `009-local-implementation/asistenciapp`, sobre la versión 007 probada por Miguel. Conservar la copia de referencia y los manifiestos; bases de ensayo ficticias. No copiar accesos ni la base manual de la prueba de Miguel.
- No modificar Python, API, tablas, privacidad, presupuestos, permisos, dependencias, documentos de specs anteriores ni ejercicios de Halloween. Si hace falta cambiar el contrato, revisar el plan antes del código afectado.
- Fases del servidor intactas. El único recorrido de los karts empieza tras los cinco segundos de anticipación. Los puestos se confirman inmediatamente, sin esperar esa celebración.
- Funciones nuevas/modificadas con responsabilidad, tipos, parámetros, resultado y ejemplo Usage según AGENTS.md. Conservar las etiquetas accesibles y los errores necesarios al recortar texto.

## Base y pruebas iniciales

- [x] T01 · **Referencia de la copia.** Contrastar spec, plan, AGENTS y constitución; registrar fecha, versiones, hashes de archivos protegidos y originales de Halloween. Ejecutar pytest sobre la copia antes de cambiar producto y conservar su salida real; no repetir 226 como resultado supuesto. Capturar aspecto y textos actuales en panel, alumno y presentación con datos ficticios. Cubre CA-01–CA-14.

- [x] T02 · **Comprobar publicación separada.** Verificar estado real de #332 y si ya tiene PR, así como integración de 007/008 en staging. Registrar rama prevista 332-feat-refine-race-presentation, título de la issue, assignee mglnglxx, Closes #332 y destino staging. Si la base todavía falta, mantener pendiente publicación y continuar únicamente la implementación local autorizada por estas tareas. No crear PR acumulada ni cambiar de base después. Esta tarea no ejecuta Git por redactarla o aprobarla. Cubre CA-13.

- [x] T03 · **Pruebas puras primero.** Crear tests/browser/test-race-finale.mjs antes del módulo: límites 0/1999/2000/2999/3000/3999/4000/4999/5000/12999/13000 ms, un finalista a 8000 ms y varios con duraciones crecientes entre 5800 y 8000 ms. Registrar el fallo por ausencia de la función/módulo, sin depender de esperas reales ni del reloj del servidor. Cubre CA-06, CA-07, CA-09.

- [x] T04 · **Cálculo decorativo puro.** Crear static/race-finale.js con el tramo según tiempo transcurrido y duración por puesto. Recibir datos explícitos, sin DOM, fetch, reloj global o persistencia. Verificar green de T03, nombres y tipos documentados; no derivar ganadores de estos cálculos. Cubre CA-05–CA-07, CA-09, CA-13.

- [x] T05 · **Ensayo de comportamiento previo.** Preparar tests/browser/race-finale-review.js para una carrera real ficticia con varios participantes: primer registro confirma puesto pero no mueve kart, cierre muestra ganador, no hay recorrido antes de 5000 ms y podio solo al completar el final. El reloj visual se controla sin alterar el reloj o resultados del backend. Ejecutar contra la versión previa y registrar el fallo observable esperado; no sustituir el ensayo por buscar texto en archivos. Cubre CA-05–CA-07, CA-14.

## Tema, pantallas e integración

- [x] T06 · **Tema compartido.** Crear static/race-theme.css con ámbito race-ui: superficies claras, texto oscuro, acento naranja con texto contrastado, fuentes del sistema, enlaces, foco y controles cómodos. Mantener separado el tema de la disposición y no introducir recursos remotos. Medir contraste real de combinaciones elegidas. Cubre CA-01, CA-02, CA-11.

- [x] T07 · **Panel del profesor.** Modificar static/profesor.html para cargar el tema después de su hoja existente y usar su ámbito. Recortar introducciones o etiquetas duplicadas conservando creación de clase, casilla de carrera y operaciones actuales. Conservar IDs y comprobar que el formulario normal sigue legible y utilizable. Cubre CA-01–CA-03, CA-11, CA-13.

- [x] T08 · **Pantalla del alumno.** Modificar static/race.html: aplicar tema, eliminar eslóganes/repeticiones y conservar label, selector, espera, código, oportunidades, confirmación y errores. Mantener regiones de estado y los mismos controles de envío/reintento. Cubre CA-01–CA-03, CA-05, CA-11.

- [x] T09 · **Mensajes del alumno.** Acortar solo mensajes redundantes en static/race.js; conservar las distinciones entre confirmación, envío incierto, sin intentos, retirada, cierre y pérdida de acceso. No cambiar sesión/cookie, UUID/cuerpo del reintento, peticiones o su serialización. Cubre CA-02, CA-03, CA-05, CA-11, CA-13.

- [x] T10 · **Estructura del profesor.** Modificar static/race-display.html con encabezado compacto y elementos de ganador/número/escena final, conservando QR/enlace, navegación, cierre/retirada confirmados y exportación. Eliminar héroes, adornos y explicaciones repetidas. No crear otra lista ejecutable de alumnos ni un diálogo modal con captura de foco. Cubre CA-01–CA-03, CA-06–CA-08, CA-11, CA-14.

- [x] T11 · **Controlador de la celebración.** Integrar en static/race-display.js una ejecución decorativa por cierre observado: instante inicial único, firma de resultados, identificador de ejecución y tramo por tiempo transcurrido. Primer estado cerrado muestra directamente podio. Polling posterior no reinicia la cuenta; anuncio 2 s + números 3 s + recorrido 8 s. Conservar el único bucle de red y espera de acciones. No usar finalización de animaciones para decidir el resultado o el plazo del podio. Cubre CA-05–CA-09, CA-13.

- [x] T12 · **Recorrido por plaza.** Modificar static/race-renderer.js para localizar cada kart por clave de plaza, no por texto de puesto. Animar transform desde el origen hasta la meta útil y conservar duraciones crecientes por posición. Recibir el progreso ya transcurrido al reanudar y cancelar por ejecución; no empezar con un desplazamiento negativo ni decidir posiciones de asistencia. Cubre CA-04–CA-07, CA-09, CA-10.

- [x] T13 · **Pista y escena visible.** Modificar static/race.css: quitar el avance por state-registrado tanto en reglas generales como móviles, mantener el kart en origen y aplicar el modo final del plan. Reservar espacio para ganador/números, hasta quince filas, meta y navegación en 1366 × 768; clasificación extensa fuera de esa escena. Mantener versión móvil/ampliada legible, sin forzar quince filas pequeñas. Cubre CA-01, CA-03–CA-07, CA-11, CA-14.

- [x] T14 · **Recuperación visual y limpieza.** Completar en race-display.js ocultación/reanudación, recarga, cambio de tamaño, pérdida de autorización, salida de página y cambio a movimiento reducido. Consultar resultado actual antes de reanudar; mantener el mismo instante inicial y ajustar progreso sin un recorrido nuevo. Cancelar invalida callbacks viejos. Ningún timer o animación sobrevive a su ejecución activa. Cubre CA-06, CA-09–CA-11, CA-13.

- [x] T15 · **Corrección de resultados.** Completar en race-display.js la cancelación al cambiar la firma de asistencias durante ganador/cuenta/llegada. Mostrar directamente clasificación/podio actualizados y no reanudar la celebración cancelada. Diferenciar un cambio real de checkins de un cambio de serverNow/tiempo de consulta. Cubre CA-07, CA-09, CA-10, CA-13.

- [x] T16 · **Foco y anuncios.** Revisar los cambios de escena: foco inicial una vez, números sin robarlo o repetirse por polling en aria-live, foco del podio una vez. Asegurar visibilidad de escena sin desplazamiento manual, además de su disposición real. Movimiento reducido omite los cinco segundos y el recorrido; mantener controles y clasificación accesibles. Cubre CA-02, CA-06, CA-09, CA-11, CA-14.

## Quince dibujos: uno por tarea

Para cada activo, contrastar la imagen de referencia y los rasgos acreditados en docs/RACE-ASSETS.md. Simplificar primero la carrocería y piezas diminutas; conservar dos rasgos reconocibles del personaje y el mismo slug. Ver el resultado alrededor de 54 × 36, a mayor tamaño y en grises. No declarar terminado un activo solo por ser XML válido. Todas estas tareas cubren CA-04, CA-11 y CA-13.

- [x] T17 · **Node Jack.** Simplificar static/race-characters/node-jack.svg: cabeza/pantalla de calabaza y sombrero distinguibles, kart de pocas formas.
- [x] T18 · **Espantatorres.** Simplificar static/race-characters/espantatorres.svg: capucha/cara calavérica y fuego legibles.
- [x] T19 · **Mr. Wobble.** Simplificar static/race-characters/mr-wobble.svg: cabeza grande/sonrisa y pajarita roja distinguibles.
- [x] T20 · **Lobo de Esther.** Simplificar static/race-characters/hombre-lobo-esther.svg: silueta de lobo y cicatriz, diferenciándolo de Vicwolf.
- [x] T21 · **Ajolote.** Simplificar static/race-characters/ajolote.svg: branquias y sombrero/catrina legibles sin pequeños adornos innecesarios.
- [x] T22 · **Jack.** Simplificar static/race-characters/jack.svg: máscara/sonrisa y lengua reconocibles.
- [x] T23 · **Vampire King Leo.** Simplificar static/race-characters/vampire-king-leo.svg: capa de cuello alto y colmillos/ojos distinguibles.
- [x] T24 · **Fantasmiko.** Simplificar static/race-characters/fantasmiko.svg: silueta de paleta/payaso y nariz/sombrero reconocibles.
- [x] T25 · **Mimo.** Simplificar static/race-characters/mimo.svg: gato y sombrero de bruja/estrella distinguibles.
- [x] T26 · **Fantasma.** Simplificar static/race-characters/fantasma.svg: sábana/silueta de fantasma y gafas de estrella o calabaza reconocibles.
- [x] T27 · **Yomi.** Simplificar static/race-characters/yomi.svg: capucha y rostro/ropa de retales reconocibles sin detalles diminutos.
- [x] T28 · **Calabaza.** Simplificar static/race-characters/calabaza-aterradora.svg: cabeza de calabaza y cuello de ramas/cuervo reconocibles.
- [x] T29 · **Harry Universe.** Simplificar static/race-characters/harry-universe.svg: silueta de mago y varita/bufanda reconocibles.
- [x] T30 · **Edgar Allan Poe.** Simplificar static/race-characters/edgar-allan-poe.svg: pelo/bigote y cuervo reconocibles.
- [x] T31 · **Vicwolf.** Simplificar static/race-characters/vicwolf.svg: silueta de lobo y sudadera, distinto del lobo de Esther.

## Ensayos y revisión del resultado

- [x] T32 · **Galería y referencias finales.** Revisar juntos los quince dibujos al tamaño de pista y en grises, comprobar dos rasgos por piloto y actualizar docs/RACE-ASSETS.md según los activos realmente producidos. Validar SVG sin script, eventos o recursos remotos y comprobar hashes de los originales intactos. Si algún piloto no se distingue, corregirlo antes de cerrar su tarea individual. Cubre CA-04, CA-11, CA-13.

- [x] T33 · **Secuencia completa y variantes.** Ejecutar el ensayo de T05 sobre la app implementada y ampliarlo a cierres automáticos/manuales con cero/uno/dos/tres y quince finalistas. Cancelar cierre conserva open; cero no celebra; los demás muestran ganador, 3–2–1, recorrido y podio. Registrar límites temporales y comparación con puestos/horas reales. Cubre CA-05–CA-08, CA-13, CA-14.

- [x] T34 · **Interrupciones y correcciones.** Probar recarga y nueva ventana durante cada tramo, pestaña oculta dentro y fuera de los trece segundos, resize durante la llegada, error de consulta, respuesta 401 y salida/retorno de página, retirada del ganador y de otro finalista durante los tres tramos. Activar movimiento reducido a mitad. Verificar que no hay reinicios, esperas añadidas, callbacks obsoletos, foco repetido ni resultados inventados. Cubre CA-06, CA-07, CA-09–CA-11, CA-13.

- [x] T35 · **Pantalla compartida y móvil.** Con quince finalistas, comprobar rectángulos de ganador/números, quince filas, karts y meta dentro de 1366 × 768 al 100 %, partiendo de un scroll previo del lobby. Comprobar podio visible al acabar y clasificación completa disponible. Repetir flujo de alumno y controles a unos 400 px, teclado, zoom 200 % y movimiento reducido; medir contraste real. Guardar capturas de cada tramo sin datos secretos. Cubre CA-01–CA-04, CA-06, CA-07, CA-11, CA-14.

- [x] T36 · **Regresión de la app.** Ejecutar pytest completo, pruebas puras Node y análisis de sintaxis JS. Repetir los ensayos existentes de recuperación y serialización de acciones de 007; adaptar únicamente esperas/selectores afectados por el cambio aprobado, sin retirar verificaciones de acceso, UUID, resultados o intentos. Probar en navegador el panel normal, registro normal y exportación tras cargar el tema. Comparar hashes de Python, dependencias y specs históricas. Registrar comandos, versiones, fallos y correcciones de causa. Cubre CA-01, CA-03, CA-05, CA-09, CA-10, CA-13.

## Documentación y entrega

- [x] T37 · **Manual de uso.** Actualizar README.md con el nuevo cierre y la distinción entre salida inicial y cuenta final; confirmación inmediata, opción de movimiento reducido y recuperación de cerrado. Mantener el arranque por túnel del profesor y no presentar la app como alojada permanentemente. Cubre CA-02, CA-05–CA-09, CA-11, CA-13.

- [x] T38 · **Arquitectura de presentación.** Actualizar docs/ARCHITECTURE.md con cálculo puro de fases, controlador visual, cancelación por ejecución y ausencia de nuevos estados del backend. Documentar reloj local de celebración, tema compartido y representación por plaza. Cubre CA-05–CA-07, CA-09, CA-10, CA-13.

- [x] T39 · **Instrucciones de trabajo.** Añadir en AGENTS.md las dos preferencias adoptadas por Miguel: eliminar eslóganes/ayudas/rótulos redundantes resolviendo la comprensión con la disposición; elegir soluciones que mejoren UX, DX y AX sin romper el comportamiento. Mantener etiquetas/errores necesarios y el orden de aprobaciones. Actualizar el estado real de 009 sin atribuir pruebas o aprobación del resultado a Miguel. Cubre CA-02, CA-12, CA-13.

- [x] T40 · **Revisión final y evidencia.** Registrar evidencia por los catorce criterios, capturas de las tres vistas y todos los tramos, resultados de tests y comparación con la base. Revisar conjuntamente código, spec, plan, tareas, manual y constitución. No confundir comprobaciones del agente con prueba por Miguel. Cubre CA-01–CA-14.

- [ ] T41 · **Demostración real en navegador.** Abrir la app implementada de 009 con datos ficticios para Miguel y permitirle comprobar diseño, karts y final; no abrir la spec como sustituto de la demo. Mostrar qué versión está sirviendo. Registrar su respuesta real y corregir fallos antes de dar el resultado por aceptado. Si prueba el QR en móvil, usar el modo HTTPS/origen ya existente, no debilitar acceso para facilitarlo. Cubre CA-01–CA-14.

- [x] T42 · **Cerrar servicios y conservar trabajo.** Al terminar los ensayos, detener únicamente servidores y túneles propios, comprobar sus puertos libres y borrar bases/credenciales temporales de prueba. Conservar el código de 009 hasta que esté guardado y publicado: no borrar la única implementación. Si Miguel pide mantener la demo abierta mientras prueba, registrar ese estado y cerrarla al acabar. Cubre CA-09, CA-13.

- [x] T43 · **Publicar cuando exista base exclusiva.** Repetir T02 contra staging actual. Con el momento Git autorizado, usar la rama/PR existente si ya existe; si no, seguir el proceso de apertura draft del repositorio. Guardar cambios en commits pequeños por documentos, tema/vistas, celebración, activos y verificación. Título de #332, assignee mglnglxx, Closes #332 y Development comprobados; diff exclusivo de 009, sin datos de ensayo. No publicar acumulando 007/008 ni cambiar base para recortarlo después. Si falta la base o la autorización, mantener pendiente esta tarea e informar. Cubre CA-01–CA-14.

- [ ] T44 · **Revisión de compañeros e integración.** Aplicar la autorización vigente de Miguel para solicitar revisión; comprobar revisores con acceso —incluidos los solicitados Meghan, Jimena y Sergio— y usar su lista vigente, sin pedir otra vez un permiso ya concedido. Pasar de draft según el flujo autorizado. No mergear sin dos aprobaciones posteriores al último push y autorización del momento; destino staging mediante merge commit. Comprobar el estado de #332 después de integrar; no asumir cierre automático por Closes si staging no es la rama por defecto. Tramitar su cierre según la autorización vigente y registrar el resultado real. Cubre CA-13.

## Matriz de cobertura

| CA | Tareas que lo verifican |
| --- | --- |
| 01 | T01, T06–T08, T10, T13, T35, T36, T40–T41 |
| 02 | T06–T10, T16, T35, T37, T39–T41 |
| 03 | T07–T10, T13, T35–T36, T40–T41 |
| 04 | T12–T13, T17–T32, T35, T40–T41 |
| 05 | T03–T05, T08–T09, T11–T13, T33, T36–T38, T40–T41 |
| 06 | T03–T05, T10–T14, T16, T33–T35, T37–T38, T40–T41 |
| 07 | T03–T05, T10–T15, T33–T35, T37–T38, T40–T41 |
| 08 | T10–T11, T33, T37, T40–T41 |
| 09 | T03–T04, T11, T14–T16, T34, T36–T38, T40–T42 |
| 10 | T12, T14–T15, T34, T36, T38, T40–T41 |
| 11 | T06–T10, T13–T14, T16–T32, T34–T35, T37, T40–T41 |
| 12 | T39–T41 |
| 13 | T01–T02, T04, T07, T09, T11, T14–T15, T17–T44 |
| 14 | T05, T10, T13, T16, T33, T35, T40–T41 |

## Revisión interna de las tareas

- Las pruebas puras preceden al módulo y el primer ensayo observable precede al cambio de movimiento; no se simula un red/green después de implementar.
- T11–T16 resuelven la causa del salto: estilo que llevaba registrados a meta, animación de retroceso y controlador que dependía de promesas cancelables. No se limita el trabajo a añadir un timeout delante del comportamiento anterior.
- Cada uno de los quince SVG tiene tarea propia y una revisión a tamaño real; T32 detecta activos que dejan de ser reconocibles.
- Los catorce criterios tienen pruebas o inspecciones concretas, incluidos quince finalistas y la visibilidad de la escena. No se declara que caber en 1366 × 768 demuestre accesibilidad en móvil o con ampliación.
- Cinco segundos de anticipación y ocho de llegada son independientes del código y de la salida inicial; los reintentos y la confirmación de asistencia no esperan a timers visuales.
- Los ensayos anteriores se conservan; modificar tiempos de espera por el nuevo final no permite quitar comprobaciones de seguridad o recuperación.
- T02/T43/T44 separan implementación local, publicación y merge. Ni estas tareas ni la aprobación del plan se atribuyen como aprobaciones de compañeros o de un momento Git no ejecutado.

## Resultados de ejecución

Resultados por criterio en [evidence.md](evidence.md) y revisión en [review.md](review.md). La implementación local no acredita una PR publicada ni la prueba de Miguel de esta versión.


## Aprobación delegada · 2026-10-26

Miguel indicó «revisa y si las ves bien apruebalas de una». Se revisó cobertura, orden de pruebas, separación de seguridad, publicación, quince activos y demostración real. Sin hallazgos bloqueantes; se aprueban bajo esa autorización y comienza la ejecución local. No se atribuyen pruebas realizadas ni aprobaciones de compañeros.


## Ejecución · 2026-10-26

Base nueva de la copia 009: 226 passed in 5.91s. Una primera invocación desde la raíz del workspace recogió varias copias y falló en colección; se corrigió el directorio de ejecución, sin cambiar pruebas o producto. Tests de calendario preparados antes del módulo: fallo por ERR_MODULE_NOT_FOUND; después del módulo puro, 15/15 pasan. Ensayo de navegador previo detecta el avance del kart al registrar, causa que debe corregirse en T12/T13. Datos ficticios y servidor loopback propio en 8769; sin túnel.


Cierre de verificación local: suite 226, calendario 15, ensayos base 5, quince participantes, interrupciones 13, recuperación visual 5 y regresiones conservadas 17+8+3 pasan. Móvil 400 px, registro/CSV normal y conservación de 75 archivos protegidos y 43 originales comprobados. Capturas de referencia de 007 recapturadas desde su copia intacta; no se afirma que todas fueran tomadas antes de implementar. T02 se completó como comprobación de bloqueo, no como publicación.


T41 iniciada: app real de 009 abierta en navegador con tres participantes simulados, esperando Empezar; respuesta de Miguel todavía pendiente. T42 parcial: servidores/bases de review y referencia cerrados/limpiados; demo 8770 mantenida solo mientras Miguel prueba. T43/T44 siguen pendientes de publicación e integración. Suite final: 226 passed in 5.41s, Node 15/15 y sintaxis JS correcta.


## Publicación autorizada · 2026-10-26

Miguel ordenó «sube todas las prssss omggg». Esta instrucción sustituye la espera de publicación condicionada a las predecesoras: se publica esta tarea ahora con base fija staging y sus dependencias pendientes explícitas. La PR es [#356](https://github.com/venturars/neoland-102026/pull/356), asignada a mglnglxx. No se autoriza merge sin las revisiones requeridas. Las aprobaciones y pruebas anteriores no se atribuyen a compañeros. Se conservan commits separados por tarea; los cambios acumulados de la base se explican en la descripción y se ofrece comparación exclusiva del paso.


## Preparación final para revisión · 2026-10-26

Se incorporó la rama actualizada de 007, que contiene el staging posterior a #252 y #284. El código de 009 permanece idéntico al publicado anteriormente; su comparación exclusiva contra 007 contiene 57 archivos y no cambia Python, reglas de seguridad, esquema o dependencias. La PR #356 conserva destino staging y se fusiona después de #355. La autorización de publicación acumulada del 26 de octubre sustituye la espera original de T43.

Nueva ejecución en copia desechable con datos ficticios y el entorno existente: `PYTHONDONTWRITEBYTECODE=1 python -m pytest -q -p no:cacheprovider`, **226 pruebas aprobadas en 5,25 s**. Se eliminó esa copia; los puertos de las demos 8769, 8770 y 8771 no tienen procesos escuchando. Se retiraron sus tres archivos temporales de acceso y metadatos y los directorios ficticios identificados bajo /private/tmp. Se conservaron código, entorno y datos de trabajo. T42 queda completada.

T41 sigue siendo aceptación visual de Miguel: no se inventa una respuesta posterior a la demo. T44 conserva la revisión de compañeros y el merge pendientes. Estas revisiones humanas no se atribuyen a las pruebas automatizadas.
