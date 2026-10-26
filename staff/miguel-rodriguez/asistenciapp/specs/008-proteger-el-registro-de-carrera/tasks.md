# Tareas 008 · Proteger el registro de carrera

Estado: spec, plan y tareas aprobados expresamente por Miguel el 2026-10-24; ejecución local autorizada. Implementada y verificada en copia local autorizada el 2026-10-24; 218 pruebas de aplicación pasan; también pasan las dos reproducciones originales del review. Resultado local aprobado por Miguel el 2026-10-25; publicada en PR #354 el 2026-10-26, pendiente de revisión e integración. Enmienda 4.0 aplicada en esta rama; la constitución del checkout original no se modificó durante la implementación local. [Evidencia por criterio](evidence.md).

## Reglas de ejecución

- Una tarea cada vez; marcar [x] solo después de ejecutarla y registrar evidencia. Cada tarea de prueba se prepara antes del código que verifica; usar selecciones concretas para red/green y ejecutar la suite completa al final.
- T01–T04: issue real, baseline y enmienda aprobada. Excepción posterior aprobada por Miguel: «Proceed locally; publish later». T02 permite implementar/probar en una copia separada mientras se integran las predecesoras; su rama/PR queda pendiente. Se conserva la puerta de publicación exclusiva a staging, sin diff acumulado ni cambio de base.
- Solo nuestra app y su seguridad 008. No modificar ejercicios/otros alumnos, main, bases reales, requisitos de 006 ni frontend/QR de 007. Las pruebas usan copia y datos ficticios.
- A confirma consumo antes de evaluar; B solo puede ejecutarla una vez el creador local de una reserva nueva. Repetir reserved devuelve estado sin evaluación. Sin leases, devolución de intentos o reanudación automática tras caída.
- No usar helpers que confirmen dentro de otra transacción. No reemplazar el límite 3/45 de evaluaciones con un test que solo cuente resultados completados. Los fallos antes de A y después de A tienen expectativas distintas.

## Preparación Git y referencia

- [x] T01 · **Issue independiente.** Comprobar si ya existe la issue de 008. Si falta, usar el proceso de create-issue del repositorio: presentar título inglés y assignee mglnglxx y crearla con la autorización correspondiente. Registrar enlace real sin reutilizar #325 ni inventar número. Resultado: una issue que describe solo la seguridad 008 y su comprobación. Cubre CA-24.

- [x] T02 · **Rama y PR draft antes de código.** Comprobar staging actualizado, estado local y base necesaria; conservar archivos ajenos. Presentar rama <issue>-feat-protect-race-checkins, base staging, chore: open #<issue>, título/assignee/Closes y ejecutar el momento autorizado. Publicar una PR draft aislada y enlazar también Development cuando staging contenga la base necesaria. Miguel aprobó implementar y probar antes únicamente en una copia local separada; no autoriza una PR acumulada. Si faltan predecesoras integradas, no publicar un diff acumulado ni cambiar base para encadenar PRs. Registrar la PR real y mantenerla durante todo el trabajo. Cubre CA-23, CA-24.

- [x] T03 · **Baseline ficticio.** Preparar copia sin bases reales, .venv ni cachés, con entorno autorizado y base temporal. Registrar versiones y suite actual, datos/fechas y definiciones de tablas normales y seguridad 006. Conservar referencia para comparación final; no declarar las 145 pruebas antiguas como ejecución nueva. No arrancar servicios innecesarios. Cubre CA-21, CA-23.

- [x] T04 · **Enmienda antes del código afectado.** Comprobar la ratificación del texto exacto de plan.md §8 por Miguel antes de aplicarlo a docs/CONSTITUTION.md. Si no consta, esta puerta queda pendiente hasta resolver esa ratificación, sin deducirla de la redacción de tareas. Aplicar una sola vez la 4.0 con fecha real e historial íntegro, revisar numeración si la base cambió y no aplicar la 4.1/QR de 007. Cubre CA-10, CA-21, CA-23.

## Dominio y almacenamiento

- [x] T05 · **Pruebas de dominio primero.** Preparar tests/test_race_domain.py para fases, 3/7200 segundos, cierre que nunca reabre, presupuesto 3 y normalización de quince nombres/personajes de 007. Registrar fallos por funcionalidad ausente. No importar Flask, acceder a archivos de ejercicios o usar un reloj global dentro de las reglas. Cubre CA-01, CA-02, CA-04, CA-05, CA-07, CA-08, CA-09, CA-16, CA-19.

- [x] T06 · **Roster único.** Crear asistencia/domain/roster.py: quince claves únicas, nombres y character_slug acordados en 007, con correspondencia por normalización actual. Verificar las pruebas de roster de la tarea anterior; no crear otra lista ejecutable en frontend ni depender de imágenes aún inexistentes para validar el roster. Cubre CA-01, CA-02.

