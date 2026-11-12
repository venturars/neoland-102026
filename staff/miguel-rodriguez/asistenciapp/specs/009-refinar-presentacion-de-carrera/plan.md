# Plan 009 · Presentación de carrera y celebración final

Estado: plan aprobado expresamente por Miguel el 2026-10-26.  [Spec corregida y aprobada](spec.md), [issue #332](https://github.com/venturars/neoland-102026/issues/332). Tareas aprobadas bajo autorización de Miguel el 2026-10-26; ejecución local iniciada, sin PR de 009. Este plan no presenta una maqueta como si fuera la aplicación implementada.

## 1. Base, alcance y publicación

Trabajar en la copia `009-local-implementation/asistenciapp`, tomada de 007 probada por Miguel. Conservar `baseline-manifest.json` y los originales de 007/008. Antes de implementar, capturar la suite y hashes realmente disponibles; no reutilizar 226 como si fuera una ejecución nueva. Datos de ensayo ficticios, sin copiar la base manual de Miguel.

009 modifica presentación, dibujos, secuencia decorativa y las instrucciones solicitadas. No cambia Python, API, tablas, autenticación, reservas, código de asistencia, origen fiable, caducidad, clasificación o exportación. No hay nuevas dependencias ni servicios externos. qrcode permanece con su versión y configuración aprobadas.

La PR futura será exclusiva de #332 y tendrá base staging. Antes de publicar se comprueba que staging contiene 007 y 008 y se vuelve a comparar el diff. Rama prevista según la convención del repositorio: `332-feat-refine-race-presentation`; título igual al de la issue, assignee mglnglxx, Closes #332 y enlace Development verificado. No se cambia la base para encadenar PRs ni se publican cambios anteriores acumulados. Si falta la base, se informa antes de iniciar el momento Git; este plan no crea ramas ni publica.

La autorización local anterior de 007/008 no se presenta como aprobación tácita del código de 009: sus tareas se preparan tras aprobar este plan y se implementan solo al aprobar esas tareas. La versión 007 continúa disponible como referencia probada.

## 2. Dirección visual y composición

### Sistema compartido

- Fondo blanco, texto `#171717`, secundarios oscuros y separadores grises finos. Acción principal `#ff6b00` con texto oscuro: verificar contraste real, sin poner texto blanco pequeño sobre naranja sin medirlo.
- Tipografía del sistema, texto habitual de 16 px, títulos compactos y cifras de ancho uniforme. Sin fuentes remotas, sombras ornamentales, grandes héroes, degradados ni tarjetas repetidas alrededor de cada dato.
- Estados y posiciones escritos además de su color. Foco visible y botones principales cómodos de pulsar; la pista de celebración es de lectura, sin mini botones incrustados en sus filas compactas.
- Enlaces subrayados y acciones secundarias discretas. Solo la acción principal de cada fase recibe el acento fuerte.

Crear `static/race-theme.css` con las variables y reglas comunes de las tres vistas reales. Las reglas se limitan al cuerpo con clase `race-ui`; `race.css` conserva la composición de carrera y `styles.css` el comportamiento visual de los formularios anteriores. En el panel del profesor se añade la clase y se carga el tema después de su hoja existente. La entrada normal del alumno no recibe ese tema ni nuevos flujos. Revisar posibles conflictos en el panel normal, no declarar compatibilidad solo porque no cambió su JavaScript.

### Pantallas

| Vista/fase | Contenido principal y texto visible previsto |
| --- | --- |
| Panel | Título de clase, opción Carrera de Halloween y Abrir asistencia; lista de clases. Se mantienen sus operaciones normales. |
| Alumno, entrada | Tu nombre + selector + Entrar. Sin bienvenida o eslogan. |
| Alumno, espera | Personaje y nombre propios + Listo. La salida inicial conserva Preparados/Listos/Ya. |
| Profesor, lobby | Título corto, lista de nombres con estado, QR, enlace alternativo, recuento y Empezar. |
| Profesor, registro | Código grande y su tiempo, lista con puestos confirmados y Terminar; los karts siguen en el origen. |
| Alumno, registro | Código + oportunidades + Confirmar. Tras éxito, puesto y hora sin esperar al profesor. |
| Final | Nombre del ganador, 3–2–1, pista y después podio; clasificación completa accesible. |

Retirar los eslóganes y párrafos que repiten lo visible. Conservar etiquetas de formulario, confirmaciones de cierre/retirada y errores accionables. No cambiar los IDs que usan los controles o los ensayos existentes salvo necesidad documentada. Los textos exactos pueden pulirse sin alterar las acciones ni ocultar advertencias necesarias.

## 3. Quince SVG más simples

Mantener los quince nombres de fichero y correspondencias del roster. Dibujar una carrocería común con pocas formas, dos ruedas y trazos uniformes. Objetivo de dibujo: proporción horizontal aproximada de 120 × 80, legible alrededor de 54 × 36 en la pista compacta y mayor en la pantalla propia/podio. Estos tamaños se verifican con capturas; no se declaran adecuados sin verlos.

Cada piloto conserva dos rasgos que se reconocen al reducirlo: silueta y accesorio o detalle grande. Usar la tabla de `docs/RACE-ASSETS.md` y la imagen original ya consultada; no reemplazarla por iniciales, un casco genérico o diferencias solo de color. Reducir piezas diminutas de la carrocería antes que borrar los rasgos del personaje. Revisar los quince juntos a tamaño de pista y en escala de grises, y cada personaje a mayor tamaño. SVG sin script, eventos, texto remoto ni referencias externas. No editar exercises/.

Actualizar `docs/RACE-ASSETS.md` solo con los rasgos y decisiones realmente presentes. No copiar código o recursos de Spell UI: el estilo será propio y vanilla; su referencia local ya fue consultada.

## 4. Separar fase del servidor y fase decorativa

Las fases del servidor siguen siendo lobby/countdown/open/closed/expired. La nueva celebración no crea una fase de negocio ni manda peticiones para registrar, cerrar o abrir la clase. La primera cuenta atrás permanece ligada a startsAt de 008.

Añadir `static/race-finale.js`: cálculo puro del tramo decorativo y duración por puesto. Recibe tiempo transcurrido y datos mínimos, sin fetch, almacenamiento, reloj global ni DOM. Se prueba con el ejecutor incorporado de Node disponible para desarrollo; no añade paquetes o un runtime al servidor.

| Tiempo desde observar el cierre | Fase decorativa | Presentación |
| --- | --- | --- |
| 0 ≤ t < 2000 ms | winner | Nombre del primer puesto confirmado; karts en salida. |
| 2000 ≤ t < 3000 ms | countdown | 3; karts quietos. |
| 3000 ≤ t < 4000 ms | countdown | 2; karts quietos. |
| 4000 ≤ t < 5000 ms | countdown | 1; karts quietos. |
| 5000 ≤ t < 13000 ms | finish | Único recorrido de origen a meta. |
| t ≥ 13000 ms | podium | Podio y resultado actual. |

Dentro de finish se conservan las llegadas de 007: un único finalista tarda 8000 ms; con varios, el primero 5800 ms y el último 8000 ms, con duraciones crecientes por puesto. La escena permanece hasta completar los ocho segundos; el orden viene de las posiciones confirmadas, no del reloj o animationend.

En `race-renderer.js`, eliminar la dependencia del avance en `.state-registrado`: todos los karts de la lista permanecen en el origen mientras solo se reciben registros. La posición se escribe en el estado. `finishRace` pasa a animar transform desde cero hasta la distancia útil de su pista; nunca comienza con un desplazamiento negativo que haga retroceder a un coche que ya estaba en meta. Se mide el espacio real, considerando ancho de kart y margen; no se usa la fila de texto como identidad. Cada nodo se asocia a la clave de su plaza derivada del roster, y los resultados se cruzan con los datos autorizados del servidor.

## 5. Controlador de celebración e integración

`race-display.js` conserva autenticación, carga privada del QR, polling serializado, espera de acciones, backoff y timeouts. No aparecen bucles de red nuevos por animación. El controlador visual permanece aquí; no se añade una librería de estados.

Al observar una transición confirmada a closed, con estado anterior conocido y al menos una asistencia, crear una sola celebración por carrera y una firma de resultados. Guardar el instante monotónico inicial de la presentación una vez, sin persistirlo. El calendario visual se calcula desde el tiempo transcurrido; las consultas posteriores no lo reasignan. Si el primer estado recibido de una página ya es closed, mostrar resultado directamente.

Un temporizador visual único actualiza el tramo; las animaciones de cada kart se crean una sola vez al entrar en finish. No encadenar setTimeout de dos, tres y ocho segundos para decidir fases: esa acumulación se retrasaría en una pestaña oculta. El tiempo de la fase decide si se muestra podio, no Promise.all de animaciones cancelables.

Cada celebración recibe un identificador de ejecución. Antes de aplicar una finalización o callback, comprobar que sigue siendo la ejecución activa. Cancelar invalida ese identificador, detiene el temporizador y cancela animaciones. Así una promesa cancelada o una respuesta anterior no vuelve a abrir un podio o mueve el foco después de una corrección.

### Interrupciones y recuperación

- **Página oculta:** pausar el trabajo visual. El instante inicial sigue siendo el mismo. Al volver, consultar primero el resultado actual y después calcular el tramo restante. Si pasaron trece segundos, mostrar podio sin volver a contar ni correr. Si se está dentro de finish, representar su progreso transcurrido; no empezar ocho segundos nuevos.
- **Corrección de asistencia:** al cambiar la firma de checkins durante anuncio, cuenta o llegada, cancelar toda celebración y mostrar directamente el resultado actualizado. Si solo cambia un tiempo de consulta u otro dato no clasificatorio, no cancelarla ni reiniciarla.
- **Movimiento reducido:** no crear anticipación ni animaciones. Si la preferencia cambia durante la celebración, cancelar y mostrar resultado directamente. La salida inicial conserva sus permisos/startsAt; solo se omite el movimiento decorativo correspondiente.
- **Recarga/página nueva:** primer closed va directo al podio. No recuperar un reloj de celebración desde sessionStorage o un parámetro del enlace.
- **Cierre vacío/caducidad/sin autorización:** no crear ganador o una llegada. Limpiar la celebración al perder autorización o abandonar la página. Los datos de profesor solo se muestran cuando la respuesta privada los permite.
- **Error de consulta:** no crear una transición inventada. Si ya existía un resultado confirmado, conservarlo con el aviso de conexión. Al recuperar la respuesta, revalidar su firma antes de continuar o mostrar podio.
- **Cambio de tamaño:** las medidas de desplazamiento se recalculan para el progreso actual sin reproducir origen/meta ni alterar duraciones. No se deriva una posición nueva de esas medidas.

El reloj decorativo es local a cada presentación. Dos ventanas pueden recibir el cierre con una pequeña diferencia de red; no se promete una salida final sincronizada entre ellas ni se modifica 008 para añadir un reloj de celebración. Sí comparten resultado y la salida inicial única.

## 6. Escena visible y accesibilidad

Reutilizar la parrilla y sus nodos estables en un modo de presentación final dentro de la página; no crear un diálogo modal que capture el teclado ni una segunda lista ejecutable de alumnos. Al entrar al anuncio se ocultan el QR/código ya cerrados y la lista extensa de controles secundarios; la navegación del profesor y las acciones vigentes permanecen accesibles. La clasificación completa se presenta después del podio, fuera del área reservada a la escena.

El modo final ocupa el área visible de la ventana y reserva sitio al encabezado, anuncio/número, pista y acciones. A 1366 × 768 y 100 %, presupuesto inicial: encabezado compacto hasta 48 px, anuncio hasta 56 px, quince filas de pista de 36 px (540 px), acciones hasta 48 px y separaciones contenidas; conjunto hasta 744 px. Ocultar en la pista final las plazas sin asistencia, manteniéndolas en el resumen de pendientes de resultados. No reducir mediante zoom global ni esconder finalistas que deberían cruzar.

Al comenzar la escena, situar una sola vez la vista en su inicio para que no herede un scroll del lobby, y dar foco al encabezado sin robarlo cada número. La disposición debe caber por sí misma en el área objetivo; mover el scroll automáticamente no sustituye esa comprobación. Al acabar, podio visible y foco en su título una vez. La tabla completa puede seguir debajo; las acciones de retirada se conservan allí y también se pueden usar desde otra presentación autorizada.

A 400 px y con zoom 200 % se conserva tamaño de lectura y controles cómodos; se permiten listas desplazables. No se intenta encajar quince filas reduciendo los nombres. El anuncio del ganador se comunica una vez por una región de estado; los números decorativos no generan una avalancha de anuncios. Nombres y estados no dependen del color. El QR conserva negro/blanco y su margen de cuatro módulos.

## 7. Archivos previstos

| Archivo | Cambio |
| --- | --- |
| static/race-theme.css | Tema común acotado a race-ui. |
| static/race.css | Disposición de carrera, pista estática y modo final visible. |
| static/profesor.html | Tema y copia compacta del panel, sin cambiar su navegación o creación. |
| static/race.html; static/race-display.html | Quitar repetición, conservar etiquetas y añadir los elementos de celebración. |
| static/race.js | Acortar únicamente mensajes redundantes conservando su manejo de acceso, envíos y recuperación. |
| static/race-finale.js | Cálculo puro de tramo y duración, nuevo. |
| static/race-display.js | Controlador de presentación y limpieza, sin modificar el contrato de red. |
| static/race-renderer.js | Karts quietos al registrar y único recorrido por clave de plaza. |
| static/race-characters/*.svg | Quince simplificaciones, mismos slugs. |
| tests/browser/test-race-finale.mjs | Pruebas de límites temporales y orden con herramientas disponibles, sin paquetes. |
| tests/browser/race-finale-review.js | Ensayo de navegador de secuencia, interrupciones y áreas visibles. |
| README.md; docs/ARCHITECTURE.md; docs/RACE-ASSETS.md; AGENTS.md | Uso real, responsabilidad visual, créditos y preferencias aprobadas. |
| specs/009-refinar-presentacion-de-carrera/ | Spec, plan, tareas y evidencia propias de esta tarea. |

Las funciones nuevas o modificadas incluyen tipos documentados, parámetros, resultado y ejemplo Usage según AGENTS.md; los módulos explican su responsabilidad.

No se cambian requirements.txt, archivos Python, base de datos, reglas de seguridad, specs históricas ni activos ajenos. Si aparece una necesidad de cambiar ese contrato, se detiene el cambio afectado y se revisa el plan antes de implementarlo.

## 8. Comprobación de la constitución

| Regla | Cumplimiento previsto |
| --- | --- |
| P1 · Independencia | El juego sigue sirviendo cualquier clase; no depende de Discord, Meet o APIs nuevas. |
| P2 · Simplicidad | Un tema compartido por tres vistas reales, un cálculo puro de fase y controlador visual junto al polling existente; sin motores ni abstracciones de juego. Confirmar asistencia sigue siendo inmediato. |
| P3 · Dependencias | Sin nuevas dependencias; se conserva qrcode aprobado. Node y el navegador ya disponibles son herramientas de verificación, no servicios de la app. |
| P4 · Privacidad | No cambia datos guardados o enviados; no se conservan relojes decorativos ni resultados nuevos. Capturas sin permisos, códigos ni tokens. |
| P5 · Accesibilidad | Foco, etiquetas, contraste, lectura móvil y movimiento reducido incluidos con procedimientos verificables. |
| P6 · Español | Mensajes y documentos españoles; términos técnicos solo donde ayudan al mantenedor. |
| §4 · SDD | Spec aprobada; plan y luego tareas esperan aprobación propia. No se escribe código en esta fase. |
| §5 · Calidad | Cada criterio tiene prueba de comportamiento o comprobación visual concreta en §9; se ejecuta la suite de regresión de la copia. |
| §6 · Seguridad | Sin cambios de API, origen, permisos, presupuesto o clasificación; se conserva la evidencia 008. |
| §7 · Alcance | Trabajo limitado a nuestra app dentro de la copia local de revisión. Exercises/ y otros alumnos quedan intactos. |
| §8 · Enmiendas | No se propone nueva enmienda: el cambio es de presentación, no de stack, datos o reglas. |

## 9. Verificación por criterio

Preparar primero los tests puros de tiempo y observar su fallo por ausencia del módulo. Después implementar y ejecutar los casos. Las verificaciones visuales se realizan sobre la app real con datos ficticios; no se da por probado el diseño al buscar palabras en el HTML. El plan no aporta resultados que todavía no existen.

| CA | Procedimiento y resultado esperado |
| --- | --- |
| 01 | Abrir panel y ambas pantallas a tamaño real; capturar las tres, comprobar tema común, lectura y una acción principal por fase; medir contraste de texto y controles. |
| 02 | Revisar cada fase contra inventario previo de textos: fuera héroes/eslóganes y duplicados, dentro etiquetas, errores y confirmaciones necesarios. Completar formularios con teclado. |
| 03 | Recorrer lobby → salida inicial → registro → resultado; comprobar QR/enlace, estado propio, intentos, código solo en open y controles del profesor. |
| 04 | Comparar los quince activos con su referencia, en galería a 54 × 36, tamaño mayor y grises; registrar dos rasgos por piloto y verificar SVG sin contenido activo/remoto. |
| 05 | Confirmar un primer alumno mientras otro espera: puesto inmediato y coordenada horizontal del kart sin cambio. Confirmar también al último: respuesta propia inmediata antes de los cinco segundos. |
| 06 | Probar límites 0/1999/2000/2999/3000/3999/4000/4999/5000 ms; ganador, 3, 2, 1 y finish correctos. En navegador comprobar karts quietos durante anuncio/cuenta y que múltiples consultas no reinician el calendario. |
| 07 | Probar finalistas 1/2/3/15 y límites 12999/13000 ms; un único recorrido, cruces en orden del servidor y podio después del último. Comparar posiciones con las asistencias. |
| 08 | Cierre manual con alguno pendiente/agotado; cancelar mantiene open. Cierre vacío muestra resultado sin anuncio, cuenta ni animaciones. |
| 09 | Recargar durante anuncio/cuenta/llegada y abrir otra ventana cerrada: resultado directo. Ocultar/reanudar dentro del plazo y después de trece segundos; no reiniciar; simular error de consulta sin ganador inventado. |
| 10 | Retirar al ganador y a otro finalista en anuncio, cuenta y llegada desde otra ventana autorizada; recibir actualización, cancelar ejecución vieja y comprobar podio actualizado sin callbacks tardíos. |
| 11 | 400 px, 1366 × 768, zoom 200 %, teclado/foco; movimiento reducido inicial y activado a mitad: resultado directo. Medir contraste y comprobar que no hay anuncios repetidos por polling/número. |
| 12 | Leer AGENTS.md y verificar las dos preferencias, con su excepción explícita para etiquetas/errores necesarios y sin alterar el flujo de aprobaciones. |
| 13 | Ejecutar pytest completo de la copia y ensayos existentes de recuperación/acciones simultáneas. Comparar hashes de Python, dependencias, documentos históricos y originales de Halloween; exportación y clase normal conservadas. |
| 14 | Crear quince finalistas en 1366 × 768 al 100 %; situarse inicialmente al final de una lista larga, cerrar y comprobar rectángulos de anuncio/cuenta, las quince filas y meta dentro de la ventana sin scroll manual ni zoom global. Al acabar comprobar podio visible; clasificación completa accesible. Capturas de cada tramo. |

Comandos de verificación previstos, desde nuestra app con su entorno activado: `python -m pytest -q`, `node --test tests/browser/test-race-finale.mjs` y `node --check` sobre los JS modificados. Los ensayos de navegador se ejecutan con las herramientas Playwright ya disponibles y un servidor propio en puerto libre. Registrar versión, comando y resultado real al ejecutarlos.

Al terminar cada ensayo, detener solo los servidores/túneles propios y comprobar el puerto libre. Mantener la copia de código hasta guardar el trabajo y registrar la prueba real de Miguel; no borrar la única implementación todavía sin publicar. La primera demostración del diseño será la app implementada y verificada, no la spec o un archivo abierto en Cursor.

## 10. Revisión interna del plan

- Se revisó la causa del recorrido prematuro: CSS lleva cada registrado a meta y la llegada actual lo coloca atrás mediante transform negativo. Se reemplazan ambos mecanismos, no se añade una pausa que deje intacto ese salto.
- Se revisó el controlador actual basado en promesas de animaciones: el plan evita que cancelar una animación ejecute después un callback obsoleto. Una sola ejecución y reloj gobiernan el final; polling no lo reinicia.
- El presupuesto de pantalla se aplica solo a la presentación final de escritorio. La lista completa queda accesible y móvil/zoom no heredan quince filas forzadas.
- La secuencia completa dura aproximadamente trece segundos desde observar cierre: cinco de anticipación y ocho de llegada. El registro y su confirmación no esperan ninguna de esas etapas.
- La dependencia no se da por integrada: la publicación sigue esperando una base staging que permita un diff exclusivo. No se crean aprobaciones, resultados de tests o una PR inexistentes.

No se identifican contradicciones pendientes con los catorce criterios de la spec. La calidad visual y las medidas de pantalla permanecen sujetas a pruebas reales al implementar. Aprobación posterior registrada abajo; las tareas se presentan por separado.


## Aprobación del plan · 2026-10-26

Miguel indicó «apruebo» tras la presentación del plan y la pregunta expresa sobre preparar las tareas. Se aprueba el plan 009. Se preparan ahora las tareas para su revisión; no se atribuye aún aprobación para implementar ni ejecutar Git.
