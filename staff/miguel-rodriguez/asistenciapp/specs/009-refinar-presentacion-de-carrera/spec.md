# Spec 009 · Presentación de carrera y celebración final

Estado: versión corregida aprobada expresamente por Miguel el 2026-10-25.  Issue [#332 · Refine race visuals and add a staged finish celebration](https://github.com/venturars/neoland-102026/issues/332), asignada a mglnglxx y creada con su aprobación el 2026-10-25. Plan aprobado por Miguel el 2026-10-26; tareas aprobadas bajo autorización de Miguel el 2026-10-26; ejecución local iniciada. Se conserva la versión 007 ya probada en una copia aparte. El destino futuro de su PR será staging, con diff exclusivo de esta tarea.

## Problema

La carrera funciona, pero la presentación dedica demasiado espacio a eslóganes, explicaciones repetidas y decoración. Los pilotos pierden claridad al reducirse al tamaño de la pista. Al terminar los registros, la llegada comienza sin una pausa que permita a la clase ver quién ganó y prepararse para disfrutar del final.

Miguel pide una mezcla minimalista de la sencillez de Craigslist y la energía visual de Temu: listas claras, números visibles y una acción principal evidente. La celebración debe representar la asistencia ya confirmada, sin retrasar su registro ni cambiar el orden obtenido.

## Usuarios

- Profesor: comparte la pantalla, comprueba la parrilla y dirige la clase.
- Alumnos: eligen su nombre y registran el código desde el móvil.
- Clase: ve los personajes, el ganador, la llegada y el podio.
- Personas que mantienen la app: necesitan una presentación sencilla de entender y modificar sin romper las reglas existentes.

## Historias de usuario

- **HU-01:** Como profesor, quiero ver la acción y la información de la fase actual sin buscar entre textos repetidos.
- **HU-02:** Como alumno, quiero entender qué hacer con pocas palabras y reconocer mi personaje en la pista.
- **HU-03:** Como clase, queremos ver el ganador y una breve anticipación antes de la llegada final.
- **HU-04:** Como participante, quiero que la decoración nunca retrase mi confirmación ni cambie mi puesto.
- **HU-05:** Como mantenedor, quiero decisiones coherentes que reduzcan la complejidad de uso, desarrollo y trabajo de los agentes.

## Experiencia propuesta

1. **Presentación:** fondo blanco o muy claro, texto oscuro, filas compactas y separadores finos. Un acento naranja destaca la acción principal. Nombres, cifras y estados forman la jerarquía; se retiran los grandes eslóganes y rótulos redundantes.
2. **Entrada y salida:** el profesor conserva el QR/enlace y el control de salida; el alumno conserva su nombre, personaje y acción de entrada. La salida inicial sigue siendo la cuenta atrás compartida de tres segundos de 007.
3. **Registro:** el código ocupa el lugar principal de la presentación. Cada participante ve sus oportunidades y recibe su confirmación de asistencia y puesto inmediatamente, sin esperar al resto. La lista actualiza esos puestos, pero los karts permanecen en la salida: registrar no los desplaza hacia la meta.
4. **Cierre con finalistas:** cuando la presentación observa el cierre confirmado por el último registro o por el profesor, muestra una escena final visible con el ganador durante unos dos segundos. Después muestra 3, 2 y 1, un segundo cada número. Los karts siguen en la salida durante toda esa anticipación. Son aproximadamente cinco segundos en total, no cinco segundos más la cuenta atrás.
5. **Llegada:** al terminar el 1 comienza el único recorrido de salida a meta, durante unos ocho segundos. Los pilotos con asistencia cruzan según los puestos confirmados; no retroceden desde una meta alcanzada previamente. La escena muestra la llegada sin que el profesor busque la pista haciendo scroll. Después presenta el podio; la clasificación completa sigue disponible.
6. **Resultado directo:** sin finalistas se muestra la lista vacía; con movimiento reducido o al volver a abrir una carrera ya cerrada se muestra directamente su resultado, sin esperas decorativas ni repetición de la llegada.

## Criterios de aceptación

- **CA-01 · Dirección visual:** Dadas las pantallas del panel, presentación y alumno relacionadas con la carrera, cuando se usan, entonces comparten superficies claras, texto oscuro, separadores finos y una acción principal naranja. Las referencias de Craigslist y Temu se traducen en sencillez de listas y jerarquía de cifras, sin copiar sus marcas ni añadir ofertas, anuncios, puntos o mecánicas de compra. La decoración no compite con el QR, el código o los resultados.
- **CA-02 · Menos texto, misma comprensión:** Dada una pantalla de carrera, cuando se revisa a tamaño real, entonces no contiene eslóganes, introducciones ni etiquetas que repitan información ya visible. Conserva nombres de controles, etiquetas de campos, errores que indiquen qué hacer y estados necesarios para comprender el registro. Un elemento no depende de una explicación larga para poder utilizarse.
- **CA-03 · Jerarquía por fase:** Dado el flujo de carrera, cuando cambia entre entrada, espera, salida, registro y resultado, entonces se distingue la acción o información principal de esa fase. Se conservan el enlace alternativo al QR, el nombre y personaje propios, las oportunidades restantes y los controles del profesor; no se revela antes de tiempo el código ni se confunden los permisos de alumno y profesor.
- **CA-04 · Quince pilotos legibles:** Dada cada correspondencia de nombre y personaje de 007, cuando se ve su kart al tamaño real de la pista, entonces conserva al menos dos rasgos reconocibles del personaje y se distingue de los otros por silueta o accesorios, además del color. La carrocería y sus trazos se simplifican, con menos piezas y detalles diminutos. Se conserva la correspondencia de los quince nombres y no se modifican los ejercicios originales ni se usan rasgos físicos inferidos de sus autores.
- **CA-05 · Asistencia inmediata:** Dado un código aceptado, cuando se confirma la asistencia, entonces el alumno recibe su puesto y confirmación sin esperar al último participante, la nueva cuenta atrás o la animación. Los puestos, horas y ganadores siguen siendo los de los registros confirmados; ninguna etapa visual registra, reordena o elimina asistencias. La clasificación se actualiza al confirmar, pero los karts no avanzan por registrar: permanecen en la salida hasta terminar la anticipación de CA-06.
- **CA-06 · Anticipación de cinco segundos:** Dada una presentación abierta que acaba de observar un cierre confirmado con finalistas, cuando comienza la celebración, entonces muestra al ganador unos dos segundos, seguidos de 3–2–1 con un segundo por número. Durante el anuncio y los tres números, los karts permanecen en la salida. Su único recorrido hacia la meta comienza al terminar esa anticipación de aproximadamente cinco segundos, medida desde que la presentación recibe el cierre. Las consultas posteriores del mismo cierre no reinician el reloj ni duplican la celebración. Esto es independiente de la cuenta atrás inicial de salida, que conserva su comportamiento.
- **CA-07 · Llegada y podio:** Dada la anticipación terminada, cuando se reproduce la llegada, entonces dura aproximadamente ocho segundos y respeta los puestos confirmados. Solo cruzan quienes tienen asistencia. No se simula la salida moviendo hacia atrás coches que ya habían llegado. Después se muestra la clasificación completa y el podio de hasta tres finalistas; uno o dos obtienen solo los puestos disponibles. No se inventan empates ni un ganador distinto por la animación.
- **CA-08 · Cierre manual y vacío:** Dada una carrera con participantes pendientes, cuando el profesor confirma terminarla, entonces los finalistas ya confirmados reciben la misma secuencia de ganador, anticipación, llegada y podio. Cancelar conserva la carrera abierta. Con cero asistencias se muestra directamente que no hay registros: no hay ganador, medallas ni espera de cinco segundos. La falta de participantes o de intentos nunca fabrica una asistencia.
- **CA-09 · Recuperación sin repetición:** Dada una carrera ya cerrada, cuando se recarga o abre otra presentación, entonces muestra directamente sus resultados actuales. Si una presentación que estaba celebrando queda oculta y vuelve después, no reinicia la secuencia ni prolonga artificialmente las esperas; si el tiempo decorativo ya terminó, muestra el resultado. Un fallo de consulta no inventa cierre ni ganador.
- **CA-10 · Corrección de resultados:** Dada una asistencia retirada por el profesor antes, durante o después de la celebración, cuando se recupera el resultado actualizado, entonces la clasificación y el podio reflejan esa retirada. Si la corrección invalida la celebración en curso, se interrumpe y se muestra el resultado actualizado, sin repetirla automáticamente ni reabrir la carrera.
- **CA-11 · Accesibilidad y móvil:** Dadas pantallas de unos 400 píxeles, uso por teclado, ampliación o movimiento reducido, cuando se recorre el flujo, entonces nombres, código, posiciones y controles siguen siendo legibles y utilizables. Los estados no dependen solo del color. Con movimiento reducido se omiten anticipación y desplazamientos y se presenta directamente el resultado. La cuenta atrás final no roba el foco con cada número ni repite continuamente el anuncio del ganador.
- **CA-12 · Instrucciones del proyecto:** Dadas las preferencias de la captura adoptadas por Miguel, cuando se actualiza el manual de trabajo, entonces pide eliminar eslóganes, ayudas y rótulos secundarios redundantes y resolver la comprensión mediante la disposición. También pide elegir soluciones que mejoren la experiencia de usuario, de desarrollo y de trabajo de agentes, conservando el comportamiento. No prohíbe las etiquetas accesibles o los errores necesarios ni permite saltarse las aprobaciones de especificaciones.
- **CA-13 · Reglas y alcance conservados:** Dada la nueva presentación, cuando se registra, consulta, retira o exporta asistencia, entonces se conserva el contrato aprobado de 007 y 008: grupo fijado al salir, tres oportunidades por plaza, recuperación sin nuevos intentos, caducidad, separación de accesos y clases normales. Esta tarea no añade cuentas, premios entre clases, preguntas, controles que decidan cuándo guardar una asistencia ni servicios externos de juego.

- **CA-14 · Final visible al compartir pantalla:** Dada la presentación del profesor en un escritorio de 1366 × 768 o mayor, a tamaño normal y con hasta quince finalistas, cuando comienza el anuncio del ganador, entonces anuncio, cuenta atrás y escena de llegada se ven en la pantalla sin desplazamiento manual. Al terminar, el podio queda visible. La lista larga del lobby o de clasificaciones no empuja la escena final fuera de la vista ni exige reducir toda la página para verla. La clasificación completa permanece accesible. En móvil y con ampliación se permite desplazar las listas manteniendo legibles los nombres y accesibles las acciones; no se fuerzan quince filas dentro de una pantalla pequeña.

## Fuera de alcance

Alojamiento permanente de la aplicación, cambios de acceso o identidad, nuevas reglas de asistencia, puntos entre clases, preguntas, conducción manual, poderes, sonidos obligatorios, cambios del roster y sustitución de los ejercicios originales. La puesta en marcha por el profesor y el acceso temporal de alumnos siguen siendo los ya probados en 007; esta tarea no convierte la app en un servicio disponible cuando el ordenador está apagado.

## Preguntas abiertas y decisiones propuestas

No quedan datos imprescindibles sin definir para revisar la propuesta. Estas decisiones quedaron incluidas en la spec corregida aprobada por Miguel:

- El anuncio revela al ganador antes de la animación, tal como pidió; la animación celebra un resultado conocido.
- Dos segundos de anuncio más tres de cuenta atrás suman los cinco segundos solicitados. La llegada conserva sus ocho segundos. Los karts esperan en la salida hasta ese momento; la clasificación confirma posiciones antes, pero no los desplaza.
- Movimiento reducido, reapertura de resultados cerrados y cierre vacío omiten las esperas decorativas.
- Se conservan dos rasgos reconocibles de cada personaje al simplificarlo.

## Revisión interna antes de aprobación

- Contraste con la petición: recoge estilo, recorte de texto, simplificación de karts, preferencias del manual y anticipación final; no incorpora las preguntas o puntos sugeridos por Claude.
- Contraste con 007: mantiene la salida inicial y la llegada de ocho segundos. Sustituye expresamente el avance visual de un kart al registrar por un estado y puesto inmediatos, con el kart quieto hasta la celebración. La salida inicial habilita el código; la cuenta atrás final solo prepara la animación y no concede permisos.
- Contraste con 008 y la constitución: no retrasa la confirmación, no repone intentos ni altera privacidad, accesos, presupuesto, caducidad o almacenamiento local. No requiere enmienda funcional adicional a esos principios.
- Casos revisados: cierre automático y manual; cero/uno/dos/tres y quince finalistas; corrección del ganador; recarga, ocultación, fallo de consulta y movimiento reducido. Se exige comprobar la escena final en 1366 × 768 y la experiencia de alumno en unos 400 píxeles, sin confundir los requisitos de ambas pantallas.
- Este documento describe resultados observables, sin fijar su construcción. El plan y las tareas se prepararán y aprobarán por separado. No hay código de 009 ni PR nueva.

## Segunda revisión · 2026-10-25

Se resolvieron los dos hallazgos del review solicitado por Miguel:

1. **Recorrido prematuro:** CA-05–CA-07 separan puesto confirmado y desplazamiento del kart. Se elimina el avance por cada registro y se exige que el único recorrido comience tras la anticipación. No se resuelve haciendo retroceder al coche justo antes de animarlo.
2. **Escena fuera de pantalla:** CA-14 establece un resultado comprobable para la pantalla compartida y conserva una clasificación completa accesible. Se comprueba con hasta quince finalistas en 1366 × 768; no se impone esa densidad al móvil ni al uso con ampliación. El plan resolverá la disposición, sin fijarla aquí.

La revisión documental no encuentra contradicciones pendientes entre los catorce criterios, el flujo corregido y las reglas de asistencia. El anuncio del ganador sigue durando dos segundos; la cuenta final tres; la llegada ocho. La clasificación confirma el resultado sin espera y la celebración lo representa después. Quedan por decidir la construcción en el plan y por comprobar su aspecto real al implementar; no se presentan como diseño ya realizado. La aprobación posterior consta al final de este documento.


## Aprobación de la spec · 2026-10-25

Miguel indicó «apruebo» después de confirmar que el diseño y la nueva animación aún estaban definidos solo en la spec. Se aprueba la versión con los dos ajustes revisados: karts quietos hasta completar la anticipación y escena final visible sin scroll manual. Esta aprobación permite preparar el plan; las tareas y la implementación conservan sus aprobaciones separadas.