- [x] T07 · **Reglas y errores de carrera.** Crear asistencia/domain/race.py con fases, límites y decisiones puras descritas en el plan. Dar estados/errores claros y reloj recibido; comprobar salida/cierre/caducidad y rechazo sin presupuesto. Hacer pasar únicamente las pruebas de dominio pertinentes; los tests posteriores pueden seguir pendientes. Cubre CA-04, CA-05, CA-07, CA-08, CA-09, CA-16, CA-19.

- [x] T08 · **Pruebas de almacenamiento primero.** Preparar tests/test_race_storage.py con archivo temporal para claves únicas/foráneas, tres números de intento, estados reserved/completed, resultado nulo solo en reserved, borrado de referencias y SQL sin commits internos. Preparar comprobación de esquema aditivo, sin alterar filas/definiciones anteriores. Cubre CA-01, CA-02, CA-07, CA-08, CA-15, CA-17, CA-20, CA-21, CA-23.

- [x] T09 · **Esquema aditivo.** Modificar solo el esquema de asistencia/storage/sqlite.py para las cuatro tablas e índices del plan. Activar restricciones y referencias ON DELETE SET NULL indicadas. Inicializar fuera de transacciones de acciones; verificar repetición de inicialización y conservación de datos normales. No modificar los helpers normales para que hagan transacciones de carrera. Cubre CA-01, CA-02, CA-08, CA-15, CA-17, CA-20, CA-21, CA-23.

- [x] T10 · **Conexión de carrera.** Crear la función de conexión en asistencia/storage/races.py con foreign_keys, synchronous=FULL, timeout=0.5 y control explícito acordado. Verificar cierre y configuración sobre conexiones nuevas, sin alterar la conexión normal ni compartir conexiones entre hilos. Cubre CA-08, CA-15, CA-18, CA-22, CA-23.

- [x] T11 · **Lecturas SQL concretas.** Añadir a storage/races.py consultas de modo, carrera, plaza, hash, operación, recuento y clasificación por ID. Todas usan parámetros y conexión recibida; no deciden permisos ni abren commits. Verificar cero filas, límites por carrera/plaza y que el listado de resultados no dependa de la hora del teléfono. Cubre CA-06, CA-07, CA-08, CA-12, CA-13, CA-14, CA-15, CA-18.

- [x] T12 · **Escrituras SQL sin commit interno.** Añadir a storage/races.py primitivas de crear carrera/plazas, ocupar/revocar, fijar salida, insertar reserva, completar resultado, insertar/quitar asistencia, cerrar y limpiar. Verificar en tests que el llamante puede confirmar o revertir cada transacción sin commits escondidos; la restricción de tres incluye reserved y completed. Cubre CA-01, CA-02, CA-03, CA-04, CA-08, CA-15, CA-16, CA-17, CA-20.

## Acciones de preparación y ciclo de vida

- [x] T13 · **Pruebas de preparación y plazas primero.** Preparar en tests/test_race_usecases.py los casos de preparar, consultar lobby, recuperar propia plaza, retirar y dar Go, con permisos de plaza ficticios. Crear también tests/test_race_concurrency.py para ocupación simultánea y barrera join/start antes de esas acciones; la autenticación HTTP del profesor se prueba en T32. Cubrir pérdida de respuesta de join, carrera ajena y grupo vacío. Usar los criterios y contratos del plan, no valores dependientes del orden accidental de hilos. Cubre CA-01, CA-02, CA-03, CA-04, CA-05, CA-06, CA-18.

- [x] T14 · **Preparar carrera.** Implementar la acción prepare en asistencia/usecases/races.py: sesión, secretos, quince plazas y caducidad en una sola transacción. No llamar a storage.create_session que confirma internamente. Retornar datos autorizables sin código anticipado; comprobar que una nueva carrera no acepta accesos anteriores. Cubre CA-01, CA-05, CA-18, CA-21.

- [x] T15 · **Consultar lobby.** Implementar la acción de lobby con secreto vigente, fase y caducidad. Devolver nombres/personajes/disponibilidad sin códigos, permisos de otros ni asistencia privada. La ausencia de la futura race.html no impide probar esta acción. Cubre CA-02, CA-04, CA-05, CA-06, CA-24.

- [x] T16 · **Ocupar plaza.** Implementar join: ocupación y hash de permiso en una transacción; un competidor obtiene 409. Con acceso propio vigente devolver la misma plaza sin cambiar nombre. El secreto se entrega al borde solo para fijar cookie después del commit, nunca como JSON público. Si se pierde la respuesta sin cookie no recuperar permiso con solo repetir nombre. Cubre CA-02, CA-03, CA-06, CA-18, CA-21.

- [x] T17 · **Retirar ocupación en lobby.** Implementar release antes de Go: revocar acceso y liberar la misma fila, sin borrar/recrear plaza o consumo. Verificar que la cookie anterior no controla la siguiente ocupación y que después de Go no se libera ni repone acceso. Cubre CA-03, CA-04, CA-06, CA-09.

- [x] T18 · **Dar salida una sola vez.** Implementar start: exigir ocupantes, fijar grupo/starts_at y borrar secreto de entrada en una transacción. Repetir conserva la salida; cierre/caducidad prevalecen. Verificar barrera join/start y reloj obtenido después del bloqueo. Cubre CA-04, CA-05, CA-09, CA-16, CA-18.

