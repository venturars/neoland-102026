# Evidencia 008 · Ejecución local del 24 de octubre de 2026

## Resultado

**220 passed in 5.93s** tras las correcciones del review: 218 pruebas de aplicación y las dos reproducciones originales conservadas fuera de la app. Entorno: Python 3.14.8, Flask 3.1.3 y pytest 9.1.1. Baseline ejecutado antes del código: **145 passed**. Issue real: [#328](https://github.com/venturars/neoland-102026/issues/328), asignada a mglnglxx. No hay rama o PR 008 publicada.

Miguel aprobó spec, plan, tareas, creación de issue y la excepción «Proceed locally; publish later». La enmienda aprobada 4.0 está aplicada solo a la copia de implementación. La revisión/prueba de Miguel y la publicación siguen pendientes; pytest no las sustituye.

## Reproducción

Desde la copia asistenciapp, con el entorno activado:

```bash
python -m pytest -q tests ../review-checks/test_008_review.py
python -m pytest -q tests/test_race_live_http.py
```

El primer comando reproduce las 220 comprobaciones en esta copia; `python -m pytest -q` dentro de la app recoge sus 218 pruebas. Las dos comprobaciones externas también están incorporadas en la suite de aplicación para futuras PRs. El comando de la suite final se ejecutó con el Python del entorno virtual ya instalado en la copia original. No se instalaron paquetes. Se permitió loopback para el test de puerto existente y el ensayo HTTP; no se usó Cloudflare ni se accedió a otra clase. Todas las bases de pruebas son ficticias y temporales.

## Revisión y correcciones

- Las primeras selecciones red detectaron módulos de dominio/almacén/acciones ausentes y la factoría sin configuración de carrera. Se implementaron contra esas pruebas. La primera regresión completa detectó incompatibilidad con bases sin tablas de carrera: se movió la consulta de modo a la conexión normal existente y se comprueba sqlite_master, conservando operaciones antiguas y sus pruebas de cierre de conexiones.
- Las pruebas de fallos ampliadas detectaron limpieza que no corría al devolver 401: el hook de limpieza ahora se registra antes de la autorización del profesor. Se comprueba también en inicialización, en varias carreras vencidas y manteniendo una reciente.
- La revisión de entradas detectó huellas que no podían codificar un sustituto Unicode aislado. Se serializan con escape ASCII antes del HMAC: el envío inválido gasta una oportunidad, devuelve 422 y no llama al validador. El test usa JSON escapado real; su primer intento con el constructor JSON de Flask falló antes de llegar al servidor y se corrigió el payload de la prueba.
- Las pruebas de commit incierto antes/después de A/B, caída después de A, rollback tras evaluar/insertar, espera del bloqueo hasta caducidad y tercer intento reservado cuentan llamadas reales al validador. No se reanuda una reserva en un retry ni se devuelve consumo. No hay asistencias parciales tras rollback B.
- Se conservaron todas las pruebas antiguas. Solo cambian expectativas documentales de versión por la enmienda ratificada y se extienden los límites de arquitectura a los módulos nuevos. No se alteraron reglas de las clases normales para conseguir verde.

## Ensayo HTTP real

`test_real_http_shared_wifi_attack_and_complete_race` levanta la factoría real en 127.0.0.1 sobre un puerto efímero, usando HTTPConnection y permisos separados. Comprueba la cookie, no-store y un origen ajeno rechazado sin consumir.

Primera carrera: catorce clientes registran y otro envía cincuenta códigos erróneos: **14 aciertos, 3 errores de código y 47 rechazos por agotamiento; 17 llamadas al validador**. El profesor cierra sin inventar la asistencia que falta. Segunda carrera: **15 aciertos y 15 llamadas**, cierre automático y puestos consecutivos. Todos comparten la misma dirección. El servidor se detiene en finally; el hilo termina y se comprueba que ya no hay escucha en su puerto.

La prueba separada de quince clientes sobre una IP ya bloqueada demuestra que la carrera no usa ni borra ese bloqueo, y que una clase normal continúa rechazando esa misma dirección. Otra prueba cuenta el máximo de **45 evaluaciones** aunque una persona ocupe las quince plazas; eso no demuestra identidad de quienes las ocupan.

## Evidencia por criterio

Los nombres siguientes corresponden a pruebas ejecutadas de tests/test_race_*.py, salvo rutas indicadas. «Pasa» describe el backend comprobado; no implica revisión humana o juego visual terminado.

| Criterio | Comprobación ejecutada | Resultado |
| --- | --- | --- |
| CA-01 | test_unique_roster_and_normalization; test_teacher_is_required_and_host_cannot_poison_entry; test_other_race_credentials_and_entry_cannot_control_a_slot | Pasa |
| CA-02 | test_join_collision_and_parallel_attempts; test_unique_roster_and_normalization | Pasa |
| CA-03 | test_lobby_exclusive_release_and_shared_start | Pasa |
| CA-04 | test_lobby_exclusive_release_and_shared_start; test_join_racing_start_is_included_or_rejected_without_late_arrival | Pasa |
| CA-05 | test_server_phase; test_lobby_exclusive_release_and_shared_start; test_application_restart_preserves_phase_group_and_original_deadline; tests/test_codes.py | Pasa |
| CA-06 | test_unauthorized_request_does_not_consume; test_teacher_is_required_and_host_cannot_poison_entry; test_other_race_credentials_and_entry_cannot_control_a_slot | Pasa |
| CA-07 | test_third_attempt_can_win_and_last_success_replays; test_budget_exhausted_never_checks_fourth; test_body_limits_and_malformed_authorized_request; test_malformed_unicode_code_spends_attempt_without_evaluation | Pasa |
| CA-08 | test_join_collision_and_parallel_attempts; test_all_fifteen_claimed_slots_still_have_only_forty_five_evaluations; test_durable_reservation_survives_result_rollback_and_restart | Pasa |
| CA-09 | test_rotation_restart_address_and_missing_cookie_do_not_reset_budget; test_full_flow_cookie_no_cache_and_recovery | Pasa |
| CA-10 | test_fifteen_clients_share_a_blocked_ip_without_losing_normal_policy; test_owned_slot_attack_does_not_spend_other_fourteen_budgets; test_real_http_shared_wifi_attack_and_complete_race | Pasa |
| CA-11 | test_unknown_origin_and_wrong_access_do_not_spend; tests/test_registration_security.py (origen directo/túnel) | Pasa |
| CA-12 | test_old_paths_cannot_bypass_or_ban; test_full_flow_cookie_no_cache_and_recovery | Pasa |
| CA-13 | test_same_operation_concurrent_retries_evaluate_only_once; test_process_dies_after_a_does_not_resume_on_retry; test_commit_uncertainty_is_not_execution_permission | Pasa |
| CA-14 | test_third_attempt_can_win_and_last_success_replays; test_technical_error_logs_no_secret_and_replay_keeps_reservation | Pasa |
| CA-15 | test_durable_reservation_survives_result_rollback_and_restart; test_commit_uncertainty_is_not_execution_permission; test_confirmation_order_is_not_reservation_order_or_timestamp | Pasa |
| CA-16 | test_close_between_a_and_b_does_not_evaluate; test_third_attempt_can_win_and_last_success_replays; test_expiry_while_waiting_for_b_uses_clock_after_lock | Pasa |
| CA-17 | test_full_flow_cookie_no_cache_and_recovery; test_expiry_before_saved_success_and_removal; test_confirmation_order_is_not_reservation_order_or_timestamp | Pasa |
| CA-18 | test_application_restart_preserves_phase_group_and_original_deadline; test_rotation_restart_address_and_missing_cookie_do_not_reset_budget; test_process_dies_after_a_does_not_resume_on_retry | Pasa |
| CA-19 | test_expiry_before_saved_success_and_removal; test_expiry_even_with_existing_cookie_and_success; test_expiry_while_waiting_for_b_uses_clock_after_lock; test_private_result_rechecks_expiry_after_waiting_for_read; test_private_read_rechecks_expiry_after_loading_payload | Pasa tras corrección y regresión |
| CA-20 | test_startup_cleans_all_expired_races_but_preserves_live_race; test_cleanup_runs_even_on_unauthorized_teacher_request; test_fifteen_clients_share_a_blocked_ip_without_losing_normal_policy; test_private_read_rechecks_expiry_after_loading_payload | Pasa tras corrección y regresión |
| CA-21 | test_technical_error_logs_no_secret_and_replay_keeps_reservation; test_teacher_is_required_and_host_cannot_poison_entry; test_https_cookie_does_not_follow_forged_proto; inspección de tablas nuevas sin dirección ni código en claro | Pasa |
| CA-22 | test_body_limits_and_malformed_authorized_request; test_chunked_body_and_unicode_false_credentials_are_rejected; test_lock_before_a_and_after_a_have_different_consumption; test_commit_uncertainty_is_not_execution_permission; test_exclusive_lock_before_reservation_is_retryable_503; test_busy_during_read_query_is_retryable_without_spending; test_exclusive_lock_during_b_connection_keeps_reservation_unconfirmed; test_commit_lock_after_evaluation_is_not_an_unspent_retry; test_non_contention_sql_error_is_not_mislabeled_as_retryable; test_connection_is_closed_if_pragma_initialization_fails | Pasa tras corrección y regresión |
| CA-23 | test_existing_006_database_keeps_every_definition_row_and_timestamp; tests/test_attendance.py; tests/test_checkin_precedence.py; tests/test_export.py; tests/test_registration_security.py | Pasa |
| CA-24 | tests/test_race_api.py; tests/test_race_live_http.py; tests/test_architecture.py; revisión documental de contrato y mensajes | Pasa |

## Conservación y entrega

El manifiesto inicial se conserva junto a la copia. Todos sus archivos en el checkout original conservan sus hashes de partida. Los archivos static/ y requirements.txt de la copia también conservan esos hashes. No se copió ni abrió una base real. La prueba de migración usa el esquema 006 anterior, guardado como tests/fixtures/008-baseline.sql, e inserta solo datos ficticios: compara todas las definiciones anteriores, filas, fechas, secuencia y tablas de seguridad antes/después de la inicialización aditiva.

Todos los módulos nuevos pasan las comprobaciones de dependencias; sus funciones nuevas llevan tipos y documentación :param/:return/:rtype/Usage::. La copia contiene el contrato y las pruebas, sin servicios activos. La interfaz, QR y dibujos de 007 no están implementados.

T02 conserva pendiente la publicación exclusiva a staging cuando existan sus predecesoras; habrá que verificar el diff, los enlaces a 007 y Development antes de solicitar revisiones. T50 espera la prueba/revisión final de Miguel. T51 conserva el código sin servicios mientras esa revisión y la publicación estén pendientes. T52 espera PR y dos aprobaciones vigentes; no se ha hecho commit, push o merge de 008.

Límite aceptado: la entrada compartida permite ocupar nombres ajenos antes de Go y no garantiza disponibilidad frente a saturación. La protección comprobada limita evaluaciones, conserva consumo tras fallos y separa presupuestos por plaza.

## R1/R2: correcciones posteriores al primer informe

La suite inicial de 206 pruebas pasó, pero el review encontró dos casos que no cubría. Sus reproducciones añadidas a la app fallaron antes de los cambios (**2 failed in 0.68s**) y ahora pasan. El informe inicial queda como registro histórico, no como estado actual de esos defectos.

**R1, caducidad de lectura:** una lectura iniciada a 7199 segundos podía esperar y devolver un resultado después de 7200 usando el reloj anterior a la consulta. Ahora me y lobby leen el reloj después de cargar metadatos y vuelven a comprobarlo después de cargar los datos de respuesta. Si caducó, devuelven 410 sin datos privados; la transacción de lectura se libera antes de la limpieza global. Se conservan la instantánea coherente y el plazo original. Pruebas: espera con conexión EXCLUSIVE independiente, resultados confirmados, y caducidad al cargar operations/slots exactamente a 7200 y después.

**R2, contención antes de A:** el código solo reconocía bloqueo en BEGIN IMMEDIATE. Ahora la apertura/configuración y las consultas previas también traducen los códigos SQLite BUSY/LOCKED a 503 con Retry-After: 1. Un fallo de inicialización cierra su conexión. No se amplía esa traducción a errores de E/S o al commit de B: esas situaciones mantienen el error técnico y la consulta posterior de estado. Un bloqueo al abrir la conexión de B devuelve 202, conservando el consumo. Se prueba un bloqueo real de COMMIT después de evaluar: A permanece reserved, no hay asistencia parcial y repetir no evalúa otra vez.

Selección intermedia ampliada: **64 passed in 3.29s**. Verificación final completa: **220 passed in 5.93s**, con las pruebas reales de HTTP, quince clientes, cincuenta envíos adversarios y regresión normal/006 incluidas. La matriz de CA-19/CA-20/CA-22 se actualizó con las regresiones nuevas; las casillas reabiertas de tareas solo se cerraron después de esos resultados.

Revisión final: las dos causas están corregidas, sin modificar requisitos o enmiendas, presupuesto 3/45, fases, identidad aceptada o contratos de clases normales. No quedan defectos conocidos que bloqueen presentar el backend local a Miguel. No se atribuye aprobación de Miguel, revisiones de compañeros, PR publicada o merge.

Revisión final detallada: [review.md](review.md).
