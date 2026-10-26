# Tareas 007 · Carrera de asistencia de Halloween

Estado: spec, plan y tareas aprobados por Miguel el 2026-10-24; implementación local autorizada el 2026-10-25 tras aprobar el resultado de 008. Interfaz implementada y verificada por el agente; Miguel probó el recorrido en ordenador y mediante QR en su móvil el 2026-10-25. Publicación pendiente. Issue [#325](https://github.com/venturars/neoland-102026/issues/325); backend [#328](https://github.com/venturars/neoland-102026/issues/328), sin PR publicada. La excepción autorizada permite implementar en copia separada y publicar después con diff exclusivo a staging. Véanse [evidencia](evidence.md) y [revisión](review.md).

## Reglas de ejecución y propiedad

- Una tarea cada vez. Marcar [x] solo con resultado y evidencia reales; las tareas preparadas no son trabajo implementado.
- T01 es una puerta de dependencia: el backend 008 debe tener sus propios documentos y aprobaciones. No se implementan aquí dominio, tablas, transacciones, cookies, CSRF o excepciones de IP que pertenecen a esa tarea. Las pruebas de 007 consumen su contrato.
- T02 prepara rama y PR draft antes de implementar; T03 conserva una referencia anterior en copia ficticia. T04 aplica la enmienda correspondiente antes de QR o pantallas que usen sus datos. Si la dependencia, base, enmienda o contrato no coincide con el plan, resolverlo en su documento antes de continuar; no remendarlo desde el frontend.
- Las pruebas previas de QR deben fallar por ausencia de la funcionalidad antes del generador/ruta. Los resultados puramente visuales usan los procedimientos de navegador de estas tareas, no tests que solo busquen texto en un fichero.
- Trabajar solo en nuestra app. No modificar exercises/, otras carpetas de staff, main, las bases reales ni archivos ajenos. Los originales de Halloween se consultan y sus créditos se conservan.

## Antes de implementar: comprobar la dependencia

- [x] T01 · **Contrato de seguridad disponible.** Registrar la issue, spec, plan, tareas, PR y revisión del backend 008 cuando realmente existan. Comprobar sus rutas de preparar, lobby, join, me, start, release, attempt y close; modo de clase, errores, reloj, cookie, CSRF y lectura tras cierre. No exigir todavía qr.svg: esa ruta es de 007. Obtener la evidencia de exclusión de rutas antiguas, tres comprobaciones por plaza, máximo 45 y quince clientes con una IP. Resultado: referencias y contrato contrastados con plan.md §§2–6; si faltan, esta puerta queda pendiente y no se inventa ni implementa el backend en 007. Cubre CA-02–CA-09, CA-11, CA-13–CA-15, CA-19–CA-25.

- [x] T02 · **Rama y PR draft antes de implementar.** Con el backend 008 integrado en staging y las tareas aprobadas, comprobar el estado local y conservar los archivos ajenos. Enseñar a Miguel la rama 325-feat-live-kart-race, base staging, commit vacío chore: open #325, título de la issue, assignee mglnglxx y Closes #325; ejecutar el momento Git con su autorización según docs/GIT-WORKFLOW.md. Crear la rama desde staging actualizado y abrir la PR en draft antes de cambios de implementación; incorporar solo los documentos 007 autorizados y verificar el enlace Development. Si staging aún no permite un diff aislado, no mezclar specs ni cambiar la base: esta tarea queda pendiente. Durante la implementación guardar commits pequeños en esa misma PR con el flujo autorizado. Esta casilla no ejecuta Git al redactarse. Cubre CA-18.

- [x] T03 · **Base desechable y referencia anterior.** Preparar una copia sin bases reales, .venv ni cachés; usar datos ficticios y el entorno autorizado. Capturar hashes de originales de Halloween, specs cerradas y archivos fuera del alcance, e inventario y filas de una base de referencia ficticia. Ejecutar la suite realmente disponible y registrar versiones y número de pruebas. No copiar como resultado actual las 145 de 006. Cubre CA-01, CA-13, CA-17, CA-18.

- [x] T04 · **Enmiendas previas y alcance de archivos.** Comprobar que la dependencia aplicó la enmienda de seguridad/privacidad 4.0 con aprobación registrada. Antes del QR, aplicar en docs/CONSTITUTION.md únicamente el añadido P3 y la fila 4.1 del plan si consta su ratificación por Miguel; no inventarla a partir de un documento diferente. Preservar el historial y evitar aplicar dos veces 4.0. Resultado: texto vigente y responsabilidades de ambas PRs inequívocos. Cubre CA-14, CA-15, CA-17, CA-18.

## QR local: pruebas antes del generador

- [x] T05 · **Dependencia QR declarada.** Modificar solo requirements.txt para añadir qrcode==8.2 sin extras pil/png/all; instalarla en el entorno local autorizado cuando se ejecute la tarea, registrar versión y comprobar la fábrica SVG. Documentar la transitiva colorama de Windows. No añadir Pillow, un framework frontend ni un servicio de generación remoto. Cubre CA-02, CA-16, CA-18.

- [x] T06 · **Pruebas del QR y su autorización.** Crear tests/test_race_qr.py antes del código. Cubrir profesor ausente o incorrecto, otra carrera, lobby abierto, salida/cierre/caducidad, SVG XML válido sin scripts ni recursos externos y no-cache. Registrar fallos por funcionalidad ausente; no afirmar que analizar XML prueba que una cámara decodifique el QR. Cubre CA-02, CA-04, CA-14, CA-16, CA-18, CA-25.

- [x] T07 · **Generador SVG.** Crear asistencia/qr.py con una función de generación que reciba el enlace autorizado y use qrcode con fábrica SVG. QR negro sobre blanco, zona libre de cuatro módulos, sin logotipos o personajes que tapen módulos. Tipos, docstring y ejemplo según AGENTS.md. Verificar generación y las pruebas pertinentes sin red. Cubre CA-02, CA-16, CA-18.

- [x] T08 · **Ruta privada del QR.** Añadir a asistencia/race_http.py solo GET /api/sessions/<id>/race/qr.svg, reutilizando el estado autorizado del backend. Exigir token de profesor, lobby vigente y no-store; fuera de lobby no reconstruir el secreto borrado. No consultar SQL desde el borde ni modificar el guard de seguridad. Hacer pasar T06 y comprobar que el enlace codificado corresponde a esa carrera y no contiene el token del profesor. Cubre CA-02, CA-04, CA-14, CA-18, CA-25.

## Pantalla de alumnos y dibujo de la parrilla

- [x] T09 · **HTML del alumno.** Crear static/race.html con selector de nombre, espera, código, intentos restantes y resultado, usando form, label, button y región de estado. Cargar recursos locales y Referrer-Policy no-referrer. Mantener oculto el formulario de código hasta que el estado confirmado permita usarlo. Cubre CA-02, CA-07, CA-08, CA-14, CA-16.

- [x] T10 · **Renderizador básico.** Crear en static/race-renderer.js la función que represente nombre, personaje y estado desde una lista permitida de SVG locales. Construir DOM con textContent, sin innerHTML de datos remotos. Diferenciar pendiente, listo, registrado, sin intentos y sin registrar sin depender solo de colores. Cubre CA-01, CA-02, CA-08, CA-12, CA-16.

- [x] T11 · **Estilos de pista y estados.** Crear static/race.css con pista legible en escritorio, lista vertical en 400 px, código visible, foco claro y estados accesibles. Añadir prefers-reduced-motion y espacio para el podio; no reducir quince nombres hasta hacerlos ilegibles. Cubre CA-08, CA-10, CA-12, CA-16.

- [x] T12 · **Entrada automática y secreto QR.** En static/race.js implementar la función de entrada: leer id/fragmento, retirar secreto de la barra, conservarlo solo hasta ocupar plaza o cerrar lobby y consultar el roster con cuerpo/cabecera según contrato. Recuperar primero /me cuando ya exista cookie. Ocupar un nombre sin cuenta ni confirmación del profesor; tratar 409 ocupado sin recuperar accesos ajenos. Probar QR obsoleto y recarga previa a seleccionar nombre. Cubre CA-01–CA-04, CA-11, CA-14, CA-20, CA-24.

- [x] T13 · **Espera y actualización del alumno.** En race.js implementar un único bucle de estado: polling de un segundo, máximo una petición pendiente, backoff 2/4/8 y actualización al volver a la página. Usar serverNow/startsAt/expiresAt para la cuenta atrás visual; el estado confirmado manda sobre el reloj local. No reabrir entradas después de Go ni intentar reponer cookies perdidas. Cubre CA-04, CA-05, CA-07, CA-08, CA-11, CA-20, CA-25.

- [x] T14 · **Envío y reintento de la misma operación.** En race.js implementar la función de envío con cookie y X-Race-CSRF, UUID y cuerpo persistidos temporalmente. Deshabilitar el botón mientras se resuelve y reutilizar operación/cuerpo ante fallo de transporte o 503. No generar un intento nuevo en una repetición automática ni reenviar automáticamente códigos rechazados. Reconocer 202 unconfirmed y errores de confirmación incierta: consultar /me, mostrar intento gastado y no crear otro envío automáticamente. Comprobar fallo 422, 429 sin intentos y recuperación de respuesta perdida. Cubre CA-06–CA-08, CA-11, CA-14, CA-19, CA-20, CA-22, CA-23.

- [x] T15 · **Resultado y limpieza del alumno.** En race.js representar éxito, error, sin intentos, acceso perdido, retirada por profesor y cierre. Borrar el código pendiente al obtener resultado/cerrar/caducar; no imprimirlo en consola ni almacenar el permiso en localStorage. Recuperar el propio resultado de lectura tras el último éxito sin otra evaluación de código. Cubre CA-07, CA-11, CA-13, CA-14, CA-17, CA-20, CA-22, CA-23, CA-25.

## Presentación del profesor e integración con el panel

- [x] T16 · **HTML de presentación.** Crear static/race-display.html con QR/enlace alternativo, parrilla, Go, código, resultados, cierre confirmado, animación y podio. No incluir credenciales en enlaces estáticos. Dar etiquetas, navegación por teclado y regiones de estado comprensibles. Cubre CA-01, CA-02, CA-04, CA-08–CA-10, CA-14, CA-16.

- [x] T17 · **Acceso del profesor en la presentación.** En static/race-display.js leer el token del fragmento inicial, guardarlo en sessionStorage y retirarlo de la barra. Usarlo solo en cabeceras hacia rutas privadas del mismo origen. Obtener el QR mediante fetch autorizado y blob, no por una URL con token. Fallos 401 no muestran código ni controles utilizables. Cubre CA-02, CA-11, CA-14, CA-17.

- [x] T18 · **Actualización y fases de la presentación.** En race-display.js implementar la representación de lobby, cuenta atrás, registro abierto y cierre con un único polling y cancelación de temporizadores. Código solo en fase abierta; refrescar o abrir otra ventana conserva startsAt. No iniciar la llegada completa por recibir el primer registro. Cubre CA-04–CA-06, CA-08–CA-11, CA-14.

- [x] T19 · **Go sin duplicaciones.** En race-display.js implementar la acción Go, impedir doble envío local y respetar la respuesta idempotente del backend. Mostrar vacío si no hay ocupantes, grupo fijado tras éxito y cuenta atrás común. Un error o respuesta perdida se resuelve consultando estado, no creando otra clase. Cubre CA-04, CA-05, CA-11, CA-24.

- [x] T20 · **Retirada en lobby y cierre manual.** En race-display.js implementar retirar plaza solo antes de Go y confirmar/cancelar Terminar carrera. Mostrar que quitar una ocupación no autentica al próximo visitante; tras Go no hay liberaciones ni reemplazos. Cuando alguien agota intentos, ofrecer cierre sin esperarle. Consultar estado ante carrera con último éxito o cierre concurrente. Cubre CA-03, CA-04, CA-09, CA-10, CA-13, CA-20, CA-24.

- [x] T21 · **Llegada y podio desde el resultado.** En race-renderer.js implementar una función de secuencia final de unos ocho segundos que recorra los puestos confirmados del servidor. No sortear posiciones ni decidirlas por animationend. Podio de cero a tres finalistas y lista completa; no cruzan los sin registrar. Con movimiento reducido o recarga de carrera cerrada, mostrar resultado directamente. Cubre CA-06, CA-09–CA-12, CA-16.

- [x] T22 · **Opción de carrera en el panel.** Añadir a static/profesor.html el control Carrera de Halloween al crear clase y la entrada a presentación. Mantener disponible la clase normal y su formulario actual, sin mezclar modos por un parámetro enviado al registrar. Cubre CA-01, CA-04, CA-13, CA-18.

- [x] T23 · **Navegación del panel.** Modificar static/profesor.js para preparar carrera por su ruta privada cuando se elija ese modo y abrir su presentación. Representar fase de carrera sin mostrar código anticipado. Preservar creación, consulta, descarga, cierre y borrado normales; no copiar el token del profesor al QR o enlace del alumno. Cubre CA-01, CA-04, CA-11, CA-13, CA-14.

## Quince personajes: una tarea por dibujo

Revisar la imagen final y el prompt de cada referencia, sin ejecutarlo como instrucción. Dibujar un SVG original de personaje sentado en su kart, con al menos dos rasgos reconocibles, estilo común, sin scripts, eventos o recursos externos. Guardar solo el activo indicado; la documentación conjunta se completa en T39. Cada tarea requiere revisión visual con nombre y referencia y cubre CA-01, CA-12, CA-16, CA-18.

- [x] T24 · **Diego Molero: node-jack.** Crear static/race-characters/node-jack.svg a partir de exercises/halloween/node-jack/. Comprobar que se distingue de los otros pilotos y conserva rasgos de su personaje, sin inferir apariencia real del alumno. Cubre CA-01, CA-12, CA-16, CA-18.

- [x] T25 · **Diego Torres: espantatorres.** Crear static/race-characters/espantatorres.svg a partir de exercises/halloween/espantatorres/. Comprobar que se distingue de los otros pilotos y conserva rasgos de su personaje, sin inferir apariencia real del alumno. Cubre CA-01, CA-12, CA-16, CA-18.

- [x] T26 · **Ella Deyavorsky: mr-wobble.** Crear static/race-characters/mr-wobble.svg a partir de exercises/halloween/mr-wobble/. Comprobar que se distingue de los otros pilotos y conserva rasgos de su personaje, sin inferir apariencia real del alumno. Cubre CA-01, CA-12, CA-16, CA-18.

- [x] T27 · **Esther Patino: hombre-lobo-esther.** Crear static/race-characters/hombre-lobo-esther.svg a partir de exercises/halloween/hombre-lobo-esther/. Comprobar que se distingue de los otros pilotos y conserva rasgos de su personaje, sin inferir apariencia real del alumno. Cubre CA-01, CA-12, CA-16, CA-18.

- [x] T28 · **Jimena Duran: ajolote.** Crear static/race-characters/ajolote.svg a partir de exercises/halloween/Ajolote/. Comprobar que se distingue de los otros pilotos y conserva rasgos de su personaje, sin inferir apariencia real del alumno. Cubre CA-01, CA-12, CA-16, CA-18.

- [x] T29 · **Jose Miguel: jack.** Crear static/race-characters/jack.svg a partir de exercises/halloween/jack/. Comprobar que se distingue de los otros pilotos y conserva rasgos de su personaje, sin inferir apariencia real del alumno. Cubre CA-01, CA-12, CA-16, CA-18.

- [x] T30 · **Luis Duque: vampire-king-leo.** Crear static/race-characters/vampire-king-leo.svg a partir de exercises/halloween/Vampire-king-Leo/. Comprobar que se distingue de los otros pilotos y conserva rasgos de su personaje, sin inferir apariencia real del alumno. Cubre CA-01, CA-12, CA-16, CA-18.

- [x] T31 · **Manuel Diaz: fantasmiko.** Crear static/race-characters/fantasmiko.svg a partir de exercises/halloween/fantasmiko/. Comprobar que se distingue de los otros pilotos y conserva rasgos de su personaje, sin inferir apariencia real del alumno. Cubre CA-01, CA-12, CA-16, CA-18.

- [x] T32 · **Maria Osipuk: mimo.** Crear static/race-characters/mimo.svg a partir de exercises/halloween/mimo/. Comprobar que se distingue de los otros pilotos y conserva rasgos de su personaje, sin inferir apariencia real del alumno. Cubre CA-01, CA-12, CA-16, CA-18.

- [x] T33 · **Meghan Martin: fantasma.** Crear static/race-characters/fantasma.svg a partir de exercises/halloween/fantasma/. Comprobar que se distingue de los otros pilotos y conserva rasgos de su personaje, sin inferir apariencia real del alumno. Cubre CA-01, CA-12, CA-16, CA-18.

- [x] T34 · **Miguel Rodriguez: yomi.** Crear static/race-characters/yomi.svg a partir de exercises/halloween/yomi/. Comprobar que se distingue de los otros pilotos y conserva rasgos de su personaje, sin inferir apariencia real del alumno. Cubre CA-01, CA-12, CA-16, CA-18.

- [x] T35 · **Raul Santamaria: calabaza-aterradora.** Crear static/race-characters/calabaza-aterradora.svg a partir de exercises/halloween/calabaza-aterradora/. Comprobar que se distingue de los otros pilotos y conserva rasgos de su personaje, sin inferir apariencia real del alumno. Cubre CA-01, CA-12, CA-16, CA-18.

- [x] T36 · **Sergio Cortes: harry-universe.** Crear static/race-characters/harry-universe.svg a partir de exercises/halloween/harry-universe/. Comprobar que se distingue de los otros pilotos y conserva rasgos de su personaje, sin inferir apariencia real del alumno. Cubre CA-01, CA-12, CA-16, CA-18.

- [x] T37 · **Sergio Moras: edgar-allan-poe.** Crear static/race-characters/edgar-allan-poe.svg a partir de exercises/halloween/edgar-allan-poe/. Comprobar que se distingue de los otros pilotos y conserva rasgos de su personaje, sin inferir apariencia real del alumno. Cubre CA-01, CA-12, CA-16, CA-18.

- [x] T38 · **Victor Chang: vicwolf.** Crear static/race-characters/vicwolf.svg a partir de exercises/halloween/vicwolf/. Comprobar que se distingue de los otros pilotos y conserva rasgos de su personaje, sin inferir apariencia real del alumno. Cubre CA-01, CA-12, CA-16, CA-18.

## Verificación, documentación y entrega

- [x] T39 · **Créditos y correspondencia de los dibujos.** Completar docs/RACE-ASSETS.md con los quince nombres, slug exacto, fuente, rasgos y paleta de cada adaptación. Contrastar con el roster del backend; no mantener una segunda lista de alumnos dentro de JavaScript. Registrar autoría de la adaptación y atribuciones de cualquier recurso reutilizado; si falta derecho o referencia, resolver ese activo antes de darlo por terminado. Cubre CA-01, CA-12, CA-18.

- [x] T40 · **Ensayo completo del juego.** En navegador y copia ficticia, recorrer preparación → QR/enlace → nombre → kart listo → Go → código → resultado → llegada → podio. Probar que entrar antes no da puesto, que el orden corresponde al servidor y que no se anima la carrera completa antes del cierre. Repetir con cero ocupantes al iniciar, uno/dos/tres finalistas, un ausente y una plaza sin intentos que requiere cierre manual. Registrar capturas y pasos. Cubre CA-01–CA-10, CA-12, CA-16, CA-19, CA-23, CA-24.

- [x] T41 · **Fallos, reintentos y accesos en integración.** Probar dos ventanas del profesor, recarga durante cuenta atrás y registro, desconexión y respuesta perdida del último éxito, 503 antes de reservar, 202 con reserva sin resultado y expiración. Verificar que repetir una reserva tras fallo o reinicio no vuelve a evaluar ni devuelve consumo. Con éxito y operación ya guardados, probar a 7199 s, exactamente 7200 s y después: /me y /attempt recuperan el resultado solo antes del límite; desde el límite rechazan aun con cookie conservada, sin resultado privado ni nueva evaluación de código. Citar la prueba automatizada de frontera del backend 008 además del ensayo de interfaz. Repetir operation_id con otro código sin evaluación nueva; comprobar retiro de asistencia sin resucitar éxito guardado. Revisar red: ninguna respuesta del alumno contiene código o token del profesor; ningún enlace/Referer/log contiene permisos del alumno. Borrar cookies después de Go informa de pérdida y no entrega otro acceso. No reimplementar los tests de transacción del backend: ejecutar y citar su evidencia. Cubre CA-05–CA-08, CA-11, CA-13–CA-15, CA-17, CA-19–CA-25.

- [x] T42 · **Móvil, teclado y movimiento reducido.** Verificar las dos pantallas a unos 400 px y escritorio, zoom, tabulación, foco al cambiar de fase, contraste y lectura de estados. Con prefers-reduced-motion confirmar que hay clasificación y podio sin desplazamientos. Mostrar título con caracteres HTML como texto, sin ejecución. Comprobar que el código sigue legible y que el formulario puede completarse en menos de treinta segundos desde verlo, sin esperar a la animación. Cubre CA-05, CA-08, CA-10, CA-12, CA-14, CA-16.

- [x] T43 · **QR real y prueba acotada de convivencia.** Sobre copia con datos ficticios, leer el QR con móvil y abrir su equivalente en otro navegador. Si se usa túnel real, verificar entrada/origen/cookie HTTPS y detenerlo al terminar. Ejecutar la evidencia prevista del backend de quince clientes con una IP más cincuenta peticiones adversarias: máximo tres comprobaciones para la plaza atacante y sin presupuesto o ban colectivo para otras. Probar ocupación hostil de los quince nombres y documentar que sí puede bloquear el lobby, aunque el máximo sea 45 checks. No afirmar protección contra inundaciones generales ni usar sesiones ajenas. Cubre CA-02, CA-14–CA-16, CA-19–CA-25.

- [x] T44 · **Regresión y conservación final.** Ejecutar la suite completa sobre la copia y comparar con T03. Verificar clases normales, precedencia de errores, exportación y datos de referencia; revisar diferencias de esquema solo aditivas y originales de Halloween intactos. Actualizar únicamente expectativas de versión que las enmiendas realmente cambiaron, sin eliminar comprobaciones de reglas o historial para obtener verde. Registrar comando, versiones, resultados y cualquier fallo corregido por su causa. Cubre CA-13–CA-15, CA-17, CA-18, CA-21, CA-25.

- [x] T45 · **README de uso.** Actualizar README.md con QR y alternativa clicable, lobby automático, Go, tres envíos totales, cierre, personajes y podio. Explicar la pérdida de acceso después de Go, el acaparamiento posible de nombres y el alcance diferente de los bloqueos normal/carrera una sola vez de forma concreta. Documentar qrcode y su transitiva Windows sin prometer que generar SVG equivale a verificar el escaneo. Cubre CA-02–CA-10, CA-14–CA-20, CA-24, CA-25.

- [x] T46 · **Arquitectura vigente.** Actualizar docs/ARCHITECTURE.md con frontend/QR consumiendo el backend de seguridad, propietario de las transacciones, rutas antiguas cerradas, permisos de lectura/escritura y limpieza. Registrar la dependencia 008 por sus enlaces reales y la librería local. No presentar como función implementada algo que solo existe en un documento. Cubre CA-11, CA-13–CA-15, CA-17–CA-22, CA-25.

- [x] T47 · **Estado del manual.** Actualizar AGENTS.md con fase y evidencia reales de 007, comandos y dependencia adicional, sin borrar aprobaciones anteriores ni atribuir pruebas a Miguel. Separar implementado, probado por el agente, probado por Miguel y revisiones pendientes. Cubre CA-13, CA-17, CA-18.

- [x] T48 · **Evidencia antes de la prueba de Miguel.** Registrar en este tasks.md resultados por criterio, capturas/referencias y limitaciones. Parar servidores y túneles creados y verificar sus puertos libres; conservar la copia ficticia, sin servicios activos, para T49. Conservar solo evidencia necesaria sin permisos, códigos, IPs o token del profesor. No marcar verificación visual o escaneo como hechos si no se ejecutaron. Cubre CA-01–CA-25.

- [ ] T49 · **Prueba y revisión final de Miguel.** Usar la copia ficticia conservada para presentar a Miguel la carrera y que pruebe la experiencia contra la spec. Registrar su respuesta real y resolver los fallos antes de dar el resultado por terminado. Tras su prueba, parar únicamente los servidores y túneles propios, comprobar sus puertos libres y eliminar la copia y las bases ficticias. No confundir aprobar estas tareas con haber jugado, aprobado el resultado o aprobado las PRs de otros. Cubre CA-01–CA-25.

- [ ] T50 · **Entrega de la PR existente de 007.** Actualizar la PR draft abierta en T02, sin crear otra rama o PR al terminar. Comprobar base staging, diff limitado a 007 sin backend 008 o trabajo de 006, commits pequeños, assignee mglnglxx y Closes #325. Verificar también Development. Descripción con comportamiento y evidencia real; solicitar los revisores autorizados, incluido sergiocortessat, y conservar el requisito de dos revisiones vigentes. No cambiar bases para encadenar PRs ni hacer merge con aprobaciones insuficientes. Esta tarea no ejecuta Git ahora. Cubre CA-01–CA-25.

## Matriz de cobertura y evidencia esperada

La cobertura backend de T01 se acredita con resultados de la tarea 008, no marcando su implementación como si se hubiera hecho en 007. Las comprobaciones de interfaz de abajo la complementan.

| Criterios | Tareas de 007 y referencia necesaria |
| --- | --- |
| CA-01–CA-04 | T01, T09–T13, T16–T20, T22–T23, T24–T40; contrato de plazas/entrada/cierre de altas de 008. |
| CA-05–CA-08 | T01, T13–T15, T18–T21, T40–T42; contrato de fase, orden y operaciones de 008. |
| CA-09–CA-12 | T01, T15–T21, T24–T42; cierre, lecturas y datos confirmados del backend. |
| CA-13–CA-15 | T01–T04, T08, T15, T17–T23, T41–T44; rutas antiguas, retiro y aislamiento de intentos verificados por 008. |
| CA-16–CA-18 | T03–T11, T15–T18, T21–T22, T24–T48; enmiendas, datos temporales, SVG, uso y accesibilidad. |
| CA-19–CA-25 | T01–T04, T12–T15, T19–T20, T41, T43–T48; presupuesto/reintentos/caducidad en backend y su integración visible. |
| Todos | T49 revisión real de Miguel y T50 publicación de evidencia; no sustituyen las pruebas anteriores. |

## Revisión interna de las tareas

- Se preserva la división del plan: el backend de seguridad no se implementa ni se contabiliza dos veces. T01 exige contrato y evidencia reales; no una aprobación supuesta de 008.
- Las pruebas automatizadas nuevas del QR se preparan antes del generador y su ruta. Las verificaciones visuales tienen pasos y resultados observables, sin tests que solo repliquen la estructura del HTML.
- Los quince personajes son quince activos y tareas individuales; no una casilla genérica que se pueda completar dejando varios sin dibujar.
- T02 abre la rama y PR draft antes de implementar; T50 actualiza esa misma PR para revisión. No se pospone el inicio Git hasta la entrega final.
- La caducidad se comprueba antes de recuperar éxitos u operaciones guardadas; T41 exige pruebas en ambos lados del límite y exactamente en él, también conservando la cookie.
- Los reintentos conservan su UUID y cuerpo; no se confunde error de red con otro envío o permiso para reponer intentos. Se comprueba especialmente la respuesta del último éxito tras el cierre automático.
- La entrada automática reemplaza toda verificación individual del profesor. El acaparamiento del lobby y la pérdida de acceso tras Go se prueban y explican; no se presentan como problemas resueltos.
- Se conserva la copia ficticia hasta la prueba de Miguel; los servicios se detienen entre ensayos y la limpieza definitiva se hace después de esa prueba.
- Ninguna casilla de este archivo se marca por haber redactado el documento. La suite, el escaneo real, el juego por Miguel y la publicación son acciones futuras con evidencia propia.

## Resultados de ejecución

Implementación local ejecutada el 2026-10-25. Resultados y cobertura por los 25 criterios en [evidence.md](evidence.md); revisión contra documentos y constitución en [review.md](review.md). T02/T50 siguen pendientes de publicación, T43 de cámara física y T49 de prueba del resultado por Miguel.

## Aprobación de las tareas

2026-10-24: Miguel indicó «Approved. Let’s prepare security spec 008 and review it properly before I approve it». Aprueba las cincuenta tareas de 007 con las dos correcciones revisadas. La spec 008 se prepara para aprobación separada; no se inicia código ni se autoriza su enmienda por anticipado.

Corrección coordinada de fallo técnico, pendiente de aprobación con 008: T14 y T41 incorporan unconfirmed y conservación del intento; no se añaden tareas de implementación del backend en 007 ni se ejecuta ninguna casilla.

Aprobación posterior de la corrección, 2026-10-24: Miguel aprobó la spec y plan 008 corregidos y pidió preparar sus tareas. Se aprueba también la coordinación del caso de fallo con este documento, sin iniciar implementación.


## Ejecución autorizada 2026-10-25

Miguel aprobó el resultado local de 008 y pidió implementar 007 según sus tareas. Se continúa localmente con la excepción de publicación ya autorizada: copia nueva 007-local-implementation/asistenciapp sobre la base aprobada 008, sin bases reales. T02 y T50 mantienen pendiente su parte Git hasta poder publicar un diff aislado a staging. La autorización de ejecución incluye el añadido exacto P3/4.1 y qrcode==8.2 ya descritos y aprobados en el plan, sin ampliar dependencias.

T01/T03–T05: base aprobada 008 disponible (issue #328, sin PR publicada), suite inicial nueva 218 passed in 5.28s; copia separada y manifiestos guardados. Enmienda exacta 4.1 del plan aplicada y qrcode==8.2 instalado sin extras. T02 pendiente solo en publicación, según autorización local vigente.

Implementación y revisión en curso: T06 red por módulo QR ausente; T07/T08 green con 8 pruebas. T09–T39 implementadas; quince imágenes originales revisadas y SVG dibujados. Ensayo inicial de tres alumnos: llegada 1/2/3 según confirmación, retirada recalcula puestos y no reabre. Ensayo adicional de navegador: 17 comprobaciones pasan (503, éxito con respuesta perdida, 202, 422, 410, cero/uno/dos finalistas, acceso perdido e inyección como texto). 400 px sin overflow; movimiento reducido sin animaciones. Suite completa nueva: 226 passed in 5.94s, incluida convivencia de quince clientes y cincuenta envíos. T43 mantiene pendiente el escaneo físico con móvil; no se da por ejecutado mediante la generación SVG.


Cierre de revisión local: se repitieron las 17 comprobaciones de race-review.js después de serializar las acciones; pasan. race-concurrency.js aporta ocho comprobaciones y race-queued-action.js tres, con un POST y máximo una petición simultánea. Llegada de tres finalistas comprobada con 5800/6900/8000 ms. Apple Vision decodificó el QR local, sin atribuir cámara física. Documentación y quince créditos completos. Los servidores propios se detuvieron y los puertos 8767/8000 quedaron libres. Véase la evidencia para la ejecución final de pytest, conservación de los 43 originales y pendientes humanos/Git.

Suite final después de completar documentación y enlaces: **226 passed in 5.71s**. Los cuatro archivos JavaScript pasan node --check. No se marcó T43/T49 ni el momento Git como completados.


## Prueba de Miguel · 2026-10-25

Miguel abrió la app de ensayo y confirmó «funciona!» tras las instrucciones para completar el recorrido con un participante. Se registra esa confirmación del recorrido básico. No acredita todavía escaneo físico, varios participantes reales ni el cierre de todas las tareas de entrega. La copia y su servidor se conservan temporalmente por su petición de seguir probando.


## Prueba de QR de Miguel · 2026-10-25

Se abrió la copia ficticia mediante un túnel HTTPS temporal. El panel respondió 200 con verificación TLS del sistema, sin desactivar certificados. Tras las instrucciones de escanear, entrar, dar Go e introducir el código desde el teléfono, Miguel confirmó «it works!». Queda verificado el recorrido móvil con cámara real. T43 se completa junto con las pruebas de convivencia y acaparamiento ya ejecutadas de 008. Servidor y túnel propios detenidos después de la prueba. Se conserva el código local para revisión y publicación; no se atribuye aún una aprobación final de todos los criterios ni una PR publicada.


## Publicación autorizada · 2026-10-26

Miguel ordenó «sube todas las prssss omggg». Esta instrucción sustituye la espera de publicación condicionada a las predecesoras: se publica esta tarea ahora con base fija staging y sus dependencias pendientes explícitas. La PR es [#355](https://github.com/venturars/neoland-102026/pull/355), asignada a mglnglxx. No se autoriza merge sin las revisiones requeridas. Las aprobaciones y pruebas anteriores no se atribuyen a compañeros. Se conservan commits separados por tarea; los cambios acumulados de la base se explican en la descripción y se ofrece comparación exclusiva del paso.