- [x] T19 · **Pruebas de caducidad y lecturas primero.** Preparar tests en test_race_usecases.py para límites 7199/7200/7201, limpieza global al siguiente tráfico/arranque, lectura de éxito/operación y datos de profesor tras caducar. Incluir reserved sin resultado y sesiones cerradas antes del plazo; comprobar que ninguna lectura prolonga el acceso. Cubre CA-06, CA-14, CA-18, CA-19, CA-20, CA-21.

- [x] T20 · **Limpieza de carreras.** Implementar cleanup con búsqueda indexada y escritura solo si hay trabajo; revalidar reloj bajo bloqueo. Cerrar vencidas y borrar secretos/accesos/operaciones, incluidas reserved, sin borrar asistencias/plazas/blacklist ni reabrir clases. Confirmar limpieza antes de traducir un rechazo; si falla no admitir accesos vencidos. Cubre CA-09, CA-16, CA-18, CA-19, CA-20, CA-21.

- [x] T21 · **Lecturas de profesor y plaza.** Implementar teacher_state y me con instantánea coherente y caducidad anterior a resultados privados. Profesor: roster/orden, enlace solo lobby y código solo open. Alumno: solo personaje, fase, tiempos, consumo y resumen propio de hasta tres operaciones; reserved se presenta unconfirmed. Retirada prevalece sobre éxito antiguo. Cubre CA-05, CA-06, CA-09, CA-14, CA-17, CA-18, CA-19, CA-21, CA-24.

## Reserva duradera y confirmación

- [x] T22 · **Pruebas de reserva A primero.** Preparar tests de attempt en test_race_usecases.py y ampliar test_race_concurrency.py antes de la función: permiso y origen en el caso de uso, fase, contenido repetido, operación inválida, código mal formado, agotamiento y creación durable de reserved. Espiar el validador para exigir cero llamadas en A; nunca sustituir por un test que solo cuente filas. Cubre CA-06, CA-07, CA-08, CA-09, CA-11, CA-13, CA-14, CA-15, CA-19, CA-22.

- [x] T23 · **Reserva A y recuperación.** Implementar la función interna de reserva de usecases/races.py con BEGIN IMMEDIATE y orden del plan. Una operación existente nunca da derecho a B: completed recupera resultado, reserved devuelve 202 y contenido cambiado 409. Incluir reserved en recuento; confirmar consumo antes de devolver al creador local el derecho de ejecutar B una vez. Commit incierto o excepción de A: no entrar en B. Formatos inválidos completan su fallo sin evaluar. Cubre CA-06, CA-07, CA-08, CA-09, CA-11, CA-13, CA-14, CA-15, CA-19, CA-22.

- [x] T24 · **Pruebas de B y fallos primero.** Preparar en test_race_usecases.py y test_race_concurrency.py las pruebas de finalización/fault injection antes de B: revalidación tras A, tercera reserva correcta, cierre/retirada/caducidad entre A y B, éxito previo de misma plaza, rollback tras evaluar y commit incierto. Incluir caída antes de evaluar, después de evaluar y después de commit real; una reserva existente no obtiene derecho a volver a evaluar. Mantener el bloqueo SQL con otra conexión, avanzar el reloj inyectado hasta la caducidad mientras B espera y liberarlo dentro del timeout: B debe leer la hora nueva y no evaluar. Usar barreras, sin depender de sleeps arbitrarios. Cubre CA-07, CA-08, CA-09, CA-13, CA-14, CA-15, CA-16, CA-17, CA-18, CA-19, CA-22.

- [x] T25 · **Confirmar B una vez.** Implementar función interna de finalización: solo la invocación creadora de A la llama una vez, sin bandera o permiso recuperable del cliente. Bajo BEGIN IMMEDIATE revalidar estado/reloj, sin exigir presupuesto libre otra vez a la tercera reserva. Evaluar una vez; completar fallo o resultado/asistencia/cierre juntos. Rollback solo de B deja A gastada; no reintentar B, soltar reservas o añadir leases. Clasificar por ID de confirmación. Cubre CA-05, CA-07, CA-08, CA-09, CA-13, CA-14, CA-15, CA-16, CA-17, CA-18, CA-19, CA-22.

- [x] T26 · **Coordinar attempt y sus respuestas.** Implementar la acción pública attempt usando reserva A y, solo para una reserva nueva confirmada por esa invocación, B. Propagar 202 con intento gastado, 503 antes de reserva y error técnico incierto con consulta de estado. Una repetición nunca ejecuta B; ni la respuesta ni los logs revelan validez de código en fallo técnico. Un nuevo UUID intencional sigue consumiendo presupuesto disponible. Cubre CA-07, CA-08, CA-11, CA-13, CA-14, CA-15, CA-19, CA-21, CA-22.

- [x] T27 · **Demostrar límite con fallos y reinicios.** Ejecutar las pruebas anteriores y las de tests/test_race_concurrency.py preparadas antes del código correspondiente. Usar conexiones independientes y barreras para 50 envíos a una plaza, 15 plazas/45 reservas, repeticiones concurrentes y caídas A/B. Contar invocaciones reales: tres reservas seguidas de rollback de B, reapertura de app/base y cuarto envío nunca superan tres evaluaciones. Registrar resultado del backend, sin presentar el experimento SQLite de diseño como prueba de esta implementación. Cubre CA-07, CA-08, CA-09, CA-13, CA-14, CA-15, CA-18, CA-22.

## Cierre y compatibilidad

- [x] T28 · **Pruebas de cierre y retirada primero.** Preparar en test_race_usecases.py los casos de cierre manual/idempotente, último éxito, retirada de asistencia y exportación real. Incluir reserved entre A/B, borrado tras caducar, resultados antiguos y orden por confirmación. Nunca dar por bueno un test que elimine la protección para obtener verde. Cubre CA-14, CA-15, CA-16, CA-17, CA-19, CA-20, CA-23.

- [x] T29 · **Cerrar sin devolver consumo.** Implementar close: closed_at estable, secreto de entrada borrado, escrituras revocadas y reservas conservadas hasta expires_at. Verificar que cerrar entre A/B impide comprobar y que el propio último éxito sigue recuperable. No exigir que todos terminen para cierre manual ni inventar asistencias. Cubre CA-04, CA-05, CA-14, CA-16, CA-19, CA-20.

- [x] T30 · **Retirar asistencia.** Implementar remove_checkin en la acción de carrera: verificar pertenencia, marcar retirado, borrar checkin y referencias en una transacción. Recalcular puestos desde filas reales; una operación anterior no resucita asistencia ni acceso. Comprobar carrera abierta/cerrada/caducada. Cubre CA-09, CA-14, CA-15, CA-17, CA-19, CA-20.

- [x] T31 · **Datos de exportación de carrera.** Implementar la consulta de asistencias reales de carrera para exportar, con orden por ID confirmado y mismo formato/fechas existentes. No exportar lobby, acceso, intentos o nombres sin asistencia; no modificar asistencia/export.py si no lo exige la integración. Cubre CA-15, CA-17, CA-21, CA-23.

## Borde HTTP e integración

- [x] T32 · **Pruebas HTTP primero.** Preparar tests/test_race_api.py con Flask test_client, origen autorizado explícito y reloj: nueve rutas de plan.md §6, autorización, cookie, CSRF, cuerpos y estados. Cubrir 202, resultados guardados tras cierre/antes del límite, error técnico incierto y campos name/mode ignorados sin autoridad. Sin pantallas, qrcode ni servicios externos. Cubre CA-01, CA-02, CA-03, CA-04, CA-05, CA-06, CA-07, CA-10, CA-11, CA-12, CA-13, CA-14, CA-19, CA-21, CA-22, CA-24.

- [x] T33 · **Registro del adaptador.** Crear asistencia/race_http.py con registro de rutas concreto, traducción de resultados y configuración recibida, sin SQL ni decisiones de contador. Preparar helpers de no-store, límites de cuerpo y errores españoles; probar que también cubren rechazos y excepciones de las rutas nuevas. Añadir aquí la llamada de registro del adaptador en create_app de app.py, con configuración leída al atender cada petición: las pruebas HTTP usan la factoría real, no registran rutas a mano para ocultar que falta integración. La configuración del origen real en main y la limpieza quedan para T43. Cubre CA-06, CA-21, CA-22, CA-24.

- [x] T34 · **Preparación y lectura del profesor.** Añadir en race_http.py POST de preparar y GET de estado bajo /api/sessions. Usar X-Teacher-Token existente y origen configurado para joinUrl, sin token en enlace. Comprobar ausencia de código en lobby/countdown y de entrada tras Go; no implementar qr.svg de 007. Cubre CA-01, CA-05, CA-06, CA-18, CA-19, CA-21, CA-24.

- [x] T35 · **Acciones del profesor.** Añadir en race_http.py start/release/close con sus respuestas idempotentes o de fase; siempre protegidas por token de profesor. Un secreto QR o cookie de alumno nunca autoriza estas acciones. Comprobar clases ajenas/inexistentes y el cierre con cero resultados. Cubre CA-03, CA-04, CA-05, CA-06, CA-16, CA-24.

- [x] T36 · **Entrada del alumno y cookie.** Añadir lobby/join al adaptador: JSON, X-Race-Request, secreto vigente y controles de origen del plan. Tras commit correcto emitir cookie de carrera HttpOnly, SameSite=Strict, Path acotado, sin Domain y vigencia original; Secure en túnel explícito, excepción HTTP solo loopback de desarrollo. No devolver permiso en JSON ni registrar su valor. Cubre CA-02, CA-03, CA-04, CA-06, CA-18, CA-19, CA-21, CA-22, CA-24.

- [x] T37 · **Consulta propia y CSRF.** Añadir /me con cookie vigente, resumen propio de operaciones, tiempos y csrfToken ligado a permiso/carrera. Comparar secretos con compare_digest, impedir acceso ajeno y devolver sin código ni datos privados de otros. Después de caducar rechazar incluso éxitos guardados; el profesor conserva acceso a historial. Cubre CA-06, CA-09, CA-13, CA-14, CA-17, CA-18, CA-19, CA-21, CA-24.

- [x] T38 · **Adaptar el envío de código.** Añadir /attempt: cookie, X-Race-CSRF, origen fiable y cuerpo acotado antes de reservar; JSON inválido autorizado sigue la regla de operación ausente dentro de fase/presupuesto. Respetar 202/400/409/410/422/429/500/503, UUID y huella. No llamar al guard IP ni reevaluar una operación en el adaptador; no relanzar B por 503 o error técnico. Cubre CA-06, CA-07, CA-08, CA-10, CA-11, CA-13, CA-14, CA-15, CA-19, CA-21, CA-22, CA-24.

- [x] T39 · **Pruebas de rutas antiguas primero.** Ampliar pruebas de regresión/precedencia para carrera conocida, clase normal e ID inexistente: guard solo en las dos últimas; check_in directo no elude modo; consultas antiguas no filtran código; cierre, retirada y CSV conservan contratos normales. Incluir IP ya bloqueada y datos previos. Cubre CA-10, CA-11, CA-12, CA-16, CA-17, CA-21, CA-23.

- [x] T40 · **Desvío del registro habitual.** Modificar app.py y attendance.check_in para consultar modo real: carrera rechazada antes del guard y del validador, incluido cliente de terminal; normal/inexistente conserva guard antes de validar cuerpo/registro. Una acción de lectura obtiene modo, sin SQL en app.py ni mode elegido por quien envía. Cubre CA-10, CA-11, CA-12, CA-23.

- [x] T41 · **Consultas antiguas según modo.** Modificar las funciones de vista/lista/public_session en attendance.py para derivar fase de carrera, contar solo asistencias y ocultar código hasta open. Preservar respuestas normales; el alumno no recibe roster o secretos por consultas antiguas. Delegar en races sin crear dependencias de capas al revés. Cubre CA-05, CA-06, CA-12, CA-17, CA-18, CA-21, CA-23.

- [x] T42 · **Delegar cierre, borrado y exportación antiguos.** Modificar attendance.py para delegar sus operaciones de carrera en las acciones correspondientes, con sus contratos HTTP normales preservados. Sin commits anidados, recursión entre delegadores o exportación de metadatos de acceso; checkins normales mantienen checked_at,id y carreras usan ID de confirmación. Cubre CA-12, CA-14, CA-15, CA-16, CA-17, CA-21, CA-23.

- [x] T43 · **Configurar origen y limpieza en arranque.** Completar configuración y cleanup en app.py sobre el adaptador ya registrado en T33; no volver a registrar sus rutas. Configurar origen desde base_url real de túnel antes de servir o loopback explícito; no confiar en Host reenviado para enlaces/CSRF. Caducidad global en siguiente petición e inicialización, sin reevaluar reserved, reescribir carreras ya limpias ni borrar 006. Verificar que errores no admiten accesos vencidos. Cubre CA-06, CA-11, CA-18, CA-19, CA-20, CA-21, CA-22, CA-23, CA-24.

## Verificación y entrega

- [x] T44 · **Comprobar límites de arquitectura.** Extender tests/test_architecture.py a los módulos nuevos y ajustar solo expectativa de versión realmente ratificada. Comprobar dominio sin HTTP/SQL, almacenamiento sin reglas, usecases sin Flask y borde sin SQL; preservar historial y comprobar links actuales. No escribir tests de seguridad que solo busquen palabras. Cubre CA-21, CA-23, CA-24.

- [x] T45 · **Regresión completa y base anterior.** Ejecutar suite completa sobre copia, con regresión de clases normales y seguridad 006. Comparar con baseline: filas/fechas y definiciones anteriores intactas, schema solo aditivo, exportación y precedencia conservadas. Registrar comando/versiones/resultados; corregir causas de fallos sin debilitar tests y repetir solo checks afectados. Cubre CA-10, CA-11, CA-12, CA-17, CA-18, CA-19, CA-20, CA-21, CA-22, CA-23, CA-24.

- [x] T46 · **Ensayo acotado de red real.** Sobre copia ficticia, recorrer el contrato sin pantallas de juego por HTTP local y, si se usa, túnel autorizado. Verificar atributos de cookie, rechazo cross-site/origen manipulado y ciclo de registro. Probar 15 clientes misma IP más 50 envíos adversarios sin bloqueo colectivo y con contadores de evaluación en el proceso de prueba, sin añadir rutas de diagnóstico públicas al producto. Parar servidores/túneles propios y verificar puertos libres; no atacar sesiones ajenas ni mantener servicios esperando revisiones. Cubre CA-01, CA-02, CA-04, CA-05, CA-06, CA-07, CA-08, CA-10, CA-11, CA-12, CA-13, CA-14, CA-19, CA-21, CA-22, CA-24.

- [x] T47 · **Documentar arquitectura y contrato.** Actualizar docs/ARCHITECTURE.md con reserva A/B, estados reserved/completed/unconfirmed, único ejecutor de B, limpieza y responsabilidad de rutas antiguas. Documentar campos/errores/tiempos que 007 consume; enlazar issue/PR reales y no atribuir a 008 la interfaz o generación QR. Cubre CA-08, CA-09, CA-12, CA-13, CA-14, CA-15, CA-16, CA-18, CA-19, CA-20, CA-21, CA-22, CA-24.

- [x] T48 · **README de seguridad y comprobación.** Actualizar README.md con cómo comprobar contrato 008, reserva gastada sin resultado, consulta de estado y siguiente envío solo intencional. Explicar una vez límite 3/45, identidad débil, cierre de altas y excepción de Wi-Fi frente a clases normales. No afirmar que el juego está disponible ni añadir qrcode antes de 007. Cubre CA-01, CA-06, CA-07, CA-08, CA-09, CA-10, CA-13, CA-14, CA-15, CA-19, CA-21, CA-22, CA-23, CA-24.

- [x] T49 · **Manual con estado real.** Actualizar AGENTS.md con fase de 008, comandos y evidencia realmente obtenida. Separar aprobado, implementado, probado por agente, probado por Miguel y pendiente de peers; no reescribir evidencias cerradas. Indicar 007 como consumidor posterior, no terminado por aprobar este backend. Cubre CA-21, CA-23, CA-24.

- [ ] T50 · **Evidencia por criterio y prueba de Miguel.** Registrar en estas tareas resultado real de cada CA, tests exactos, fallos y correcciones, incluyendo 3/45 bajo rollback/reinicio y resultado unconfirmed. Presentar a Miguel demostración del contrato y pedir su prueba/revisión sin fingir que ya jugó a 007. Conservar copia ficticia sin servicios activos hasta esa prueba. No marcar una casilla por redactarla o citar el experimento de diseño. Cubre CA-01, CA-02, CA-03, CA-04, CA-05, CA-06, CA-07, CA-08, CA-09, CA-10, CA-11, CA-12, CA-13, CA-14, CA-15, CA-16, CA-17, CA-18, CA-19, CA-20, CA-21, CA-22, CA-23, CA-24.

- [ ] T51 · **Limpieza después de la prueba.** Tras la comprobación de Miguel, parar únicamente procesos propios, verificar puertos libres y retirar copia/bases ficticias. Conservar evidencia sanitizada sin IPs, cookies, códigos o secretos. Si detectó un fallo, resolverlo y verificar antes de eliminar el entorno que necesita; no dejar un servidor o túnel en marcha a la espera de reviews. Cubre CA-20, CA-21, CA-24.

- [ ] T52 · **Entregar la PR existente.** Actualizar la PR draft de T02 con diff exclusivo 008, título/assignee/Closes y enlace Development de su issue real, base staging y evidencia ejecutada. Guardar commits pequeños con flujo autorizado; sacar de draft y solicitar peers autorizados, incluido sergiocortessat, en el momento correspondiente. Exigir dos aprobaciones vigentes antes de merge, no cambiar base ni mezclar 007. Esta tarea no ejecuta Git durante la preparación documental. Cubre CA-23, CA-24.

## Matriz de cobertura

Las tareas de evidencia y publicación no sustituyen los tests específicos. Las referencias siguientes excluyen T50–T52 para que cada criterio tenga cobertura antes de la revisión final.

| Criterio | Tareas previas a entrega |
| --- | --- |
| CA-01 | T05, T06, T08, T09, T12, T13, T14, T32, T34, T46, T48 |
| CA-02 | T05, T06, T08, T09, T12, T13, T15, T16, T32, T36, T46 |
| CA-03 | T12, T13, T16, T17, T32, T35, T36 |
| CA-04 | T05, T07, T12, T13, T15, T17, T18, T29, T32, T35, T36, T46 |
| CA-05 | T05, T07, T13, T14, T15, T18, T21, T25, T29, T32, T34, T35, T41, T46 |
| CA-06 | T11, T13, T15, T16, T17, T19, T21, T22, T23, T32, T33, T34, T35, T36, T37, T38, T41, T43, T46, T48 |
| CA-07 | T05, T07, T08, T11, T22, T23, T24, T25, T26, T27, T32, T38, T46, T48 |
| CA-08 | T05, T07, T08, T09, T10, T11, T12, T22, T23, T24, T25, T26, T27, T38, T46, T47, T48 |
| CA-09 | T05, T07, T17, T18, T20, T21, T22, T23, T24, T25, T27, T30, T37, T47, T48 |
| CA-10 | T04, T32, T38, T39, T40, T45, T46, T48 |
| CA-11 | T22, T23, T26, T32, T38, T39, T40, T43, T45, T46 |
| CA-12 | T11, T32, T39, T40, T41, T42, T45, T46, T47 |
| CA-13 | T11, T22, T23, T24, T25, T26, T27, T32, T37, T38, T46, T47, T48 |
| CA-14 | T11, T19, T21, T22, T23, T24, T25, T26, T27, T28, T29, T30, T32, T37, T38, T42, T46, T47, T48 |
| CA-15 | T08, T09, T10, T11, T12, T22, T23, T24, T25, T26, T27, T28, T30, T31, T38, T42, T47, T48 |
| CA-16 | T05, T07, T12, T18, T20, T24, T25, T28, T29, T35, T39, T42, T47 |
| CA-17 | T08, T09, T12, T21, T24, T25, T28, T30, T31, T37, T39, T41, T42, T45 |
| CA-18 | T10, T11, T13, T14, T16, T18, T19, T20, T21, T24, T25, T27, T34, T36, T37, T41, T43, T45, T47 |
| CA-19 | T05, T07, T19, T20, T21, T22, T23, T24, T25, T26, T28, T29, T30, T32, T34, T36, T37, T38, T43, T45, T46, T47, T48 |
| CA-20 | T08, T09, T12, T19, T20, T28, T29, T30, T43, T45, T47 |
| CA-21 | T03, T04, T08, T09, T14, T16, T19, T20, T21, T26, T31, T32, T33, T34, T36, T37, T38, T39, T41, T42, T43, T44, T45, T46, T47, T48, T49 |
| CA-22 | T10, T22, T23, T24, T25, T26, T27, T32, T33, T36, T38, T43, T45, T46, T47, T48 |
| CA-23 | T02, T03, T04, T08, T09, T10, T28, T31, T39, T40, T41, T42, T43, T44, T45, T48, T49 |
| CA-24 | T01, T02, T15, T21, T32, T33, T34, T35, T36, T37, T38, T43, T44, T45, T46, T47, T48, T49 |

## Revisión interna de las tareas

- El flujo empieza con issue/rama/PR draft y deja la solicitud de peers para la entrega de esa misma PR. No se inventan aprobaciones ni se ejecutan los pasos Git por redactarlos.
- Dominio, SQL, acciones y HTTP tienen pruebas preparadas antes de su código. El fichero de concurrencia se crea en T13 y amplía en T22/T24 antes de las acciones que verifica; la factoría real registra las rutas desde T33. El límite se comprueba contando llamadas al validador, con conexiones independientes y fallos/reinicio reales del backend.
- La reserva A tiene una tarea distinta de B. Las repeticiones de reserved no pueden convertirse en otro ejecutor: se comprueba antes de integrar HTTP y otra vez desde sus rutas.
- Se prueba expresamente la caducidad alcanzada mientras B espera el bloqueo, para detectar un reloj leído demasiado pronto.
- El tercer intento reservado conserva su única evaluación; cierre, retirada, caducidad o éxito de la plaza entre A y B impiden comprobar. El orden de puestos procede de B.
- Se prueban commit incierto de A y B, respuesta perdida del último éxito, 202 sin resultado y distinto contenido para la misma operación. El consumo no desaparece por rollback de B.
- Se conservan los caminos antiguos y el modo normal mediante pruebas específicas de precedencia/datos; la protección no depende de ocultar un botón.
- La copia permanece disponible hasta la prueba de Miguel; servidores y túneles se paran entre ensayos y después se elimina la copia. El escaneo y juego visual son de 007.

## Resultados de ejecución

2026-10-24: [issue #328](https://github.com/venturars/neoland-102026/issues/328) creada con autorización de título/assignee. Implementación realizada en 008-local-implementation/asistenciapp, copia sin bases reales, entorno virtual ni cachés de partida. Baseline ejecutado: 145 passed. Primera suite: **206 passed in 3.34s**, que no cubría los dos fallos detectados después. Verificación tras corregirlos: **220 passed in 5.93s** (218 pruebas de aplicación y dos reproducciones externas conservadas); Python 3.14.8, Flask 3.1.3, pytest 9.1.1. El ensayo HTTP usa loopback, quince clientes y cincuenta envíos adversarios; servidores propios detenidos y puertos de prueba libres. Sin túnel nuevo, dependencias nuevas, cambios en static/ o modificaciones de código del checkout original.

- T01 y T03–T49: completadas; pruebas y matriz detalladas en [evidence.md](evidence.md).
- T02: excepción local ejecutada; rama/PR/Development pendientes hasta disponer de la base necesaria en staging. No hay PR 008 que actualizar todavía.
- T50: evidencia preparada y backend presentado; la prueba y aprobación final de Miguel siguen pendientes.
- T51: servidores de pruebas ya parados; se conserva esta copia sin servicios activos hasta revisión de Miguel y publicación. No se borra el único código nuevo.
- T52: pendiente de publicación, revisiones vigentes y entrega aislada. No hay commits, pushes o merges de 008.

Las correcciones del review resolvieron la causa: consulta de modo compatible con bases anteriores, limpieza antes de rechazos HTTP y huella serializable de entradas Unicode inválidas. No se retiraron pruebas antiguas ni se amplió presupuesto para conseguir verde.

## Autorización de ejecución

2026-10-24: Miguel indicó «Approved, let’s start implementing 008. Follow the tasks and review your work as you go». Aprueba estas tareas y autoriza su ejecución. Las puertas Git y la ratificación de enmienda se verifican sin inventar aprobaciones.

## Autorización de excepción local y estado Git

Miguel respondió «Approve issue creation» y «Proceed locally; publish later» al consultar el título/assignee y la puerta T02. Esta autorización permite la copia de implementación, no atribuye aprobaciones a las PR predecesoras ni levanta la puerta de publicación. Los resultados reales y las tareas pendientes están separados arriba.

## Reapertura de tareas durante la revisión de 008

Miguel autorizó corregir R1/R2 antes de aprobar el resultado final. Reabiertas T10/T19/T21/T26/T33/T43/T45: caducidad tras espera de lectura y clasificación de bloqueo antes de reserva. Las reproducciones se incorporan en tests/test_race_review_regressions.py antes del cambio de código. No se cambia la spec, la enmienda ni la puerta de publicación.

## Cierre de R1/R2 y revisión posterior

2026-10-24: T10/T19/T21/T26/T33/T43/T45 reabiertas y completadas después de corregir y volver a comprobar sus resultados. Las dos reproducciones se añadieron a tests/test_race_review_regressions.py primero: **2 failed in 0.68s** antes de modificar el código. Tras los cambios, la selección de casos de uso y reproducciones pasó **24 pruebas**; ampliada con regresiones de lecturas, conexión y confirmación pasó **64 pruebas**. El resultado final ejecutado es **220 passed in 5.93s**: 218 de la aplicación y las dos reproducciones originales externas.

- R1 / T19–T21: se valida la caducidad con reloj fresco después de cargar la carrera y otra vez después de construir el resultado propio o lobby. La lectura se revierte antes de limpiar lo vencido. Hay pruebas con espera de lectura real y con el límite alcanzado al cargar el cuerpo, tanto exactamente en el límite como después.
- R2 / T10/T26/T33/T43: contención real al abrir/configurar conexión, consultar limpieza y leer se traduce a 503 antes de una reserva nueva. Se reconocen códigos BUSY/LOCKED, no palabras de un mensaje arbitrario. La conexión se cierra si falla su inicialización. La fase B convierte el bloqueo previo a su ejecución en 202, conservando A; los fallos de commit tras evaluar siguen siendo técnicos inciertos, sin refundar ni reevaluar.
- T45: suite completa con clases normales, 006, concurrencia, fallos de A/B y ensayo HTTP real. Servidor de prueba detenido y puerto libre comprobados por el test. No se cambiaron dependencias, static/, constitución o código del checkout original.
- T47–T49: evidencia y documentación actualizadas; corregido el ejemplo del reloj callable y los resultados descritos de los helpers HTTP.

La revisión posterior no encontró otros defectos que bloqueen la aprobación de esta implementación local. No equivale a aprobación o prueba de Miguel ni a publicación. T02/T50/T51/T52 mantienen las partes pendientes ya descritas.


2026-10-25: Miguel indicó «ok apruebo 008, sigamos con la implementación de 007, sigue las tareas y revisa mientras avanzas». Aprobación final del resultado local de 008 registrada; no atribuye una prueba manual del juego, publicación ni aprobación de peers. Se conserva esta copia como base revisada para 007.


## Publicación autorizada · 2026-10-26

Miguel ordenó «sube todas las prssss omggg». Esta instrucción sustituye la espera de publicación condicionada a las predecesoras: se publica esta tarea ahora con base fija staging y sus dependencias pendientes explícitas. La PR es [#354](https://github.com/venturars/neoland-102026/pull/354), asignada a mglnglxx. No se autoriza merge sin las revisiones requeridas. Las aprobaciones y pruebas anteriores no se atribuyen a compañeros. Se conservan commits separados por tarea; los cambios acumulados de la base se explican en la descripción y se ofrece comparación exclusiva del paso.

## Preparación final para revisión · 2026-10-26

Miguel autorizó terminar y publicar el trabajo pendiente. Se incorporó la rama actualizada de 006, que ya contiene el staging posterior a #252 y #284. La aplicación de 008 conserva su código anterior; la comparación exclusiva contra 006 contiene 27 archivos de este paso. La PR sigue apuntando a staging y debe fusionarse después de #353.

Nueva ejecución en una copia desechable, con datos ficticios y el entorno existente: `PYTHONDONTWRITEBYTECODE=1 python -m pytest -q -p no:cacheprovider`, **218 pruebas aprobadas en 5,23 s**. La copia se retiró al terminar; no se iniciaron servicios persistentes. La aprobación del backend por Miguel consta arriba; no equivale a afirmar que probó manualmente cada escenario ni a una aprobación de compañeros. Las notas anteriores de ausencia de PR describen el estado del 24 de octubre y quedan sustituidas por la publicación de #354.
